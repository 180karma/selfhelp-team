'use server';

/**
 * @fileOverview A flow to summarize a conversation with an AI agent.
 *
 * - summarizeConversation - A function that creates a summary note of a conversation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SummarizeConversationInputSchema = z.object({
  persona: z.string().describe("The persona of the AI agent from the conversation."),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({ text: z.string() })),
  })).describe('The conversation history to be summarized.'),
});
type SummarizeConversationInput = z.infer<typeof SummarizeConversationInputSchema>;

const SummarizeConversationOutputSchema = z.object({
  noteData: z.string().describe("A concise summary of the conversation, focusing on key issues, user responses, and resolution practices discussed."),
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

Your task is to create a concise clinical-style note summarizing the provided conversation history with a user. The note should be objective and focus on the key points of the interaction.

Structure the note to include:
1.  **Key Issues:** What were the main problems or topics the user brought up?
2.  **User Responses:** How did the user describe their feelings, thoughts, and behaviors related to these issues?
3.  **Resolution Practices:** What strategies, suggestions, or action items were discussed to address the issues?

Do not include conversational filler. This is an internal note for tracking progress over time.

Conversation History:
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
    return output!;
  }
);
