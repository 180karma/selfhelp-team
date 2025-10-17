
'use server';

/**
 * @fileOverview A flow to handle chat interactions with AI agents.
 *
 * - agentChat - A function that generates a response from an AI agent.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getRandomAcknowledgement } from '@/lib/acknowledgements';

// Define schemas inside the file, but do not export them.
const AgentChatInputSchema = z.object({
  persona: z.string().describe('The persona or role the AI agent should adopt.'),
  userName: z.string().describe("The user's name."),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({ text: z.string() })),
  })).describe('The conversation history.'),
  message: z.string().describe('The latest user message.'),
  lastAcknowledgement: z.string().optional().describe('The last acknowledgement used by the agent.'),
});
type AgentChatInput = z.infer<typeof AgentChatInputSchema>;

const AgentChatOutputSchema = z.object({
    response: z.string().describe("The AI agent's text response, which may or may not include a question."),
    question: z.object({
        text: z.string().describe("A follow-up question to the user."),
        options: z.array(z.string()).describe("A list of simple answers for the user to choose from."),
        addTask: z.object({
            title: z.string().describe("The title of the task to add to the user's goal list."),
            category: z.enum(['Daily Task', 'Short-Term Goal', 'Long-Term Goal']).describe("The category of the task (Daily, Short-Term, or Long-Term)."),
            addedBy: z.string().describe("The name of the agent adding the task.")
        }).describe("A mandatory task for the user to add to their goal list if they agree.").optional()
    }).describe("A multiple-choice question to ask the user.").optional(),
    acknowledgement: z.string().describe("The acknowledgement phrase used.")
});
type AgentChatOutput = z.infer<typeof AgentChatOutputSchema>;

const agentChatFlow = ai.defineFlow(
  {
    name: 'agentChatFlow',
    inputSchema: AgentChatInputSchema,
    outputSchema: AgentChatOutputSchema,
  },
  async (input) => {
    const { persona, userName, history, message, lastAcknowledgement } = input;

    const llmResponse = await ai.generate({
      prompt: message,
      history: history,
      system: `${persona}\n\nYou are addressing the user by their first name: ${userName}.`,
      output: {
        schema: z.object({ // Create a temporary schema for the AI output, without the acknowledgement
            response: AgentChatOutputSchema.shape.response,
            question: AgentChatOutputSchema.shape.question,
        }),
      }
    });

    const output = llmResponse.output;

    if (!output) {
      throw new Error("Flow did not produce a valid output.");
    }
    
    // Determine if an acknowledgement should be added.
    // We add one if there's history and the last message was from the user.
    const shouldAcknowledge = history.length > 0 && history[history.length -1].role === 'user';
    const acknowledgement = shouldAcknowledge ? getRandomAcknowledgement(lastAcknowledgement) : '';
    const finalResponse = shouldAcknowledge ? `${acknowledgement} ${output.response}` : output.response;

    return {
        response: finalResponse,
        question: output.question,
        acknowledgement: acknowledgement,
    };
  }
);

// Only export the async function.
export async function agentChat(input: AgentChatInput): Promise<AgentChatOutput> {
  return agentChatFlow(input);
}
