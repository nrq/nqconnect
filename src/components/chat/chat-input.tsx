
"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Paperclip, Mic, SendHorizonal, Image as ImageIcon, FileText, Video } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

export function ChatInput() {
  const { toast } = useToast();

  const handleFeatureNotImplemented = () => {
    toast({
      title: "Feature Coming Soon",
      description: "We're working on bringing this feature to you.",
    });
  };

  return (
    <div className="border-t p-4 bg-background">
      <form
        className="relative"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          form.reset();
        }}
      >
        <Textarea
          placeholder="Type a message..."
          className="pr-32 min-h-[52px] resize-none"
          rows={1}
          onKeyDown={(e) => {
              if(e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  (e.target as HTMLTextAreaElement).form?.requestSubmit();
              }
          }}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="ghost" size="icon">
                <Paperclip className="h-5 w-5" />
                <span className="sr-only">Attach file</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handleFeatureNotImplemented}><ImageIcon/></Button>
                    <Button variant="outline" size="icon" onClick={handleFeatureNotImplemented}><Video/></Button>
                    <Button variant="outline" size="icon" onClick={handleFeatureNotImplemented}><FileText/></Button>
                </div>
            </PopoverContent>
          </Popover>
          <Button type="button" variant="ghost" size="icon" onClick={handleFeatureNotImplemented}>
            <Mic className="h-5 w-5" />
            <span className="sr-only">Voice message</span>
          </Button>
          <Button type="submit" size="icon" className="bg-accent hover:bg-accent/90">
            <SendHorizonal className="h-5 w-5 text-accent-foreground" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
