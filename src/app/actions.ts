
"use server";

import { translateMessage, TranslateMessageInput } from "@/ai/flows/translate-message";
import { summarizeGroupChat, SummarizeGroupChatInput } from "@/ai/flows/summarize-group-chat";
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

export async function getSummary(chatHistory: string) {
    try {
        const input: SummarizeGroupChatInput = { chatHistory };
        const result = await summarizeGroupChat(input);
        return { summary: result.summary };
    } catch (error) {
        console.error("Summarization failed:", error);
        return { error: "Failed to summarize chat." };
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

export async function suspendUser(userId: string, currentStatus: 'active' | 'suspended') {
    // Simulate updating user status in a database
    console.log(`User ${userId} status changed to ${currentStatus === 'active' ? 'suspended' : 'active'}`);
    revalidatePath('/?view=admin');
    return { success: true, newStatus: currentStatus === 'active' ? 'suspended' : 'active' };
}

export async function deleteUserById(userId: string) {
    // Simulate deleting a user from a database
    console.log(`User ${userId} deleted.`);
    revalidatePath('/?view=admin');
    return { success: true };
}
