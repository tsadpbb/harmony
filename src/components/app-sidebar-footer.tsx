import { ChevronsUpDown, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { signOut } from "@/app/actions/auth";

export default function AppSidebarFooter() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              <User />
              User
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <span>Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <button type="submit">Log out</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
