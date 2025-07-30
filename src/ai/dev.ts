import { config } from 'dotenv';
config();

import '@/ai/flows/translate-message.ts';
import '@/ai/flows/summarize-group-chat.ts';
import '@/ai/flows/moderate-image.ts';
