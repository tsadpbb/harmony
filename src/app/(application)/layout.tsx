import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="relative w-full">
        <SidebarTrigger className="absolute top-2 left-2" />
        {children}
      </main>
    </SidebarProvider>
  );
}
