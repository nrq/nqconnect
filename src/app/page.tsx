"use client";

import { useAuth } from "@/context/auth-context";
import ChatLayout from "@/components/chat/chat-layout";
import { chats } from "@/lib/data";
import AuthPage from "@/app/auth/page";
import { Suspense, useState, useEffect } from "react";
import { SplashScreen } from "@/components/splash-screen";

function ChatPageContent() {
  const { user, loading } = useAuth();
  const [isSplashing, setIsSplashing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashing(false);
    }, 3000); // Splash screen duration: 3 seconds
    return () => clearTimeout(timer);
  }, []);

  if (isSplashing) {
    return <SplashScreen />;
  }

  if (loading) {
    return (
      <main className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-xl font-semibold">Loading...</div>
      </main>
    )
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
    <Suspense fallback={<div>Loading...</div>}>
      <ChatPageContent />
    </Suspense>
  )
}
