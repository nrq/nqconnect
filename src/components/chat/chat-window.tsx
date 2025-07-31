
"use client";

import { useState } from "react";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";
import { sendMessage } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import type { Chat, User } from "@/lib/types";

interface ChatWindowProps {
  chat: Chat;
  loggedInUser: User;
}

export function ChatWindow({ chat: initialChat, loggedInUser }: ChatWindowProps) {
  const [chat, setChat] = useState<Chat>(initialChat);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (message: { text: string; imageDataUri?: string | null }) => {
    setIsLoading(true);

    const result = await sendMessage({
      chatId: chat.id,
      senderId: loggedInUser.id,
      text: message.text,
      imageDataUri: message.imageDataUri || undefined,
    });
    
    if(result.error) {
      toast({
        variant: "destructive",
        title: "Error Sending Message",
        description: result.error,
      });
    } else if (result.updatedChat) {
      // Because we're simulating the backend, we update the state directly.
      // In a real app with Firestore, this would be handled by a real-time listener.
      setChat(prev => ({...prev, messages: result.updatedChat!.messages }));
    }

    setIsLoading(false);
  };

  // Update chat state if initialChat prop changes
  if (initialChat.id !== chat.id) {
    setChat(initialChat);
  }

  return (
    <div className="flex h-full flex-col">
      <ChatHeader chat={chat} />
      <ChatMessages
        messages={chat.messages}
        loggedInUser={loggedInUser}
        chatParticipants={chat.participants}
      />
      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
}
