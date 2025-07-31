// Client-side compatible summarization flow for static export

/**
 * @fileOverview Summarizes a group chat history.
 *
 * - summarizeGroupChat - A function that summarizes a group chat history.
 * - SummarizeGroupChatInput - The input type for the summarizeGroupChat function.
 * - SummarizeGroupChatOutput - The return type for the summarizeGroupChat function.
 */

export interface SummarizeGroupChatInput {
  chatHistory: string;
}

export interface SummarizeGroupChatOutput {
  summary: string;
}

export async function summarizeGroupChat(input: SummarizeGroupChatInput): Promise<SummarizeGroupChatOutput> {
  // Mock summarization for static export
  console.log(`[Mock Summarization] Summarizing chat history with ${input.chatHistory.length} characters`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock summary
  return {
    summary: `[Summary] This is a mock summary of the chat history containing ${input.chatHistory.length} characters. The conversation appears to be about various topics and includes multiple participants.`
  };
}
