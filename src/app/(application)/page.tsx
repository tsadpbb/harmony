"use client";

import { newThread } from "../actions";

export default function Home() {
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <form action={newThread}>
        <input
          name="content"
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          placeholder="Say something..."
        />
      </form>
    </div>
  );
}
