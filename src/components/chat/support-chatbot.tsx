"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatInput } from "./chat-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Bot } from "lucide-react";

interface SupportMessage {
    id: string;
    sender: 'bot' | 'user';
    text: string;
    timestamp: Date;
}

export function SupportChatbot() {
    const [messages, setMessages] = useState<SupportMessage[]>([
        {
            id: '1',
            sender: 'bot',
            text: 'As-salamu alaykum! Welcome to SalamConnect support. How can I help you today?',
            timestamp: new Date(),
        }
    ]);

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-primary">
                    <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
                        <Bot className="h-6 w-6"/>
                    </div>
                </Avatar>
                <div>
                    <h2 className="text-xl font-headline font-semibold">Support Bot</h2>
                    <p className="text-sm text-green-400 flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Online
                    </p>
                </div>
            </div>
            <ScrollArea className="flex-1">
                <div className="p-6 space-y-6">
                    {messages.map((message) => (
                        <div key={message.id} className={cn("flex items-end gap-3", message.sender === 'user' ? "justify-end" : "justify-start")}>
                            {message.sender === 'bot' && (
                                <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
                                    <div className="flex h-full w-full items-center justify-center">
                                      <Bot className="h-5 w-5"/>
                                    </div>
                                </Avatar>
                            )}
                             <div className={cn("max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-3", message.sender === 'user' ? "bg-primary text-primary-foreground rounded-br-none" : "bg-secondary text-secondary-foreground rounded-bl-none")}>
                                <p className="text-base">{message.text}</p>
                                <p className={cn("text-xs mt-2", message.sender === 'user' ? "text-primary-foreground/70" : "text-muted-foreground")}>
                                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
            <ChatInput />
        </div>
    )
}
