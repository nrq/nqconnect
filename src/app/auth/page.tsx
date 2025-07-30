"use client";

import { AuthForm } from "@/components/auth/auth-form";

export default function AuthPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <AuthForm />
            </div>
        </div>
    );
}
