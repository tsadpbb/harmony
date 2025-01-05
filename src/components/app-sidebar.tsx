import { Home, Library } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./ui/sidebar";
import Link from "next/link";
import AppSidebarFooter from "./app-sidebar-footer";
import { db } from "@/db";
import { threads } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Message } from "ai";
import { auth } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export default async function AppSidebar() {
  const session = (await auth()) ?? redirect("/login");
  const userId = session.user?.id ?? redirect("/login");

  const userThreads = (await db
    .select()
    .from(threads)
    .where(eq(threads.userId, userId))) as {
    id: string;
    userId: string;
    title: string;
    messages: Message[];
  }[];

  return (
    <Sidebar>
      <SidebarHeader>Harmony</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <Home />
                    Home
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/library">
                    <Library />
                    Library
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {userThreads.map((thread) => {
                    return (
                      <SidebarMenuSubItem key={thread.id}>
                        <SidebarMenuSubButton asChild>
                          <Link href={`/search/${thread.id}`}>
                            <span>{thread.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <AppSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
