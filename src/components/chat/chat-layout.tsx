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

interface ChatLayoutProps {
  chats: Chat[];
  loggedInUser: User;
}

export default function ChatLayout({ chats, loggedInUser }: ChatLayoutProps) {
  const searchParams = useSearchParams()
  const viewParam = searchParams.get('view');
  const messageParam = searchParams.get('message');
  
  const [selectedChat, setSelectedChat] = useState<Chat | null>(chats[0]);
  const [activeView, setActiveView] = useState<"chat" | "events" | "support">("chat");
  const [initialSupportMessage, setInitialSupportMessage] = useState<string | null>(null);

  useEffect(() => {
    if (viewParam === 'support') {
      setActiveView('support');
      setSelectedChat(null);
      if (messageParam === 'storage') {
        setInitialSupportMessage('I would like to request more storage.');
      }
    } else {
        // Default view
        setActiveView('chat');
        setSelectedChat(chats[0]);
    }
  }, [viewParam, messageParam, chats]);


  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setActiveView("chat");
  };

  const handleSelectView = (view: "events" | "support") => {
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
            activeChatId={selectedChat?.id} 
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
        ) : (
          <div className="flex h-full items-center justify-center bg-background">
            <div className="text-center">
              <h2 className="text-2xl font-semibold font-headline">Welcome to NurulQuranConnect</h2>
              <p className="text-muted-foreground">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
