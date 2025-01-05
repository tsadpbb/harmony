"use client";
import { Message, useChat } from "ai/react";
import { useEffect } from "react";

export default function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Message[];
}) {
  const { messages, input, handleInputChange, handleSubmit, reload } = useChat({
    initialMessages: initialMessages,
    id: id,
    body: { thread_id: id },
  });

  useEffect(() => {
    if (messages[messages.length - 1].role == "user") {
      reload();
    }
  }, [messages, reload]);

  return (
    <div className="flex flex-col w-full max-w-5xl py-24 mx-auto stretch">
      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m.id} className="whitespace-pre-wrap">
            <div>
              <div className="font-bold">{m.role}</div>
              {m.content.length > 0 ? (
                m.content
              ) : (
                <div className="flex flex-col">
                  <span className="italic font-light">
                    {"calling tool: " + m?.toolInvocations?.[0].toolName}
                  </span>
                  <span className="italic font-light">
                    {"tool output: " + m.toolInvocations?.[0].state}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 mx-auto w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
