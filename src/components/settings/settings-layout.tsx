
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
import { useAppearance } from '@/context/appearance-context';
import { ArrowLeft, Loader2, MessageSquare, FileText, Shield, User, GraduationCap } from "lucide-react";
import Link from 'next/link';
import packageJson from '../../../package.json';

export function SettingsLayout() {
    const { toast } = useToast();
    const { user, logout } = useAuth();
    const { fontSize, setFontSize } = useAppearance();
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

    const storageUsagePercentage = user && user.storage ? (user.storage.used / user.storage.total) * 100 : 0;

    const classNames: { [key: string]: string } = {
        "hifz-al-quran": "Hifz al-Quran",
        "tajweed-basics": "Tajweed Basics",
        "advanced-tafsir": "Advanced Tafsir",
        "quranic-arabic": "Quranic Arabic",
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
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                        <CardDescription>Your account information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {user && (
                             <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground"/>
                                    <p className="font-medium">{user.studentId || "No Student ID"}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4 text-muted-foreground"/>
                                    <p className="font-medium">{classNames[user.quranClass || ''] || "No Class Assigned"}</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>Customize the look and feel of the app.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div>
                            <p className="font-medium mb-2">Font Size</p>
                            <RadioGroup defaultValue={fontSize} onValueChange={(value) => setFontSize(value as any)}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="sm" id="font-sm" />
                                    <Label htmlFor="font-sm">Small</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="base" id="font-base" />
                                    <Label htmlFor="font-base">Default</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="lg" id="font-lg" />
                                    <Label htmlFor="font-lg">Large</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Storage</CardTitle>
                        <CardDescription>Manage your cloud storage usage.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {user && user.storage && (
                            <div className="space-y-2">
                                <Progress value={storageUsagePercentage} className="w-full" />
                                <p className="text-sm text-muted-foreground">
                                    {user.storage.used}MB of {user.storage.total}MB used
                                </p>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                         <Link href="/?view=support&message=storage" className='w-full'>
                            <Button className="w-full">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Request More Storage
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>About</CardTitle>
                        <CardDescription>View app information and legal documents.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="font-medium">App Version</p>
                            <p className="text-muted-foreground">{appVersion}</p>
                        </div>
                         <div className="flex flex-col space-y-2">
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href="/terms">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Terms & Conditions
                                </Link>
                            </Button>
                             <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href="/privacy">
                                    <Shield className="mr-2 h-4 w-4" />
                                    Privacy Policy
                                </Link>
                            </Button>
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
