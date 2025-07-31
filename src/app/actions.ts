'use server';

import { translateMessage, TranslateMessageInput } from "@/ai/flows/translate-message";
import { summarizeGroupChat, SummarizeGroupChatInput } from "@/ai/flows/summarize-group-chat";
import { chats } from "@/lib/data";
import { Message, Chat } from "@/lib/types";

export async function getTranslation(text: string, sourceLanguage: string, targetLanguage: string) {
    try {
        const input: TranslateMessageInput = {
            text,
            sourceLanguage,
            targetLanguage,
        };
        const result = await translateMessage(input);
        return { translatedText: result.translatedText };
    } catch (error: unknown) {
        console.error("Translation failed:", error);
        return { error: "Failed to translate message." };
    }
}

export async function getSummary(chatHistory: string) {
    try {
        const input: SummarizeGroupChatInput = {
            chatHistory,
        };
        const result = await summarizeGroupChat(input);
        return { summary: result.summary };
    } catch (error: unknown) {
        console.error("Summarization failed:", error);
        return { error: "Failed to summarize chat." };
    }
}

export async function suspendUser(userId: string, currentStatus: 'active' | 'suspended') {
    // Mock implementation for static export
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    return { success: true, newStatus };
}

export async function deleteUserById(userId: string) {
    // Mock implementation for static export
    return { success: true };
}

export async function deleteAccount() {
    // Mock implementation for static export
    return { success: true };
}

// In a real app, this would interact with a database like Firestore
// and an upload service like Firebase Storage.
export async function sendMessage(
    payload: {
        chatId: string;
        senderId: string;
        text: string;
        imageDataUri?: string;
    }
): Promise<{ updatedChat?: Chat; error?: string }> {
    console.log("Simulating sending message:", payload);

    try {
        // Find the chat in our mock data
        const chatIndex = chats.findIndex(c => c.id === payload.chatId);
        if (chatIndex === -1) {
            return { error: "Chat not found." };
        }

        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            senderId: payload.senderId,
            text: payload.text,
            timestamp: new Date(),
            imageUrl: payload.imageDataUri, // Using data URI directly for prototype
            language: 'English' // Assume sent messages are in English for now
        };

        // Add the message to the chat
        chats[chatIndex].messages.push(newMessage);

        // In a real app, you wouldn't return the whole chat object,
        // but for this simulation, it's the easiest way to update the client state.
        return { updatedChat: chats[chatIndex] };

    } catch (error: unknown) {
        console.error("Failed to send message:", error);
        return { error: "Could not send message. Please try again." };
    }
}
