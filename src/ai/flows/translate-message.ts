// Client-side compatible translation flow for static export

/**
 * @fileOverview A translation AI agent.
 *
 * - translateMessage - A function that handles the message translation process.
 * - TranslateMessageInput - The input type for the translateMessage function.
 * - TranslateMessageOutput - The return type for the translateMessage function.
 */

export interface TranslateMessageInput {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface TranslateMessageOutput {
  translatedText: string;
}

export async function translateMessage(input: TranslateMessageInput): Promise<TranslateMessageOutput> {
  // Mock translation for static export
  console.log(`[Mock Translation] Translating: "${input.text}" from ${input.sourceLanguage} to ${input.targetLanguage}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock translation
  return {
    translatedText: `[Translated] ${input.text} (${input.sourceLanguage} → ${input.targetLanguage})`
  };
}
