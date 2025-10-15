'use server';

/**
 * @fileOverview A flow to categorize a user's diary entry.
 *
 * - categorizeDiaryEntry - A function that categorizes a diary entry.
 * - CategorizeDiaryEntryInput - The input type for the categorizeDiaryEntry function.
 * - CategorizeDiaryEntryOutput - The return type for the categorizeDiaryEntry function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CategorizeDiaryEntryInputSchema = z.object({
  diaryEntry: z.string().describe('The diary entry to categorize.'),
});
export type CategorizeDiaryEntryInput = z.infer<typeof CategorizeDiaryEntryInputSchema>;

const CategorizeDiaryEntryOutputSchema = z.object({
  categories: z.array(z.string()).describe('A list of 1-3 relevant categories for the diary entry.'),
});
export type CategorizeDiaryEntryOutput = z.infer<typeof CategorizeDiaryEntryOutputSchema>;

export async function categorizeDiaryEntry(
  input: CategorizeDiaryEntryInput
): Promise<CategorizeDiaryEntryOutput> {
  return categorizeDiaryEntryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeDiaryEntryPrompt',
  input: { schema: CategorizeDiaryEntryInputSchema },
  output: { schema: CategorizeDiaryEntryOutputSchema },
  prompt: `Analyze the following diary entry and assign 1 to 3 relevant categories from the user's life. These categories will help track themes over time. Examples could be "Work Stress", "Family", "Relationships", "Personal Growth", "Health", "Anxiety", "Creativity", etc. Be concise.

Diary Entry: {{{diaryEntry}}}`,
});

const categorizeDiaryEntryFlow = ai.defineFlow(
  {
    name: 'categorizeDiaryEntryFlow',
    inputSchema: CategorizeDiaryEntryInputSchema,
    outputSchema: CategorizeDiaryEntryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
