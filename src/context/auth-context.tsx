
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@/lib/types";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

interface AuthContextType {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    login: (user: User) => void;
    logout: () => void;
    reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In a real app with email/password, you'd fetch a profile from your DB after Firebase confirms the login.
// For this prototype, we'll just use a mock user object.
async function fetchUserProfile(userId: string): Promise<User | null> {
    console.log("Fetching profile for user:", userId);
    // For this prototype, we'll check if a user profile exists in localStorage.
    const storedUser = localStorage.getItem("nqsalam-user-profile");
    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.id === userId) {
            return parsedUser;
        }
    }
    return null;
}


export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // We're keeping onAuthStateChanged for potential future use, 
        // but our primary login flow is now mocked.
        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
            setFirebaseUser(fbUser);
            if (fbUser) {
                const userProfile = await fetchUserProfile(fbUser.uid);
                setUser(userProfile);
            } else {
                // Also check localStorage for our mock user session
                 const localUser = localStorage.getItem("nqsalam-user-profile");
                 if (localUser) {
                     setUser(JSON.parse(localUser));
                 } else {
                    setUser(null);
                 }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = (userData: User) => {
        // This function saves the mock user to localStorage to simulate a session
        localStorage.setItem("nqsalam-user-profile", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        // Sign out from firebase if the user was ever logged in, and clear our mock session
        auth.signOut();
        localStorage.removeItem("nqsalam-user-profile");
        setUser(null);
    };

    const reloadUser = async () => {
        // This function is less relevant for a mock flow, but we'll keep it for consistency
        setLoading(true);
        const localUser = localStorage.getItem("nqsalam-user-profile");
        if (localUser) {
            setUser(JSON.parse(localUser));
        } else {
            setUser(null);
        }
        setLoading(false);
    }


    return (
        <AuthContext.Provider value={{ user, firebaseUser, loading, login, logout, reloadUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
