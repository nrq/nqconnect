"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const formSchema = z.object({
    phoneNumber: z.string().regex(phoneRegex, "Invalid phone number"),
});

const otpSchema = z.object({
    otp: z.string().min(6, "OTP must be 6 digits"),
});

export function AuthForm() {
    const [step, setStep] = useState<"phone" | "otp">("phone");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    
    const phoneForm = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
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

    async function onPhoneSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        // Simulate sending OTP
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Sending OTP to:", values.phoneNumber);
        setIsLoading(false);
        setStep("otp");
    }

    async function onOtpSubmit(values: z.infer<typeof otpSchema>) {
        setIsLoading(true);
        // Simulate verifying OTP and logging in
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Verifying OTP:", values.otp);
        login({
            id: 'user-0',
            name: 'Youssef',
            avatar: 'https://placehold.co/100x100/3CB371/FFFFFF?text=Y',
            isOnline: true,
        });
        setIsLoading(false);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">
                    {step === "phone" ? "Welcome to NQSalam" : "Enter Verification Code"}
                </CardTitle>
                <CardDescription>
                    {step === "phone" 
                        ? "Enter your phone number to sign in or create an account." 
                        : `We've sent a 6-digit code to ${phoneForm.getValues("phoneNumber")}.`
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>
                {step === "phone" ? (
                    <Form {...phoneForm}>
                        <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-6">
                            <FormField
                                control={phoneForm.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+1 (555) 123-4567" {...field} />
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
                ) : (
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
                )}
            </CardContent>
        </Card>
    );
}
