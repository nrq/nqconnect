import ChatLayout from "@/components/chat/chat-layout";
import { chats, loggedInUser } from "@/lib/data";

export default function Home() {
  return (
    <main className="h-screen w-full">
      <ChatLayout
        chats={chats}
        loggedInUser={loggedInUser}
      />
    </main>
  );
}
