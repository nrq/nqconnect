import { SettingsLayout } from "@/components/settings/settings-layout";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { chats } from "@/lib/data";

export default function SettingsPage() {

  return (
    <main className="h-screen w-full">
        <SettingsLayout />
    </main>
  );
}
