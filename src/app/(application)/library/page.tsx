import { auth } from "@/app/actions/auth";
import { Thread } from "@/app/types";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/db";
import { threads } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { DeleteButton } from "./delete-button";

export default async function Page() {
  const session = (await auth()) ?? redirect("/login");
  const userId = session.user?.id ?? redirect("/login");
  const userThreads = (await db
    .select()
    .from(threads)
    .where(eq(threads.userId, userId))) as Thread[];

  return (
    <div className="flex p-4 gap-4 flex-col w-full items-center">
      {userThreads.map((thread) => {
        return (
          <Card
            className="max-w-md w-full h-24 flex items-center"
            key={thread.id}
          >
            <CardContent className="w-full flex justify-between items-center p-8">
              <span className="text-ellipsis text-nowrap overflow-hidden h-full">
                {thread.title}
              </span>
              <DeleteButton id={thread.id} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
