'use server';

/**
 * @fileOverview Summarizes a group chat history.
 *
 * - summarizeGroupChat - A function that summarizes a group chat history.
 * - SummarizeGroupChatInput - The input type for the summarizeGroupChat function.
 * - SummarizeGroupChatOutput - The return type for the summarizeGroupChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeGroupChatInputSchema = z.object({
  chatHistory: z.string().describe('The complete chat history of the group chat.'),
});
export type SummarizeGroupChatInput = z.infer<typeof SummarizeGroupChatInputSchema>;

const SummarizeGroupChatOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the group chat history.'),
});
export type SummarizeGroupChatOutput = z.infer<typeof SummarizeGroupChatOutputSchema>;

export async function summarizeGroupChat(input: SummarizeGroupChatInput): Promise<SummarizeGroupChatOutput> {
  return summarizeGroupChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeGroupChatPrompt',
  input: {schema: SummarizeGroupChatInputSchema},
  output: {schema: SummarizeGroupChatOutputSchema},
  prompt: `You are an AI assistant summarizing a group chat for a user who wants to catch up quickly.

  Please provide a concise summary of the following chat history:

  {{chatHistory}}
  `,
});

const summarizeGroupChatFlow = ai.defineFlow(
  {
    name: 'summarizeGroupChatFlow',
    inputSchema: SummarizeGroupChatInputSchema,
    outputSchema: SummarizeGroupChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
