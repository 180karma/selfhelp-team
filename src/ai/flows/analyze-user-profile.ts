'use server';

/**
 * @fileOverview A flow to analyze a user's entire history and generate a comprehensive clinical profile.
 *
 * - analyzeUserProfile - A function that creates a holistic profile summary for an agent.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Goal } from '@/lib/types';
import { AiMentalHealthNote } from '@/lib/types';

const GoalSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  completed: z.boolean(),
  category: z.enum(['Daily Task', 'Short-Term Goal', 'Long-Term Goal']),
  createdAt: z.string(),
  addedBy: z.string().optional(),
  completedAt: z.string().optional(),
  completionNote: z.string().optional(),
});

const AiMentalHealthNoteSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  aiAgentId: z.string(),
  noteData: z.string(),
  timestamp: z.union([z.string(), z.object({
      seconds: z.number(),
      nanoseconds: z.number(),
  })]),
});

const AnalyzeUserProfileInputSchema = z.object({
  persona: z.string().describe("The persona of the AI agent who will use this profile."),
  questionnaireAnswers: z.record(z.string()).describe("A JSON object of the user's initial answers, where keys are question IDs and values are the selected options."),
  conversationNotes: z.array(AiMentalHealthNoteSchema).describe("An array of all past clinical notes from conversations with this agent."),
  goals: z.array(GoalSchema).describe("An array of the user's current goals and tasks."),
});
export type AnalyzeUserProfileInput = z.infer<typeof AnalyzeUserProfileInputSchema>;

const AnalyzeUserProfileOutputSchema = z.object({
  profileData: z.string().describe("A comprehensive, updated clinical profile summary (3-4 paragraphs) of the user, written from the perspective of the AI agent."),
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

Your task is to create a comprehensive, updated **Clinical Profile** for a user. This is a living document that should be updated over time. You will synthesize information from three sources: the user's initial questionnaire, the full history of past conversation notes, and their current goals.

Write a 3-4 paragraph summary from your professional, first-person perspective (e.g., "My assessment of the client..."). Address the user indirectly (e.g., "The user indicates..." not "You indicated...").

Your summary MUST cover these key areas:
1.  **Client History & Core Issues:** Briefly summarize the key themes and challenges identified from the initial questionnaire and recurring topics in past notes. What are the core wounds or patterns?
2.  **Working Progress:** Describe the progress the user has made. What insights have they gained? How have their responses or behaviors changed over time according to the notes?
3.  **Goals & Tasks Analysis:** Review their assigned tasks and goals. Are they completing them? What does this say about their motivation and engagement?
4.  **Overall Assessment:** Provide your current, high-level assessment of the client's journey and outline the most important areas for future focus.

**Source 1: Initial Questionnaire Answers:**
{{#each questionnaireAnswers}}
- {{ @key }}: {{ this }}
{{/each}}

**Source 2: Past Conversation Notes (in chronological order):**
{{#each conversationNotes}}
- Note from {{timestamp}}: {{noteData}}
---
{{/each}}

**Source 3: User's Goal List:**
{{#each goals}}
- Goal: "{{title}}" (Category: {{category}}, Completed: {{completed}})
{{/each}}

Now, generate the comprehensive and updated Clinical Profile.
`,
});

const analyzeUserProfileFlow = ai.defineFlow(
  {
    name: 'analyzeUserProfileFlow',
    inputSchema: AnalyzeUserProfileInputSchema,
    outputSchema: AnalyzeUserProfileOutputSchema,
  },
  async (input) => {
    // Ensure all note timestamps are strings for the prompt
    const processedInput = {
      ...input,
      conversationNotes: input.conversationNotes.map(note => ({
        ...note,
        timestamp: typeof note.timestamp === 'object' 
          ? new Date(note.timestamp.seconds * 1000).toISOString() 
          : note.timestamp,
      })),
    };

    const { output } = await prompt(processedInput);
    return output!;
  }
);
