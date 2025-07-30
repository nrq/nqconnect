"use server";

import { translateMessage, TranslateMessageInput } from "@/ai/flows/translate-message";

export async function getTranslation(text: string, sourceLanguage: string, targetLanguage: string) {
    try {
        const input: TranslateMessageInput = {
            text,
            sourceLanguage,
            targetLanguage,
        };
        const result = await translateMessage(input);
        return { translatedText: result.translatedText };
    } catch (error) {
        console.error("Translation failed:", error);
        return { error: "Failed to translate message." };
    }
}
