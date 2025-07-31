
"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { allUsers } from "@/lib/data";
import { auth, RecaptchaVerifier } from '@/lib/firebase';
import { ConfirmationResult, signInWithPhoneNumber } from "firebase/auth";

const emailLoginSchema = z.object({
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(1, "Password is required."),
});

const phoneLoginSchema = z.object({
    phone: z.string().min(10, "Please enter a valid phone number including country code."),
});

const otpSchema = z.object({
    otp: z.string().min(6, "OTP must be 6 digits."),
});

export function AuthForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [authStep, setAuthStep] = useState<"phone" | "otp">("phone");
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const { login } = useAuth();
    const { toast } = useToast();
    
    // Initialize reCAPTCHA verifier
    useEffect(() => {
        if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
              'size': 'invisible',
              'callback': () => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
              }
            });
        }
    }, []);

    const emailForm = useForm<z.infer<typeof emailLoginSchema>>({
        resolver: zodResolver(emailLoginSchema),
        defaultValues: { email: "", password: "" },
    });

    const phoneForm = useForm<z.infer<typeof phoneLoginSchema>>({
        resolver: zodResolver(phoneLoginSchema),
        defaultValues: { phone: "" },
    });
    
    const otpForm = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: "" },
    });

    async function onEmailSubmit(values: z.infer<typeof emailLoginSchema>) {
        setIsLoading(true);
        const user = allUsers.find(u => u.email === values.email && u.password === values.password);

        if (user) {
            toast({
                title: "Login Successful",
                description: `Welcome back, ${user.name}!`,
            });
            login(user);
        } else {
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: "The email or password you entered is incorrect.",
            });
        }
        setIsLoading(false);
    }

    async function onPhoneSubmit(values: z.infer<typeof phoneLoginSchema>) {
        setIsLoading(true);
        const MOCK_PHONE = "+11234567890"; // Test phone number for Layla Olsen

        // Allow any of the mock phone numbers for testing
        const existingUser = allUsers.find(u => u.phoneNumber === values.phone);

        if (!existingUser) {
             toast({
                variant: "destructive",
                title: "Login Failed",
                description: `This phone number is not registered for the prototype. Use a number from the mock data, e.g., ${MOCK_PHONE}.`,
            });
            setIsLoading(false);
            return;
        }

        try {
            const verifier = window.recaptchaVerifier;
            const confirmation = await signInWithPhoneNumber(auth, values.phone, verifier);
            setConfirmationResult(confirmation);
            setAuthStep("otp");
            toast({
                title: "Verification Code Sent",
                description: "Please enter the 6-digit code sent to your phone.",
            });
        } catch (error: unknown) {
            console.error("SMS Auth Error:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to send verification code. Please try again.";
            toast({
                variant: "destructive",
                title: "Error",
                description: errorMessage,
            });
        }
        setIsLoading(false);
    }

    async function onOtpSubmit(values: z.infer<typeof otpSchema>) {
        if (!confirmationResult) return;
        setIsLoading(true);
        try {
            const result = await confirmationResult.confirm(values.otp);
            const firebaseUser = result.user;
            // Find mock user by phone number
            const loggedInUser = allUsers.find(u => u.phoneNumber === firebaseUser.phoneNumber);
            if (!loggedInUser) throw new Error("User profile not found in mock data.");

            toast({
                title: "Login Successful",
                description: `Welcome back, ${loggedInUser.name}!`,
            });
            login(loggedInUser);
        } catch (error: unknown) {
             console.error("OTP Confirmation Error:", error);
            toast({
                variant: "destructive",
                title: "Invalid Code",
                description: "The code you entered is incorrect. Please try again.",
            });
        }
        setIsLoading(false);
    }

    const renderPhoneForm = () => (
        <Form {...phoneForm}>
            <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-6">
                <FormField
                    control={phoneForm.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input placeholder="+1 123 456 7890" {...field} />
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
    );

    const renderOtpForm = () => (
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
                 <Button variant="link" size="sm" onClick={() => setAuthStep("phone")} className="w-full">
                    Use a different phone number
                </Button>
            </form>
        </Form>
    );
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div id="recaptcha-container" className="absolute bottom-0"></div>
            <Card className="w-full max-w-md mx-4">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">
                        Welcome to NQSalam
                    </CardTitle>
                    <CardDescription>
                        Sign in with your preferred method.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="email">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="email">Email</TabsTrigger>
                            <TabsTrigger value="phone">Phone</TabsTrigger>
                        </TabsList>
                        <TabsContent value="email" className="pt-4">
                            <Form {...emailForm}>
                                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                                    <FormField
                                        control={emailForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="admin@nqsalam.app" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={emailForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Sign In
                                    </Button>
                                </form>
                            </Form>
                        </TabsContent>
                        <TabsContent value="phone" className="pt-4">
                           {authStep === "phone" ? renderPhoneForm() : renderOtpForm()}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}

// Add a declaration for the recaptchaVerifier on the window object
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}
