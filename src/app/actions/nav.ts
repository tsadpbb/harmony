"use server";

import { Message } from "ai";
import { notFound, redirect } from "next/navigation";
import { nanoid } from "nanoid";
import { db } from "@/db";
import { threads } from "@/db/schema";
import { auth } from "./auth";
import { revalidatePath } from "next/cache";

export async function newThread(formData: FormData) {
  const content = (formData.get("content") as string) ?? notFound();
  const messages: Message[] = [
    {
      id: nanoid(),
      content: content,
      role: "user",
    },
  ];
  const id = nanoid();
  const session = (await auth()) ?? redirect("/login");
  const userId = session.user?.id ?? redirect("/login");

  await db.insert(threads).values({
    id: id,
    userId: userId,
    messages: messages,
  });

  revalidatePath("/");

  redirect(`/search/${id}`);
}
