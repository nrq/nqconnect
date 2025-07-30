"use client";

import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Users,
  Bell,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
  Settings,
} from "lucide-react";
import type { Chat } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";

interface ChatSidebarProps {
  chats: Chat[];
  onSelectChat: (chat: Chat) => void;
  onSelectView: (view: "events" | "support") => void;
  activeChatId?: string;
  activeView?: "chat" | "events" | "support";
}

export function ChatSidebar({ chats, onSelectChat, onSelectView, activeChatId, activeView }: ChatSidebarProps) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const privateChats = chats.filter((chat) => chat.type === 'private');
  const groupChats = chats.filter((chat) => chat.type === 'group');

  if (!user) return null;

  return (
    <div className="flex h-full flex-col">
      <SidebarHeader>
        <div className="flex items-center gap-3 p-2">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-headline text-lg font-semibold">{user.name}</span>
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
              <MessageSquare /> Private Chats
            </SidebarGroupLabel>
            {privateChats.map((chat) => (
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton
                  onClick={() => onSelectChat(chat)}
                  isActive={activeView === 'chat' && activeChatId === chat.id}
                  className="w-full justify-start"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={chat.avatar} alt={chat.name} />
                    <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="truncate flex-1">{chat.name}</span>
                  {chat.unreadCount > 0 && (
                     <Badge className="bg-primary text-primary-foreground">{chat.unreadCount}</Badge>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
              <Users /> Group Chats
            </SidebarGroupLabel>
            {groupChats.map((chat) => (
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton
                  onClick={() => onSelectChat(chat)}
                  isActive={activeView === 'chat' && activeChatId === chat.id}
                  className="w-full justify-start"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={chat.avatar} alt={chat.name} />
                    <AvatarFallback>{chat.name.substring(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="truncate flex-1">{chat.name}</span>
                  {chat.unreadCount > 0 && (
                     <Badge className="bg-primary text-primary-foreground">{chat.unreadCount}</Badge>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroup>
          
          <SidebarSeparator />

          <SidebarGroup>
             <SidebarMenuItem>
                <SidebarMenuButton onClick={() => onSelectView('events')} isActive={activeView === 'events'} className="w-full justify-start">
                  <Bell />
                  Events
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={() => onSelectView('support')} isActive={activeView === 'support'} className="w-full justify-start">
                  <HelpCircle />
                  Support
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/settings">
                <SidebarMenuButton className="w-full justify-start">
                  <Settings />
                  Settings
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarGroup>

        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between p-4">
            <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut />
            </Button>
            <div className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                />
                <Moon className="h-5 w-5" />
            </div>
        </div>
      </SidebarFooter>
    </div>
  );
}
