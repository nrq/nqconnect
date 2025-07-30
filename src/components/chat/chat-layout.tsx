"use client";

import React, { useState } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatWindow } from "@/components/chat/chat-window";
import { EventUpdates } from "@/components/chat/event-updates";
import { SupportChatbot } from "@/components/chat/support-chatbot";
import type { Chat, User } from "@/lib/types";

interface ChatLayoutProps {
  chats: Chat[];
  loggedInUser: User;
}

export default function ChatLayout({ chats, loggedInUser }: ChatLayoutProps) {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(chats[0]);
  const [activeView, setActiveView] = useState<"chat" | "events" | "support">("chat");

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setActiveView("chat");
  };

  const handleSelectView = (view: "events" | "support") => {
    setActiveView(view);
    setSelectedChat(null);
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <ChatSidebar chats={chats} onSelectChat={handleSelectChat} onSelectView={handleSelectView} activeChatId={selectedChat?.id} />
      </Sidebar>
      <SidebarInset>
        {activeView === 'chat' && selectedChat ? (
          <ChatWindow chat={selectedChat} loggedInUser={loggedInUser} />
        ) : activeView === 'events' ? (
          <EventUpdates />
        ) : activeView === 'support' ? (
          <SupportChatbot />
        ) : (
          <div className="flex h-full items-center justify-center bg-background">
            <div className="text-center">
              <h2 className="text-2xl font-semibold font-headline">Welcome to SalamConnect</h2>
              <p className="text-muted-foreground">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
