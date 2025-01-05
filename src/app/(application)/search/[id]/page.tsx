import { db } from "@/db";
import Chat from "./chat";
import { Message } from "ai";
import { threads } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const session = (await auth()) ?? redirect("/login");
  const userId = session.user?.id ?? redirect("/login");
  const thread = (await db
    .select()
    .from(threads)
    .where(and(eq(threads.id, id), eq(threads.userId, userId)))) as {
    id: string;
    userId: string;
    messages: Message[];
  }[];

  return <Chat id={thread[0].id} initialMessages={thread[0].messages} />;
}
