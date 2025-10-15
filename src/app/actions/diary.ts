'use server';

import { generateInitialDiaryEntry } from '@/ai/flows/generate-initial-diary-entry';
import { summarizeDiaryEntry } from '@/ai/flows/summarize-diary-entry';
import { z } from 'zod';

const promptSchema = z.object({
  prompt: z.string().min(3, 'Prompt must be at least 3 characters long.'),
});

export async function generateEntryAction(prevState: any, formData: FormData) {
  const validatedFields = promptSchema.safeParse({
    prompt: formData.get('prompt'),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.prompt?.[0] || 'Invalid prompt.',
      diaryEntry: '',
    };
  }

  try {
    const result = await generateInitialDiaryEntry({ prompt: validatedFields.data.prompt });
    return {
      message: 'success',
      diaryEntry: result.diaryEntry,
    };
  } catch (error) {
    return {
      message: 'Failed to generate entry. Please try again.',
      diaryEntry: '',
    };
  }
}

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
