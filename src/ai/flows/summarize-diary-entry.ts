'use server';

/**
 * @fileOverview A flow to summarize a user's diary entry.
 *
 * - summarizeDiaryEntry - A function that summarizes a diary entry.
 * - SummarizeDiaryEntryInput - The input type for the summarizeDiaryEntry function.
 * - SummarizeDiaryEntryOutput - The return type for the summarizeDiaryEntry function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDiaryEntryInputSchema = z.object({
  diaryEntry: z.string().describe('The diary entry to summarize.'),
});
export type SummarizeDiaryEntryInput = z.infer<typeof SummarizeDiaryEntryInputSchema>;

const SummarizeDiaryEntryOutputSchema = z.object({
  summary: z.string().describe('The summary of the diary entry.'),
});
export type SummarizeDiaryEntryOutput = z.infer<typeof SummarizeDiaryEntryOutputSchema>;

export async function summarizeDiaryEntry(
  input: SummarizeDiaryEntryInput
): Promise<SummarizeDiaryEntryOutput> {
  return summarizeDiaryEntryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDiaryEntryPrompt',
  input: {schema: SummarizeDiaryEntryInputSchema},
  output: {schema: SummarizeDiaryEntryOutputSchema},
  prompt: `Summarize the following diary entry in a concise and informative way:\n\nDiary Entry: {{{diaryEntry}}}`,
});

const summarizeDiaryEntryFlow = ai.defineFlow(
  {
    name: 'summarizeDiaryEntryFlow',
    inputSchema: SummarizeDiaryEntryInputSchema,
    outputSchema: SummarizeDiaryEntryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
