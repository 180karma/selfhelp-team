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
});
type AgentChatInput = z.infer<typeof AgentChatInputSchema>;

const AgentChatOutputSchema = z.object({
  response: z.string().describe('The AI agent\'s response.'),
});
type AgentChatOutput = z.infer<typeof AgentChatOutputSchema>;


const agentChatFlow = ai.defineFlow(
  {
    name: 'agentChatFlow',
    inputSchema: AgentChatInputSchema,
    outputSchema: AgentChatOutputSchema,
  },
  async (input) => {
    const { persona, history, message } = input;

    const llmResponse = await ai.generate({
      prompt: message,
      history: history,
      system: persona,
    });

    return { response: llmResponse.text };
  }
);

// Only export the async function.
export async function agentChat(input: AgentChatInput): Promise<AgentChatOutput> {
  return agentChatFlow(input);
}
