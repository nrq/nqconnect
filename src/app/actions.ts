"use server";

import { translateMessage, TranslateMessageInput } from "@/ai/flows/translate-message";
import { revalidatePath } from "next/cache";

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

export async function deleteAccount() {
    // In a real application, you would have logic here to delete the user's account
    // from your database and any other services.
    // For this prototype, we'll just simulate it.
    console.log("User account deleted.");
    revalidatePath("/");
    return { success: true };
}
