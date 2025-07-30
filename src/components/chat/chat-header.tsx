"use client";

import {
  Phone,
  Video,
  MoreVertical,
  ShieldAlert,
  UserX,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import type { Chat } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface ChatHeaderProps {
  chat: Chat;
}

export function ChatHeader({ chat }: ChatHeaderProps) {
  const { toast } = useToast();

  const handleAction = (action: "Block" | "Report") => {
    toast({
      title: `${action} Successful`,
      description: `User ${chat.name} has been ${action.toLowerCase()}ed. Our team will review the report.`,
      variant: 'default'
    });
  }

  return (
    <div className="flex items-center justify-between border-b p-4 bg-background">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12 border-2 border-primary">
          <AvatarImage src={chat.avatar} alt={chat.name} />
          <AvatarFallback className="bg-muted-foreground text-background">{chat.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-headline font-semibold">{chat.name}</h2>
          <p className="text-sm text-muted-foreground">
            {chat.type === 'private' ? 'Online' : `${chat.participants.length} members`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="hover:bg-accent/20">
          <Phone className="h-5 w-5 text-primary" />
          <span className="sr-only">Audio Call</span>
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-accent/20">
          <Video className="h-5 w-5 text-primary" />
          <span className="sr-only">Video Call</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-accent/20">
              <MoreVertical className="h-5 w-5" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                        <UserX className="mr-2 h-4 w-4" />
                        Block
                    </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Block {chat.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            They will not be able to send you messages or find your profile. This action can be undone in Settings.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleAction('Block')} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Block</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                      <ShieldAlert className="mr-2 h-4 w-4" />
                      Report
                    </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Report {chat.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            The last 5 messages from this user will be forwarded to the SalamConnect moderation team. Do you want to proceed?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleAction('Report')} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Report</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
