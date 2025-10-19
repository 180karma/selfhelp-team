
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
  userName: z.string().describe("The user's name."),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({ text: z.string() })),
  })).describe('The conversation history to be summarized.'),
  roadmap: z.any().describe('The current clinical roadmap, which can be a string or a JSON object.'),
});
type SummarizeConversationInput = z.infer<typeof SummarizeConversationInputSchema>;

const SummarizeConversationOutputSchema = z.object({
  noteData: z.string().describe("A concise summary of the conversation, focusing on key issues, user responses, and resolution practices discussed."),
  updatedRoadmap: z.string().describe("The updated version of the clinical roadmap. The agent should check off the item that was discussed in the conversation, for example: - [x] Discussed topic. The agent can also add, remove, or rephrase items based on the conversation to better tailor the long-term plan."),
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

Your two main tasks are:
1.  **Create a Clinical Note:** From your first-person perspective (using "I"), write a concise, objective clinical-style note summarizing the key points of our conversation with the user, {{{userName}}}. Structure it with the following headers, and use bullet points under each:
    *   **Key Issues Discussed:** Main problems or topics the user raised.
    *   **User's Responses & Insights:** How the user felt, thought, and behaved during the discussion.
    *   **Resolution & Plan:** Strategies, suggestions, or action items that I discussed with the user.

2.  **Update the Clinical Roadmap:** Review the conversation and the provided "Clinical Roadmap." Your goal is to evolve this plan. The roadmap is provided as a JSON string.
    *   **Mark Completion:** Find the primary module that was discussed and mark its 'completed' property to 'true'.
    *   **Edit & Add (If Necessary):** Based on what you learned, you can add new follow-up items to the notes, rephrase existing module titles for clarity, or adjust the order to better fit the user's journey. Return the entire, updated roadmap as a JSON string.

Do not include conversational filler. This is an internal process for tracking progress and refining the user's plan.

Conversation History:
{{#each history}}
- {{role}}: {{content.[0].text}}
{{/each}}

Current Roadmap (JSON format):
{{{roadmap}}}
`,
});


const summarizeConversationFlow = ai.defineFlow(
  {
    name: 'summarizeConversationFlow',
    inputSchema: SummarizeConversationInputSchema,
    outputSchema: SummarizeConversationOutputSchema,
  },
  async (input) => {
    // If the roadmap is an object, stringify it for the prompt.
    const processedInput = {
      ...input,
      roadmap: typeof input.roadmap === 'object' ? JSON.stringify(input.roadmap, null, 2) : input.roadmap,
    };

    const { output } = await prompt(processedInput);
    return output!;
  }
);
