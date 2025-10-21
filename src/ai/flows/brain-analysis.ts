
'use server';

/**
 * @fileOverview The "Brain" AI agent for deep text analysis.
 *
 * - analyzeTextWithNeuroGuide - A function that analyzes text against the neuro guide.
 * - BrainAnalysisInput - The input type for the analysis function.
 * - BrainAnalysisOutput - The return type for the analysis function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { neuroGuideTable } from '@/lib/neuro-guide';

const DetectedSymptomSchema = z.object({
  symptomId: z.string().describe('The unique ID of the detected symptom from the Neuro Guide (e.g., "anx-1").'),
  symptom: z.string().describe('The name of the symptom (e.g., "Excessive Worry").'),
  supportingQuote: z.string().describe('A direct quote from the user\'s text that supports the detection of this symptom.'),
});

const DetectedCategorySchema = z.object({
  categoryId: z.string().describe('The unique ID of the detected category from the Neuro Guide (e.g., "anxiety").'),
  categoryName: z.string().describe('The name of the category (e.g., "General Anxiety").'),
  score: z.number().describe('The number of unique symptoms detected for this category.'),
  detectedSymptoms: z.array(DetectedSymptomSchema).describe('A list of symptoms found within this category.'),
});

export const BrainAnalysisInputSchema = z.object({
  textToAnalyze: z.string().describe('The user\'s text (diary entry or chat conversation) to be analyzed.'),
});
export type BrainAnalysisInput = z.infer<typeof BrainAnalysisInputSchema>;

export const BrainAnalysisOutputSchema = z.object({
  neuroInsightProfile: z.array(DetectedCategorySchema).describe('A list of psychological categories with detected symptoms and scores.'),
});
export type BrainAnalysisOutput = z.infer<typeof BrainAnalysisOutputSchema>;

export async function analyzeTextWithNeuroGuide(
  input: BrainAnalysisInput
): Promise<BrainAnalysisOutput> {
  return analyzeTextWithNeuroGuideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'brainAnalysisPrompt',
  input: { schema: BrainAnalysisInputSchema },
  output: { schema: BrainAnalysisOutputSchema },
  prompt: `You are "The Brain," a specialized AI that analyzes text for psychological insights. Your ONLY task is to analyze the user's text against the provided "Neuro Guide Table."

**Instructions:**
1.  Read the user's text carefully.
2.  Compare the text against each symptom in the Neuro Guide Table.
3.  For each symptom you find evidence for, you MUST extract a direct quote from the text that supports your finding.
4.  Group the detected symptoms by their category (e.g., "General Anxiety", "Depression").
5.  Calculate a "score" for each category, which is simply the count of unique symptoms found for that category.
6.  You MUST NOT diagnose the user. You ONLY identify potential symptoms based on the provided text and table.
7.  If no symptoms are detected for a category, do not include it in the output. If no symptoms are detected at all, return an empty array.

**Neuro Guide Table:**
\`\`\`json
${JSON.stringify(neuroGuideTable, null, 2)}
\`\`\`

**User's Text to Analyze:**
"{{{textToAnalyze}}}"

Now, generate the Neuro-Insight Profile based on your analysis.
`,
});

const analyzeTextWithNeuroGuideFlow = ai.defineFlow(
  {
    name: 'analyzeTextWithNeuroGuideFlow',
    inputSchema: BrainAnalysisInputSchema,
    outputSchema: BrainAnalysisOutputSchema,
  },
  async (input) => {
    if (!input.textToAnalyze.trim()) {
      return { neuroInsightProfile: [] };
    }
    const { output } = await prompt(input);
    return output!;
  }
);
