"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type FontSize = "sm" | "base" | "lg";

interface AppearanceContextType {
    fontSize: FontSize;
    setFontSize: (size: FontSize) => void;
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

export function AppearanceProvider({ children }: { children: ReactNode }) {
    const [fontSize, setFontSizeState] = useState<FontSize>("base");

    useEffect(() => {
        const storedFontSize = localStorage.getItem("nqc-fontsize") as FontSize | null;
        if (storedFontSize) {
            setFontSizeState(storedFontSize);
        }
    }, []);

    useEffect(() => {
        document.documentElement.classList.remove("font-size-sm", "font-size-base", "font-size-lg");
        document.documentElement.classList.add(`font-size-${fontSize}`);
    }, [fontSize]);

    const setFontSize = (size: FontSize) => {
        localStorage.setItem("nqc-fontsize", size);
        setFontSizeState(size);
    };

    return (
        <AppearanceContext.Provider value={{ fontSize, setFontSize }}>
            {children}
        </AppearanceContext.Provider>
    );
}

export function useAppearance() {
    const context = useContext(AppearanceContext);
    if (context === undefined) {
        throw new Error("useAppearance must be used within an AppearanceProvider");
    }
    return context;
}
