"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import { deleteAccount } from "@/app/actions";
import { useAuth } from "@/context/auth-context";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from 'next/link';
import packageJson from '../../../package.json';

export function SettingsLayout() {
    const { toast } = useToast();
    const { logout } = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);

    const appVersion = packageJson.version;

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        const result = await deleteAccount();
        if (result.success) {
            toast({
                title: "Account Deleted",
                description: "Your account has been permanently deleted.",
            });
            logout();
        } else {
             toast({
                title: "Error",
                description: "Could not delete your account. Please try again.",
                variant: "destructive"
            });
        }
        setIsDeleting(false);
    }

    return (
        <div className="flex flex-col h-full bg-background">
             <div className="p-4 border-b flex items-center gap-4">
                <Button asChild variant="ghost" size="icon">
                    <Link href="/">
                        <ArrowLeft />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-headline font-bold">Settings</h1>
                    <p className="text-muted-foreground">Manage your account and app settings</p>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                        <CardDescription>View and manage your account details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="font-medium">App Version</p>
                            <p className="text-muted-foreground">{appVersion}</p>
                        </div>
                    </CardContent>
                </Card>

                 <Card className="mt-6 border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive">Danger Zone</CardTitle>
                        <CardDescription>These actions are irreversible. Please proceed with caution.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">Delete Account</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90" disabled={isDeleting}>
                                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Yes, delete my account
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
