import type { Chat, User } from "@/lib/types";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";

interface ChatWindowProps {
  chat: Chat;
  loggedInUser: User;
}

export function ChatWindow({ chat, loggedInUser }: ChatWindowProps) {
  return (
    <div className="flex h-full flex-col">
      <ChatHeader chat={chat} />
      <ChatMessages
        messages={chat.messages}
        loggedInUser={loggedInUser}
        chatParticipants={chat.participants}
      />
      <ChatInput />
    </div>
  );
}
