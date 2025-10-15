import { config } from 'dotenv';
config();

import '@/ai/flows/generate-initial-diary-entry.ts';
import '@/ai/flows/summarize-diary-entry.ts';