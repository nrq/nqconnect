
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
import { defaultUser } from "@/lib/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

export function AuthForm() {
    const [step, setStep] = useState<"phone" | "otp" | "details">("phone");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    
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

    async function onPhoneSubmit(values: z.infer<typeof phoneSchema>) {
        setIsLoading(true);
        // Simulate sending OTP
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Sending OTP to:", values.phoneNumber);
        setIsLoading(false);
        setStep("otp");
    }

    async function onOtpSubmit(values: z.infer<typeof otpSchema>) {
        setIsLoading(true);
        // Simulate verifying OTP
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Verifying OTP:", values.otp);
        setIsLoading(false);
        // Check if user is "new" by seeing if they have a class selected.
        // In a real app, you'd check your database. For this prototype,
        // we assume a user is new if they don't have a Quran class assigned in the default data.
        if (defaultUser.quranClass) {
            login(defaultUser);
        } else {
            setStep("details");
        }
    }

    async function onDetailsSubmit(values: z.infer<typeof detailsSchema>) {
        setIsLoading(true);
        // Simulate saving details and logging in
        await new Promise(resolve => setTimeout(resolve, 1500));
        const finalUser = {
            ...defaultUser,
            ...values,
            language: values.language as any,
        };
        console.log("Saving user details:", finalUser);
        login(finalUser);
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
            </CardContent>
        </Card>
    );
}
