
"use client";

import React, { useState, useEffect } from 'react';

interface WaterfallItem {
  id: number;
  left: string;
  animation: string;
}

export function SplashScreen() {
  const [waterfallItems, setWaterfallItems] = useState<WaterfallItem[]>([]);

  useEffect(() => {
    // Generate waterfall items only on the client-side to prevent hydration mismatch
    const items = [...Array(50)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animation: `waterfall-fall ${2 + Math.random() * 2}s linear ${Math.random() * 5}s infinite`,
    }));
    setWaterfallItems(items);
  }, []); // Empty dependency array ensures this runs only once on the client after mount

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-b from-emerald-100 via-cyan-100 to-blue-100 dark:from-gray-900 dark:via-emerald-900 dark:to-cyan-900 overflow-hidden relative">
      <div className="absolute inset-0 z-0">
        {waterfallItems.map((item) => (
          <div
            key={item.id}
            className="absolute top-[-50%] h-1/2 w-0.5 bg-white/30 dark:bg-white/10"
            style={{
              left: item.left,
              animation: item.animation,
            }}
          />
        ))}
      </div>
       <div className="z-10 text-center animate-fade-in-up">
        <h1 className="text-6xl md:text-8xl font-headline text-emerald-600 dark:text-emerald-300 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.2)'}}>
          NurulQuran
        </h1>
        <p className="mt-4 text-lg text-emerald-800 dark:text-emerald-200">Connect & Grow</p>
      </div>
    </div>
  );
}
