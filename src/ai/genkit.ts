// Client-side compatible AI configuration for static export
// This replaces the server-side Genkit implementation

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Mock AI client for static export
export const ai = {
  definePrompt: (config: any) => {
    return {
      name: config.name,
      input: config.input,
      output: config.output,
      prompt: config.prompt,
    };
  },
  defineFlow: (config: any, handler: any) => {
    return async (input: any) => {
      // Mock implementation for static export
      console.log(`[Mock AI] ${config.name} called with:`, input);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock responses based on the flow type
      if (config.name === 'translateMessageFlow') {
        return {
          translatedText: `[Translated] ${input.text} (${input.sourceLanguage} → ${input.targetLanguage})`
        };
      } else if (config.name === 'summarizeGroupChatFlow') {
        return {
          summary: `[Summary] This is a mock summary of the chat history containing ${input.chatHistory.length} characters.`
        };
      }
      
      return { error: 'Mock AI response not implemented for this flow' };
    };
  }
};
