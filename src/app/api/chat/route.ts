import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, Message, streamText, tool } from "ai";
import { ExaClient } from "@agentic/exa";
import { createAISDKTools } from "@agentic/ai-sdk";
import { db } from "@/db";
import { threads } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/app/actions/auth";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, thread_id }: { messages: Message[]; thread_id: string } =
    await req.json();
  const exa = new ExaClient();

  const coreMessages = convertToCoreMessages(messages);

  const stream = streamText({
    model: openai("gpt-4o-mini"),
    tools: {
      // This tool is from https://github.com/zaidmukaddam/miniperplx/blob/main/app/api/chat/route.ts
      thinking_canvas: tool({
        description:
          "Write your plan of action in a canvas based on the user's input.",
        parameters: z.object({
          title: z.string().describe("The title of the canvas."),
          content: z.array(z.string()).describe("The content of the canvas."),
        }),
        execute: async ({
          title,
          content,
        }: {
          title: string;
          content: string[];
        }) => {
          return { title, content };
        },
      }),
      ...createAISDKTools(exa),
    },
    // Inspiration from https://github.com/zaidmukaddam/miniperplx/blob/main/app/actions.ts
    system: `You are an expert AI web search engine named Harmony, designed to assist users in finding accurate and relevant information on the internet. Your role is to provide clear, concise, and well-supported answers without unnecessary commentary.

      **Key Directive:**  
      **Always run the tool exactly once before drafting your response.** This step is mandatory and must not be skipped or repeated unnecessarily.

      ---

      ### Objectives:
      1. **Adhere to Guidelines:**  
        Maintain awareness of the rules and follow them rigorously.

      2. **Provide Reliable Information:**  
        - Responses must be factual and accurate, based on verified sources.  
        - Avoid hallucinations or unsupported claims, and include citations where appropriate.

      3. **Ensure Clarity and Precision:**  
        - Format responses thoughtfully for readability and organization.
        - Strive for accuracy while remaining concise and to the point.

      **Today’s date:** '${new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        weekday: "short",
      })}'  

      Comply fully with user requests using the appropriate tools.

      ---

      ### Response Protocol:

      #### 1. **Tool Execution:**
        - Use the 'thinking_canvas' tool to plan and execute necessary actions.  
        - Run the required tool before beginning to write your response.  
        - Avoid redundant tool usage by not running the same tool with identical parameters more than once.  

      #### 2. **Content Requirements:**
        - Deliver detailed, informative responses structured like a textbook.  
        - Use clear headings and organize information effectively:  
          - Favor bullet points over lengthy paragraphs but ensure points are comprehensive.  
          - Embed citations immediately after relevant statements, rather than listing them separately.  
        - Never truncate sentences in citations; ensure the full sentence is included before citing.

      #### 3. **Formatting Standards:**
        - For equations, use inline '$' and block '$$' LaTeX formatting.  
        - Use "USD" or the equivalent for monetary values instead of the '$' symbol.
        
      #### 4. **Citations Rules:**
        - Place citations after completing the sentence or paragraph they support.  
        - Format: [Source Title](URL).  
        - Ensure citations adhere strictly to the required format to avoid response errors.`,
    messages: coreMessages,
    maxSteps: 10,
    onFinish: async ({ response }) => {
      const session =
        (await auth()) ??
        (() => {
          throw new Error("No session");
        })();
      const userId =
        session.user?.id ??
        (() => {
          throw new Error("No UserID");
        })();

      const responseMessages = response.messages;

      const currentThread = (await db
        .select()
        .from(threads)
        .where(and(eq(threads.id, thread_id), eq(threads.userId, userId)))) as {
        id: string;
        userId: string;
        messages: Message[];
      }[];

      if (currentThread.length == 0)
        throw new Error("No thread of this ID found");

      await db
        .update(threads)
        .set({ messages: [...coreMessages, ...responseMessages] })
        .where(and(eq(threads.id, thread_id), eq(threads.userId, userId)));
    },
  });

  return stream.toDataStreamResponse();
}
