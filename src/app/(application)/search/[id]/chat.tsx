"use client";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Message, useChat } from "ai/react";
import { useEffect } from "react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Sources } from "./sources";
import { exa } from "@agentic/exa";

export default function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Message[];
}) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    reload,
    isLoading,
  } = useChat({
    initialMessages: initialMessages,
    id: id,
    body: { thread_id: id },
  });

  useEffect(() => {
    if (messages[messages.length - 1].role == "user" && !isLoading) {
      console.log("HLEP");
      reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col w-full max-w-2xl py-24 mx-auto stretch">
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="whitespace-pre-wrap">
            <div>
              {message.toolInvocations?.map((tool) => {
                if (tool.toolName == "exa_search") {
                  if (tool.state == "result") {
                    const result: exa.SearchResponse = tool.result;
                    return <Sources key={tool.toolCallId} result={result} />;
                  } else {
                    return (
                      <Skeleton
                        key={tool.toolCallId}
                        className="h-20 w-full max-w-2xl"
                      />
                    );
                  }
                }
              })}
              {message.role == "user"
                ? message.content.length > 0 && (
                    <div className="text-3xl">{message.content}</div>
                  )
                : message.content.length > 0 && (
                    <Markdown
                      className="mb-10"
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
                      {message.content}
                    </Markdown>
                  )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <Input
          className="fixed bottom-0 mx-auto w-full max-w-2xl p-2 mb-8"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
