import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, Message, streamText } from "ai";
import { ExaClient } from "@agentic/exa";
import { createAISDKTools } from "@agentic/ai-sdk";
import { db } from "@/db";
import { threads } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/app/actions/auth";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, thread_id }: { messages: Message[]; thread_id: string } =
    await req.json();
  const exa = new ExaClient();

  const coreMessages = convertToCoreMessages(messages);

  const stream = streamText({
    model: openai("gpt-4o-mini"),
    tools: createAISDKTools(exa),
    system: `You are a helpful assistant. Search the web before answering any questions.
    Only respond to questions using information from tool calls.
    Whenever you use information from one of the web search tools calls, include the url like so "(ref: <the url>)"
    Don't mention anything about reading more on the topic. Just include the urls as a reference.`,
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
