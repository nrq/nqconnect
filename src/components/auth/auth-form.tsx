
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
import { useToast } from "@/hooks/use-toast";
import { defaultUser } from "@/lib/data";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(1, "Password is required."),
});

export function AuthForm() {
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const { toast } = useToast();
    
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        setIsLoading(true);

        // For this prototype, we'll use a mock login.
        // In a real app, you would call your Firebase auth method here.
        const MOCK_EMAIL = "admin@nqsalam.app";
        const MOCK_PASSWORD = "password";

        if (values.email === MOCK_EMAIL && values.password === MOCK_PASSWORD) {
            toast({
                title: "Login Successful",
                description: `Welcome back, ${defaultUser.name}!`,
            });
            login(defaultUser);
        } else {
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: "The email or password you entered is incorrect.",
            });
        }
        
        setIsLoading(false);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">
                    Welcome to NQSalam
                </CardTitle>
                <CardDescription>
                    Enter your credentials to sign in to your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
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
                            control={form.control}
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
            </CardContent>
        </Card>
    );
}
