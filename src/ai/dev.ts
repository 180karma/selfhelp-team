'use client';
import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-diary-entry.ts';
import '@/ai/flows/categorize-diary-entry.ts';
import '@/ai/flows/agent-chat.ts';
import '@/ai/flows/analyze-user-profile.ts';
import '@/ai/flows/summarize-conversation.ts';
import '@/ai/flows/create-roadmap.ts';
