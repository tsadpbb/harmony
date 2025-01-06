"use client";

import { Input } from "@/components/ui/input";
import { newThread } from "../actions";

export default function Home() {
  return (
    <div className="flex flex-col w-full max-w-2xl py-24 mx-auto stretch">
      <form action={newThread}>
        <Input
          name="content"
          className="fixed bottom-0 w-full max-w-2xl p-2 mb-8"
          placeholder="Say something..."
        />
      </form>
    </div>
  );
}
