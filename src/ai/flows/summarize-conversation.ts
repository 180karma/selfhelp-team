
'use server';

/**
 * @fileOverview A flow to summarize a single conversation with an AI agent into a clinical note.
 *
 * - summarizeConversation - A function that creates a summary note of a conversation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SummarizeConversationInputSchema = z.object({
  persona: z.string().describe("The persona of the AI agent from the conversation."),
  userName: z.string().describe("The user's name."),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({ text: z.string() })),
  })).describe('The conversation history to be summarized.'),
});
type SummarizeConversationInput = z.infer<typeof SummarizeConversationInputSchema>;

const SummarizeConversationOutputSchema = z.object({
  noteData: z.string().describe("A concise clinical note summarizing the conversation, focusing on key issues, user responses, and resolution practices discussed. This note will be added to the user's history for future analysis."),
});
type SummarizeConversationOutput = z.infer<typeof SummarizeConversationOutputSchema>;


export async function summarizeConversation(
  input: SummarizeConversationInput
): Promise<SummarizeConversationOutput> {
  return summarizeConversationFlow(input);
}


const prompt = ai.definePrompt({
  name: 'summarizeConversationPrompt',
  input: { schema: SummarizeConversationInputSchema },
  output: { schema: SummarizeConversationOutputSchema },
  prompt: `You are an AI agent with the following persona: {{{persona}}}

You have just finished a session with a user named {{{userName}}}. Your task is to document this specific session.

**Create a Clinical Note:** From your first-person perspective (using "I"), write a concise, objective clinical-style note summarizing the key points of **only this conversation**. Refer to the user by their name, {{{userName}}}. Structure it with the following headers, and use bullet points under each:
    *   **Key Issues Discussed:** Main problems or topics {{{userName}}} raised in this session.
    *   **User's Responses & Insights:** How {{{userName}}} felt, thought, and behaved during this discussion.
    *   **Resolution & Plan:** Strategies, suggestions, or action items that I discussed with {{{userName}}} in this session.

Do not include conversational filler. This is an internal process for tracking progress.

Conversation History to Summarize:
{{#each history}}
- {{role}}: {{content.[0].text}}
{{/each}}
`,
});


const summarizeConversationFlow = ai.defineFlow(
  {
    name: 'summarizeConversationFlow',
    inputSchema: SummarizeConversationInputSchema,
    outputSchema: SummarizeConversationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("The AI failed to generate a summary. The output was empty.");
    }
    return output;
  }
);
