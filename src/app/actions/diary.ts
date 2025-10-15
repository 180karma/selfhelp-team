'use server';

import { summarizeDiaryEntry } from '@/ai/flows/summarize-diary-entry';
import { z } from 'zod';

const summarySchema = z.object({
  content: z.string().min(1, 'Content is empty.'),
});

export async function summarizeEntryAction(content: string) {
  const validatedFields = summarySchema.safeParse({ content });

  if (!validatedFields.success) {
    return { error: 'Invalid content for summary.' };
  }

  try {
    const result = await summarizeDiaryEntry({ diaryEntry: validatedFields.data.content });
    return { summary: result.summary };
  } catch (error) {
    return { error: 'Failed to generate summary.' };
  }
}
