import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chat/chat-message";
import type { Message, User } from "@/lib/types";
import { useRef, useEffect } from "react";

interface ChatMessagesProps {
  messages: Message[];
  loggedInUser: User;
  chatParticipants: User[];
}

export function ChatMessages({ messages, loggedInUser, chatParticipants }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if(viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
      <div className="p-6 space-y-6">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isOwnMessage={message.senderId === loggedInUser.id}
            sender={chatParticipants.find(p => p.id === message.senderId)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
