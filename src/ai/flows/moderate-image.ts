'use server';

/**
 * @fileOverview An image moderation AI agent.
 *
 * - moderateImage - A function that handles the image moderation process.
 * - ModerateImageInput - The input type for the moderateImage function.
 * - ModerateImageOutput - The return type for the moderateImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModerateImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to moderate, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ModerateImageInput = z.infer<typeof ModerateImageInputSchema>;

const ModerateImageOutputSchema = z.object({
    isAppropriate: z.boolean().describe('Whether or not the image is appropriate.'),
    reason: z.string().optional().describe('The reason the image was flagged as inappropriate.'),
});
export type ModerateImageOutput = z.infer<typeof ModerateImageOutputSchema>;

export async function moderateImage(input: ModerateImageInput): Promise<ModerateImageOutput> {
  return moderateImageFlow(input);
}

const moderateImageFlow = ai.defineFlow(
  {
    name: 'moderateImageFlow',
    inputSchema: ModerateImageInputSchema,
    outputSchema: ModerateImageOutputSchema,
  },
  async input => {
    try {
        const { candidates } = await ai.generate({
            model: 'googleai/gemini-2.0-flash',
            prompt: [{media: {url: input.photoDataUri}}],
            config: {
                safetySettings: [
                    {
                        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                        threshold: 'BLOCK_LOW_AND_ABOVE',
                    },
                     {
                        category: 'HARM_CATEGORY_HATE_SPEECH',
                        threshold: 'BLOCK_LOW_AND_ABOVE',
                    },
                    {
                        category: 'HARM_CATEGORY_HARASSMENT',
                        threshold: 'BLOCK_LOW_AND_ABOVE',
                    },
                    {
                        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                        threshold: 'BLOCK_LOW_AND_ABOVE',
                    },
                ],
            }
        });

        const blockedCandidate = candidates.find(c => c.finishReason === 'BLOCKED');
        if (blockedCandidate) {
            const safetyRating = blockedCandidate.safetyRatings?.[0];
            return {
                isAppropriate: false,
                reason: `Image blocked due to: ${safetyRating?.category || 'Inappropriate Content'}.`,
            };
        }

       return { isAppropriate: true };

    } catch (error: any) {
        console.error('Error during moderation:', error);
        // This can happen if the API call itself fails.
         return {
            isAppropriate: false,
            reason: 'Could not process image for moderation.'
        };
    }
  }
);
