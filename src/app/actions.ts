
"use server";

import { translateMessage, TranslateMessageInput } from "@/ai/flows/translate-message";
import { summarizeGroupChat, SummarizeGroupChatInput } from "@/ai/flows/summarize-group-chat";
import { moderateImage, ModerateImageInput } from "@/ai/flows/moderate-image";
import { revalidatePath } from "next/cache";
import { chats, allUsers } from "@/lib/data";
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
        // --- Image Moderation Step ---
        if (payload.imageDataUri) {
            console.log("Moderating image...");
            const moderationInput: ModerateImageInput = { photoDataUri: payload.imageDataUri };
            const moderationResult = await moderateImage(moderationInput);

            if (!moderationResult.isAppropriate) {
                console.log("Image flagged as inappropriate:", moderationResult.reason);
                return { error: moderationResult.reason || "Image violates community guidelines." };
            }
             console.log("Image passed moderation.");
        }
        // --- End of Moderation ---

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
        revalidatePath("/");
        return { updatedChat: chats[chatIndex] };

    } catch (error: any) {
        console.error("Failed to send message:", error);
        return { error: "Could not send message. Please try again." };
    }
}
