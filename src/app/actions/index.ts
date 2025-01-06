"use server";

import { Message } from "ai";
import { notFound, redirect } from "next/navigation";
import { nanoid } from "nanoid";
import { db } from "@/db";
import { threads } from "@/db/schema";
import { auth, signIn } from "./auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { AuthError } from "next-auth";
import { and, eq } from "drizzle-orm";

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
    title: content,
  });

  revalidatePath("/");

  redirect(`/search/${id}`);
}

export async function deleteThread({ id }: { id: string }) {
  const session = (await auth()) ?? redirect("/login");
  const userId = session.user?.id ?? redirect("/login");

  await db
    .delete(threads)
    .where(and(eq(threads.id, id), eq(threads.userId, userId)));

  revalidatePath("/");
}

export async function logIn(
  prevMessage: { message: string; isError: boolean },
  formData: FormData
) {
  const loginSchema = z.object({
    email: z.string().email(),
  });
  const parse = loginSchema.safeParse({ email: formData.get("email") });

  if (!parse.success) {
    return { message: "Invalid Email", isError: true };
  }

  try {
    await signIn("resend", { redirectTo: "/", email: parse.data.email });
    return { message: "success", isError: false };
  } catch (error) {
    if (error instanceof AuthError)
      return { message: "Authentication Error", isError: true };
    throw error;
  }
}
