
"use client";

import React, { useState, useEffect } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import { useSearchParams } from 'next/navigation'
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatWindow } from "@/components/chat/chat-window";
import { EventUpdates } from "@/components/chat/event-updates";
import { SupportChatbot } from "@/components/chat/support-chatbot";
import type { Chat, User } from "@/lib/types";
import { AdminPanel } from "@/components/admin/admin-panel";

interface ChatLayoutProps {
  chats: Chat[];
  loggedInUser: User;
}

export default function ChatLayout({ chats, loggedInUser }: ChatLayoutProps) {
  const searchParams = useSearchParams()
  const viewParam = searchParams.get('view');
  const messageParam = searchParams.get('message');
  
  const [selectedChat, setSelectedChat] = useState<Chat | null>(chats[0] ?? null);
  const [activeView, setActiveView] = useState<"chat" | "events" | "support" | "admin">("chat");
  const [initialSupportMessage, setInitialSupportMessage] = useState<string | null>(null);

  useEffect(() => {
    // This effect handles deep-linking, e.g., from an external link or notification.
    const view = viewParam as "chat" | "events" | "support" | "admin" | null;
    if (view && view !== activeView) {
        if (view === 'support') {
            setActiveView('support');
            setSelectedChat(null);
            if (messageParam === 'storage') {
                setInitialSupportMessage('I would like to request more storage.');
            }
        } else if (view === 'admin' && loggedInUser.role === 'admin') {
            setActiveView('admin');
            setSelectedChat(null);
        } else if (view === 'events') {
            setActiveView('events');
            setSelectedChat(null);
        } else {
            setActiveView('chat');
        }
    }
  }, [viewParam, messageParam, loggedInUser.role, activeView]);

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setActiveView("chat");
  };

  const handleSelectView = (view: "events" | "support" | "admin") => {
    setActiveView(view);
    setSelectedChat(null);
    // Clear initial message when manually switching
    setInitialSupportMessage(null);
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <ChatSidebar 
            chats={chats} 
            onSelectChat={handleSelectChat} 
            onSelectView={handleSelectView} 
            activeChatId={activeView === 'chat' ? selectedChat?.id : undefined} 
            activeView={activeView}
        />
      </Sidebar>
      <SidebarInset>
        {activeView === 'chat' && selectedChat ? (
          <ChatWindow chat={selectedChat} loggedInUser={loggedInUser} />
        ) : activeView === 'events' ? (
          <EventUpdates />
        ) : activeView === 'support' ? (
          <SupportChatbot initialMessage={initialSupportMessage} />
        ) : activeView === 'admin' && loggedInUser.role === 'admin' ? (
          <AdminPanel />
        ) : (
          <div className="flex h-full items-center justify-center bg-background">
            <div className="text-center">
              <h2 className="text-2xl font-semibold font-headline">Welcome to NQSalam</h2>
              <p className="text-muted-foreground">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
