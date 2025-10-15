'use server';

/**
 * @fileOverview A flow to analyze a user's questionnaire answers and generate a profile summary.
 *
 * - analyzeUserProfile - A function that creates a profile summary for an agent.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeUserProfileInputSchema = z.object({
  persona: z.string().describe("The persona of the AI agent who will use this profile."),
  questionnaireAnswers: z.record(z.string()).describe("A JSON object of the user's answers, where keys are question IDs and values are the selected options."),
});
type AnalyzeUserProfileInput = z.infer<typeof AnalyzeUserProfileInputSchema>;

const AnalyzeUserProfileOutputSchema = z.object({
  profileData: z.string().describe("A concise summary (2-3 paragraphs) of the user's profile based on their answers, written from the perspective of the AI agent."),
  roadmap: z.string().describe("A markdown checklist of 5-7 specific, actionable topics or questions the agent plans to explore with the user. For example: - [ ] Explore the user's relationship with..."),
});
export type AnalyzeUserProfileOutput = z.infer<typeof AnalyzeUserProfileOutputSchema>;

export async function analyzeUserProfile(
  input: AnalyzeUserProfileInput
): Promise<AnalyzeUserProfileOutput> {
  return analyzeUserProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeUserProfilePrompt',
  input: { schema: AnalyzeUserProfileInputSchema },
  output: { schema: AnalyzeUserProfileOutputSchema },
  prompt: `You are an AI agent with the following persona: {{{persona}}}

A user has just completed your introductory questionnaire. Your task is to analyze their answers and create two things:
1.  **Initial Profile Summary**: A 2-3 paragraph summary from your professional perspective. Identify key themes, potential areas for growth, and initial observations. Address the user indirectly (e.g., "The user indicates..." not "You indicated...").
2.  **Clinical Roadmap**: A markdown checklist of 5-7 specific, actionable topics or questions you plan to explore with the user over time, based on their answers. This will be your guide for future conversations. Phrase items as questions or "Explore..." statements.

Example Roadmap:
- [ ] Explore the user's feelings about their work-life balance.
- [ ] Ask about the user's definition of "success".
- [ ] Discuss the user's sleep patterns and their impact on mood.

Questionnaire Answers:
{{#each questionnaireAnswers}}
- {{ @key }}: {{ this }}
{{/each}}
`,
});

const analyzeUserProfileFlow = ai.defineFlow(
  {
    name: 'analyzeUserProfileFlow',
    inputSchema: AnalyzeUserProfileInputSchema,
    outputSchema: AnalyzeUserProfileOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
