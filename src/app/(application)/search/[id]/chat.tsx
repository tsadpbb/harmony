"use client";
import { Message, useChat } from "ai/react";
import { useEffect } from "react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

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
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m.id} className="whitespace-pre-wrap">
            <div>
              <div className="font-bold">{m.role}</div>
              {m.toolInvocations && m.toolInvocations.length > 0 && (
                <div className="flex flex-col">
                  <span className="italic font-light">
                    {"calling tool: " + m.toolInvocations?.[0].toolName}
                  </span>
                  <span className="italic font-light">
                    {"tool output: " + m.toolInvocations?.[0].state}
                  </span>
                </div>
              )}
              {m.content.length > 0 && (
                <Markdown
                  components={{
                    code(props) {
                      const { children, className, ...rest } = props;
                      const match = /language-(\w+)/.exec(className || "");
                      return match ? (
                        <SyntaxHighlighter
                          {...rest}
                          PreTag="div"
                          language={match[1]}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code {...rest} className={className}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {m.content}
                </Markdown>
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
