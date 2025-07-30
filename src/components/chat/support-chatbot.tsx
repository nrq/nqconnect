"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Bot, SendHorizonal, Loader2 } from "lucide-react";

interface SupportMessage {
    id: string;
    sender: 'bot' | 'user';
    text: string;
    timestamp: Date;
}

interface SupportChatbotProps {
    initialMessage?: string | null;
}

export function SupportChatbot({ initialMessage }: SupportChatbotProps) {
    const [messages, setMessages] = useState<SupportMessage[]>([
        {
            id: '1',
            sender: 'bot',
            text: 'As-salamu alaykum! Welcome to NQSalam support. How can I help you today?',
            timestamp: new Date(),
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() && !initialMessage) return;

        const userMessageText = input.trim() || initialMessage;
        if (!userMessageText) return;

        const userMessage: SupportMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: userMessageText,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        // Simulate bot response
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const botResponse: SupportMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: `Thank you for your message: "${userMessageText}". A support agent will review your request and get back to you soon, insha'Allah.`,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, botResponse]);
        setIsLoading(false);
    };

    useEffect(() => {
        if (initialMessage) {
            setInput(initialMessage);
        }
    }, [initialMessage]);

     useEffect(() => {
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if(viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }
    }, [messages]);


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
            <ScrollArea className="flex-1" ref={scrollAreaRef}>
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
                    {isLoading && (
                         <div className={cn("flex items-end gap-3", "justify-start")}>
                            <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
                                <div className="flex h-full w-full items-center justify-center">
                                    <Bot className="h-5 w-5"/>
                                </div>
                            </Avatar>
                            <div className={cn("max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-3", "bg-secondary text-secondary-foreground rounded-bl-none")}>
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin"/>
                                    <p className="text-base italic">Bot is typing...</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
             <div className="border-t p-4 bg-background">
                <form
                    className="relative"
                    onSubmit={handleSendMessage}
                >
                    <Textarea
                    placeholder="Type your message to support..."
                    className="pr-20 min-h-[52px] resize-none"
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            (e.target as HTMLTextAreaElement).form?.requestSubmit();
                        }
                    }}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Button type="submit" size="icon" className="bg-accent hover:bg-accent/90" disabled={isLoading || !input.trim()}>
                        <SendHorizonal className="h-5 w-5 text-accent-foreground" />
                        <span className="sr-only">Send message</span>
                    </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
