'use server';

/**
 * @fileOverview A flow to handle chat interactions with AI agents.
 *
 * - agentChat - A function that generates a response from an AI agent.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define schemas inside the file, but do not export them.
const AgentChatInputSchema = z.object({
  persona: z.string().describe('The persona or role the AI agent should adopt.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({ text: z.string() })),
  })).describe('The conversation history.'),
  message: z.string().describe('The latest user message.'),
  userName: z.string().describe("The user's name."),
});
type AgentChatInput = z.infer<typeof AgentChatInputSchema>;

const AgentChatOutputSchema = z.object({
  response: z.string().describe("The AI agent's text response."),
  question: z.object({
    text: z.string().describe("A follow-up question."),
    options: z.array(z.string()).describe("A list of multiple-choice options for the user to select.")
  }).describe("A mandatory multiple-choice question to ask the user."),
  addTask: z.object({
    title: z.string().describe("The title of the task to add to the user's goal list."),
    category: z.enum(['Daily Task', 'Short-Term Goal', 'Long-Term Goal']).describe("The category of the task."),
    addedBy: z.string().describe("The name of the agent adding the task.")
  }).optional().describe("An optional task for the user to add to their goal list."),
});
type AgentChatOutput = z.infer<typeof AgentChatOutputSchema>;

const agentChatFlow = ai.defineFlow(
  {
    name: 'agentChatFlow',
    inputSchema: AgentChatInputSchema,
    outputSchema: AgentChatOutputSchema,
  },
  async (input) => {
    const { persona, history, message, userName } = input;

    const llmResponse = await ai.generate({
      prompt: message,
      history: history,
      system: persona.replace('{{{userName}}}', userName),
      output: {
        schema: AgentChatOutputSchema,
      }
    });

    return llmResponse.output!;
  }
);

// Only export the async function.
export async function agentChat(input: AgentChatInput): Promise<AgentChatOutput> {
  return agentChatFlow(input);
}
