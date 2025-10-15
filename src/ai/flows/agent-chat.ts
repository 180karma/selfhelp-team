'use server';

/**
 * @fileOverview A flow to handle chat interactions with AI agents.
 *
 * - agentChat - A function that generates a response from an AI agent.
 * - AgentChatInput - The input type for the agentChat function.
 * - AgentChatOutput - The return type for the agentChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const AgentChatInputSchema = z.object({
  persona: z.string().describe('The persona or role the AI agent should adopt.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({ text: z.string() })),
  })).describe('The conversation history.'),
  message: z.string().describe('The latest user message.'),
});
export type AgentChatInput = z.infer<typeof AgentChatInputSchema>;

export const AgentChatOutputSchema = z.object({
  response: z.string().describe('The AI agent\'s response.'),
});
export type AgentChatOutput = z.infer<typeof AgentChatOutputSchema>;


export async function agentChat(input: AgentChatInput): Promise<AgentChatOutput> {
  return agentChatFlow(input);
}

const agentChatFlow = ai.defineFlow(
  {
    name: 'agentChatFlow',
    inputSchema: AgentChatInputSchema,
    outputSchema: AgentChatOutputSchema,
  },
  async (input) => {
    const { persona, history, message } = input;

    const llmResponse = await ai.generate({
      prompt: [
        ...history,
        { role: 'user', content: [{ text: message }] }
      ],
      system: persona,
    });

    return { response: llmResponse.text };
  }
);
