import { db } from "@/db";
import Chat from "./chat";
import { CoreMessage } from "ai";
import { threads } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/app/actions/auth";
import { notFound, redirect } from "next/navigation";
import { convertToUIMessages } from "@/lib/utils";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const session = (await auth()) ?? redirect("/login");
  const userId = session.user?.id ?? redirect("/login");
  const threadFromDB = (await db
    .select()
    .from(threads)
    .where(and(eq(threads.id, id), eq(threads.userId, userId)))) as {
    id: string;
    userId: string;
    title: string;
    messages: CoreMessage[];
  }[];

  if (threadFromDB.length == 0) notFound();

  const thread = {
    ...threadFromDB[0],
    messages: convertToUIMessages(threadFromDB[0].messages),
  };

  return <Chat id={thread.id} initialMessages={thread.messages} />;
}
