
"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";
import { User } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";


const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const phoneSchema = z.object({
    phoneNumber: z.string().regex(phoneRegex, "Invalid phone number"),
});

const otpSchema = z.object({
    otp: z.string().min(6, "OTP must be 6 digits"),
});

const detailsSchema = z.object({
    quranClass: z.string().min(1, "Please select a class"),
    studentId: z.string().optional(),
    language: z.string().min(1, "Please select a language"),
})

declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier;
        confirmationResult?: ConfirmationResult;
    }
}

export function AuthForm() {
    const [step, setStep] = useState<"phone" | "otp" | "details">("phone");
    const [isLoading, setIsLoading] = useState(false);
    const { login, user, firebaseUser, reloadUser } = useAuth();
    const { toast } = useToast();
    
    const phoneForm = useForm<z.infer<typeof phoneSchema>>({
        resolver: zodResolver(phoneSchema),
        defaultValues: {
            phoneNumber: "",
        },
    });

    const otpForm = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: "",
        },
    });

    const detailsForm = useForm<z.infer<typeof detailsSchema>>({
        resolver: zodResolver(detailsSchema),
        defaultValues: {
            quranClass: "",
            studentId: "",
            language: "English",
        },
    });

    useEffect(() => {
        // If we have a firebaseUser but not a local profile, it means they are new
        if (firebaseUser && !user) {
            setStep("details");
        }
    }, [firebaseUser, user]);

    const generateRecaptcha = () => {
        // Only create a new verifier if one doesn't exist
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': (response: any) => {
                    console.log("reCAPTCHA solved");
                }
            });
        }
    }

    async function onPhoneSubmit(values: z.infer<typeof phoneSchema>) {
        setIsLoading(true);
        generateRecaptcha();
        
        try {
            const verifier = window.recaptchaVerifier!;
            const confirmationResult = await signInWithPhoneNumber(auth, values.phoneNumber, verifier);
            window.confirmationResult = confirmationResult;
            toast({
                title: "Code Sent",
                description: "A verification code has been sent to your phone.",
            });
            setStep("otp");
        } catch (error: any) {
            console.error("SMS Error:", error);
            toast({
                variant: "destructive",
                title: "Error Sending Code",
                description: error.message || "Could not send verification code. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    async function onOtpSubmit(values: z.infer<typeof otpSchema>) {
        setIsLoading(true);
        try {
            const confirmationResult = window.confirmationResult;
            if (!confirmationResult) {
                throw new Error("No confirmation result found. Please try sending the code again.");
            }
            const result = await confirmationResult.confirm(values.otp);
            
            // The onAuthStateChanged listener in AuthProvider will handle the rest.
            // It will check if the user has a profile and either log them in or show the details form.
             toast({
                title: "Verification Successful!",
                description: "You have been signed in.",
            });

            // We need to give onAuthStateChanged a moment to get the new user and check for a profile
            await reloadUser();
            
        } catch (error: any) {
            console.error("OTP Error:", error);
             toast({
                variant: "destructive",
                title: "Verification Failed",
                description: "The code you entered is incorrect. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    async function onDetailsSubmit(values: z.infer<typeof detailsSchema>) {
        setIsLoading(true);
        try {
            if (!firebaseUser) {
                throw new Error("You are not signed in. Please restart the login process.");
            }
            const finalUser: User = {
                id: firebaseUser.uid,
                name: firebaseUser.phoneNumber || "New User", // Use phone number as default name
                avatar: `https://placehold.co/100x100/3CB371/FFFFFF?text=${(firebaseUser.phoneNumber || "U").slice(-2)}`,
                isOnline: true,
                role: 'user', // All new users are 'user' role
                status: 'active',
                storage: { used: 0, total: 100 }, // Default storage
                ...values,
                language: values.language as any,
            };
            console.log("Saving user details:", finalUser);
            // This `login` function now saves the profile to localStorage
            login(finalUser);
             toast({
                title: "Registration Complete!",
                description: "Welcome to NQSalam.",
            });
        } catch (error: any) {
             toast({
                variant: "destructive",
                title: "Registration Failed",
                description: error.message || "Could not save your details.",
            });
        }
        setIsLoading(false);
    }

    const renderStep = () => {
        switch (step) {
            case "phone":
                return (
                    <Form {...phoneForm}>
                        <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-6">
                            <FormField
                                control={phoneForm.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+15551234567" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Send Code
                            </Button>
                        </form>
                    </Form>
                )
            case "otp":
                 return (
                    <Form {...otpForm}>
                        <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
                             <FormField
                                control={otpForm.control}
                                name="otp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Verification Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="123456" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Verify & Sign In
                            </Button>
                            <Button variant="link" size="sm" className="w-full" onClick={() => setStep("phone")}>
                                Use a different phone number
                            </Button>
                        </form>
                    </Form>
                )
            case "details":
                 return (
                    <Form {...detailsForm}>
                        <form onSubmit={detailsForm.handleSubmit(onDetailsSubmit)} className="space-y-6">
                            <FormField
                                control={detailsForm.control}
                                name="quranClass"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quran Class</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select your class" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="hifz-al-quran">Hifz al-Quran (Memorization)</SelectItem>
                                                <SelectItem value="tajweed-basics">Tajweed Basics</SelectItem>
                                                <SelectItem value="advanced-tafsir">Advanced Tafsir</SelectItem>
                                                <SelectItem value="quranic-arabic">Quranic Arabic</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={detailsForm.control}
                                name="studentId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Student ID (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. NQC-12345" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={detailsForm.control}
                                name="language"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Preferred Language</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select your language" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="English">English</SelectItem>
                                                <SelectItem value="Urdu">Urdu</SelectItem>
                                                <SelectItem value="Norwegian">Norsk (Norwegian)</SelectItem>
                                                <SelectItem value="French">Français (French)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Complete Registration
                            </Button>
                        </form>
                    </Form>
                )
        }
    }
    
    const getTitle = () => {
        switch(step) {
            case "phone": return "Welcome to NQSalam";
            case "otp": return "Enter Verification Code";
            case "details": return "Complete Your Profile";
        }
    }

    const getDescription = () => {
        switch(step) {
            case "phone": return "Enter your phone number to sign in or create an account.";
            case "otp": return `We've sent a 6-digit code to ${phoneForm.getValues("phoneNumber")}.`;
            case "details": return "Please provide a few more details to finish setting up your account.";
        }
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">
                    {getTitle()}
                </CardTitle>
                <CardDescription>
                    {getDescription()}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {renderStep()}
                <div id="recaptcha-container" className="mt-4"></div>
            </CardContent>
        </Card>
    );
}

    