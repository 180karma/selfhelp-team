'use server';

/**
 * @fileOverview Generates an initial diary entry from a short prompt.
 *
 * - generateInitialDiaryEntry - A function that generates an initial diary entry.
 * - GenerateInitialDiaryEntryInput - The input type for the generateInitialDiaryEntry function.
 * - GenerateInitialDiaryEntryOutput - The return type for the generateInitialDiaryEntry function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInitialDiaryEntryInputSchema = z.object({
  prompt: z.string().describe('A short prompt to inspire the diary entry.'),
});
export type GenerateInitialDiaryEntryInput = z.infer<typeof GenerateInitialDiaryEntryInputSchema>;

const GenerateInitialDiaryEntryOutputSchema = z.object({
  diaryEntry: z.string().describe('The generated diary entry.'),
});
export type GenerateInitialDiaryEntryOutput = z.infer<typeof GenerateInitialDiaryEntryOutputSchema>;

export async function generateInitialDiaryEntry(
  input: GenerateInitialDiaryEntryInput
): Promise<GenerateInitialDiaryEntryOutput> {
  return generateInitialDiaryEntryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInitialDiaryEntryPrompt',
  input: {schema: GenerateInitialDiaryEntryInputSchema},
  output: {schema: GenerateInitialDiaryEntryOutputSchema},
  prompt: `Write a diary entry based on the following prompt:\n\n{{prompt}}`,
});

const generateInitialDiaryEntryFlow = ai.defineFlow(
  {
    name: 'generateInitialDiaryEntryFlow',
    inputSchema: GenerateInitialDiaryEntryInputSchema,
    outputSchema: GenerateInitialDiaryEntryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
