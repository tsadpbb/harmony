import { LogOut, User } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { auth, signOut } from "@/app/actions/auth";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { redirect } from "next/navigation";

export default async function AppSidebarFooter() {
  const session = (await auth()) ?? redirect("/login");
  const email = session.user?.email ?? "User";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton>
          <User />
          <span>{email}</span>
        </SidebarMenuButton>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuAction
              onClick={async () => {
                "use server";
                await signOut();
              }}
            >
              <LogOut />
            </SidebarMenuAction>
          </TooltipTrigger>
          <TooltipContent>Log out</TooltipContent>
        </Tooltip>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
