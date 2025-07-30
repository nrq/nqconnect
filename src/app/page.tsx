
"use client";

import { useAuth } from "@/context/auth-context";
import ChatLayout from "@/components/chat/chat-layout";
import { chats } from "@/lib/data";
import AuthPage from "@/app/auth/page";
import { Suspense } from "react";
import { SplashScreen } from "@/components/splash-screen";

function ChatPageContent() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <SplashScreen />;
  }
  
  return (
    <main className="h-screen w-full">
      {user ? (
        <ChatLayout
          chats={chats}
          loggedInUser={user}
        />
      ) : (
        <AuthPage />
      )}
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<SplashScreen />}>
      <ChatPageContent />
    </Suspense>
  )
}
