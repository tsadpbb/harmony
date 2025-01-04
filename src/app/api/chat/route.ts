import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { ExaClient } from "@agentic/exa";
import { createAISDKTools } from "@agentic/ai-sdk";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const exa = new ExaClient();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    tools: createAISDKTools(exa),
    system: `You are a helpful assistant. Search the web before answering any questions.
    Only respond to questions using information from tool calls.
    Whenever you use information from one of the web search tools calls, include the url like so "(ref: <the url>)"
    Don't mention anything about reading more on the topic. Just include the urls as a reference.`,
    messages,
    maxSteps: 10,
  });

  return result.toDataStreamResponse();
}
