
"use client";

import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Paperclip, Mic, SendHorizonal, Image as ImageIcon, FileText, Video, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

interface ChatInputProps {
  onSendMessage: (message: { text: string; file?: File | null }) => Promise<void>;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFeatureNotImplemented = () => {
    toast({
      title: "Feature Coming Soon",
      description: "We're working on bringing this feature to you.",
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
        setFile(selectedFile);
        if (selectedFile.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  }

  const handleRemoveAttachment = () => {
      setFile(null);
      setPreview(null);
      if(fileInputRef.current) {
          fileInputRef.current.value = "";
      }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !file) return;

    await onSendMessage({ text: text.trim(), file });
    
    setText("");
    handleRemoveAttachment();
  };

  return (
    <div className="border-t p-4 bg-background">
      <form
        className="relative"
        onSubmit={handleSubmit}
      >
        {preview && (
            <div className="relative mb-2 w-24 h-24 rounded-md overflow-hidden border">
                <Image src={preview} alt="Image preview" layout="fill" objectFit="cover" />
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-0 right-0 h-6 w-6 bg-black/50 hover:bg-black/70 text-white"
                    onClick={handleRemoveAttachment}
                >
                    <X className="h-4 w-4"/>
                </Button>
            </div>
        )}
        <Textarea
          placeholder="Type a message..."
          className="pr-32 min-h-[52px] resize-none"
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
              if(e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  (e.target as HTMLTextAreaElement).form?.requestSubmit();
              }
          }}
          disabled={disabled}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="ghost" size="icon" disabled={disabled}>
                <Paperclip className="h-5 w-5" />
                <span className="sr-only">Attach file</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handleImageClick}><ImageIcon/></Button>
                    <Button variant="outline" size="icon" onClick={handleFeatureNotImplemented}><Video/></Button>
                    <Button variant="outline" size="icon" onClick={handleFeatureNotImplemented}><FileText/></Button>
                </div>
            </PopoverContent>
          </Popover>
          <Button type="button" variant="ghost" size="icon" onClick={handleFeatureNotImplemented} disabled={disabled}>
            <Mic className="h-5 w-5" />
            <span className="sr-only">Voice message</span>
          </Button>
          <Button type="submit" size="icon" className="bg-accent hover:bg-accent/90" disabled={disabled || (!text.trim() && !file)}>
            <SendHorizonal className="h-5 w-5 text-accent-foreground" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
