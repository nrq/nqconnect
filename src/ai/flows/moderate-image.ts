'use server';

// Server-side image moderation flow for Firebase App Hosting

/**
 * @fileOverview An image moderation AI agent.
 *
 * - moderateImage - A function that handles the image moderation process.
 * - ModerateImageInput - The input type for the moderateImage function.
 * - ModerateImageOutput - The return type for the moderateImage function.
 */

export interface ModerateImageInput {
  photoDataUri: string;
}

export interface ModerateImageOutput {
  isAppropriate: boolean;
  reason?: string;
}

export async function moderateImage(input: ModerateImageInput): Promise<ModerateImageOutput> {
  // For now, using mock moderation until real AI is configured
  console.log(`[Server Image Moderation] Checking image with ${input.photoDataUri.length} characters`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock moderation result (always appropriate for demo)
  return { 
    isAppropriate: true,
    reason: "Mock moderation - always approved for demo purposes"
  };
}
