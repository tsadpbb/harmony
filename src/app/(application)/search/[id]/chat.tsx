"use client";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Message, useChat } from "ai/react";
import { useEffect } from "react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Sources } from "./sources";
import { exa } from "@agentic/exa";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

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
      reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col w-full max-w-2xl py-24 mx-auto stretch">
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="whitespace-normal">
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
                      className="mb-10 flex flex-col gap-4"
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
                        a(props) {
                          const { children, className, ...rest } = props;
                          return (
                            <a
                              {...rest}
                              className={cn(
                                "text-sky-400 underline",
                                className
                              )}
                              target="_blank"
                            >
                              {children}
                            </a>
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

      <form
        className="fixed flex rounded-md border border-input items-center bor bottom-0 w-full max-w-2xl p-2 mb-8"
        onSubmit={handleSubmit}
      >
        <Input
          className="border-none focus-visible:ring-0"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
        {isLoading && <LoaderCircle className="animate-spin" />}
      </form>
    </div>
  );
}
