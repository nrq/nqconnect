"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Message, User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Languages, Loader2 } from "lucide-react";
import { getTranslation } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ChatMessageProps {
  message: Message;
  sender?: User;
  isOwnMessage: boolean;
}

export function ChatMessage({ message, sender, isOwnMessage }: ChatMessageProps) {
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("English");
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (!message.text || !message.language) return;
    setIsTranslating(true);
    setTranslatedText("");

    const result = await getTranslation(message.text, message.language, targetLanguage);
    
    if (result.error) {
        toast({
            variant: "destructive",
            title: "Translation Error",
            description: result.error,
        });
    } else {
        setTranslatedText(result.translatedText || "");
    }
    setIsTranslating(false);
  };

  const isTranslatable = message.text && message.language && message.language !== "English" && !isOwnMessage;
  const availableLanguages = ["English", "Urdu", "Arabic", "Norwegian", "French", "German"];

  return (
    <div
      className={cn(
        "flex items-end gap-3",
        isOwnMessage ? "justify-end" : "justify-start"
      )}
    >
      {!isOwnMessage && (
        <Avatar className="h-10 w-10">
          <AvatarImage src={sender?.avatar} alt={sender?.name} />
          <AvatarFallback>{sender?.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-3",
          isOwnMessage
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-secondary text-secondary-foreground rounded-bl-none"
        )}
      >
        {!isOwnMessage && sender && (
          <p className="text-sm font-semibold mb-1 text-primary">{sender.name}</p>
        )}
        {message.imageUrl && (
            <div className="relative w-full aspect-video rounded-md overflow-hidden mb-2">
                <Image src={message.imageUrl} alt="Sent image" layout="fill" objectFit="cover" data-ai-hint="chat image" />
            </div>
        )}
        {message.text && <p className="text-base">{message.text}</p>}
        {translatedText && (
            <div className="border-t border-primary/20 mt-2 pt-2">
                <p className="text-sm italic opacity-80">{translatedText}</p>
            </div>
        )}
        {isTranslatable && (
            <div className="mt-2 flex items-center gap-2">
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                    <SelectTrigger className="w-[120px] h-8 text-xs bg-secondary/50 border-secondary">
                        <SelectValue placeholder="Translate to" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableLanguages.map(lang => (
                            <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button size="sm" variant="ghost" onClick={handleTranslate} disabled={isTranslating} className="h-8 px-2">
                    {isTranslating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Languages className="h-4 w-4" />
                    )}
                    <span className="ml-2">Translate</span>
                </Button>
            </div>
        )}
        <p className={cn("text-xs mt-2", isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground")}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
