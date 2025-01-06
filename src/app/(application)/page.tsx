"use client";

import { Input } from "@/components/ui/input";
import { newThread } from "../actions";
import { useTransition } from "react";
import { LoaderCircle } from "lucide-react";

export default function Home() {
  const [isPending, startTransition] = useTransition();

  function formAction(formData: FormData) {
    startTransition(async () => {
      await newThread(formData);
    });
  }

  return (
    <div className="flex flex-col w-full max-w-2xl py-24 mx-auto stretch">
      <form
        className="fixed flex rounded-md border border-input items-center bor bottom-0 w-full max-w-2xl p-2 mb-8"
        action={formAction}
      >
        <Input
          name="content"
          className="border-none focus-visible:ring-0"
          placeholder="Say something..."
          disabled={isPending}
        />
        {isPending && <LoaderCircle className="animate-spin" />}
      </form>
    </div>
  );
}
