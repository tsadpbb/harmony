import { openai } from "@ai-sdk/openai";
import { CoreMessage, Message, streamText } from "ai";
import { ExaClient } from "@agentic/exa";
import { createAISDKTools } from "@agentic/ai-sdk";
import { nanoid } from "nanoid";
import { db } from "@/db";
import { threads } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/app/actions/auth";
import { redirect } from "next/navigation";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    thread_id,
  }: { messages: CoreMessage[]; thread_id: string } = await req.json();
  const exa = new ExaClient();

  const stream = streamText({
    model: openai("gpt-4o-mini"),
    tools: createAISDKTools(exa),
    system: `You are a helpful assistant. Search the web before answering any questions.
    Only respond to questions using information from tool calls.
    Whenever you use information from one of the web search tools calls, include the url like so "(ref: <the url>)"
    Don't mention anything about reading more on the topic. Just include the urls as a reference.`,
    messages,
    maxSteps: 10,
    onFinish: async ({ text, toolResults }) => {
      const session = (await auth()) ?? redirect("/login"); // find a better way to do this
      const userId = session.user?.id ?? redirect("/login");

      const currentThread = (await db
        .select()
        .from(threads)
        .where(and(eq(threads.id, thread_id), eq(threads.userId, userId)))) as {
        id: string;
        userId: string;
        messages: Message[];
      }[];

      const oldMessages = currentThread[0].messages;

      let newMessage: Message = {
        id: nanoid(),
        role: "assistant",
        content: text,
      };
      if (toolResults.length > 0) {
        newMessage = {
          ...newMessage,
          toolInvocations: toolResults.map((tool) => {
            return { ...tool, state: "result" };
          }),
        };
      }
      oldMessages.push(newMessage);

      await db
        .update(threads)
        .set({ messages: oldMessages })
        .where(and(eq(threads.id, thread_id), eq(threads.userId, userId)));
    },
  });

  return stream.toDataStreamResponse();
}
