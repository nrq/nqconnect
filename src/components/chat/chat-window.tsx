
"use client";

import { useState } from 'react';
import type { Chat, User, Message } from "@/lib/types";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { sendMessage } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

interface ChatWindowProps {
  chat: Chat;
  loggedInUser: User;
}

export function ChatWindow({ chat: initialChat, loggedInUser }: ChatWindowProps) {
  const [chat, setChat] = useState<Chat>(initialChat);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (message: { text: string; file?: File | null }) => {
    setIsLoading(true);

    const result = await sendMessage({
      chatId: chat.id,
      senderId: loggedInUser.id,
      text: message.text,
      // In a real app, the file would be uploaded and a URL returned.
      // For this prototype, we'll simulate this with a placeholder.
      imageUrl: message.file ? URL.createObjectURL(message.file) : undefined,
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
