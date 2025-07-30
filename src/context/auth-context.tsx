
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@/lib/types";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { defaultUser } from "@/lib/data";

interface AuthContextType {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    login: (user: User) => void;
    logout: () => void;
    reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This is a mock function to fetch user profile from your database
// In a real app, you would fetch this from Firestore or another database
async function fetchUserProfile(firebaseUser: FirebaseUser): Promise<User | null> {
    console.log("Fetching profile for user:", firebaseUser.uid);
    // For this prototype, we'll check if a user profile exists in localStorage.
    // If not, it means it's a new user.
    const storedUser = localStorage.getItem("nqsalam-user-profile");
    if (storedUser) {
        return JSON.parse(storedUser);
    }
    // If no profile, it might be a new registration.
    // The details form will handle creating this.
    return null;
}


export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setFirebaseUser(user);
            if (user) {
                // User is signed in with Firebase. Now fetch our application-specific user profile.
                const userProfile = await fetchUserProfile(user);
                setUser(userProfile);
            } else {
                // User is signed out.
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = (userData: User) => {
        // This function is now for saving the user profile after it's created/updated
        const userWithStorage = { ...userData, storage: { used: 25, total: 100 } };
        localStorage.setItem("nqsalam-user-profile", JSON.stringify(userWithStorage));
        setUser(userWithStorage);
    };

    const logout = () => {
        auth.signOut();
        localStorage.removeItem("nqsalam-user-profile");
        setUser(null);
    };

    const reloadUser = async () => {
        if (auth.currentUser) {
            await auth.currentUser.reload();
            const reloadedUser = auth.currentUser;
            setFirebaseUser(reloadedUser);
            if (reloadedUser) {
                const userProfile = await fetchUserProfile(reloadedUser);
                setUser(userProfile);
            }
        }
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
