
'use server';

/**
 * @fileOverview A flow to handle chat interactions with AI agents.
 *
 * - agentChat - A function that generates a response from an AI agent.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { createCalendarEventTool } from './google-calendar-tool';

// Define schemas inside the file, but do not export them.
const AgentChatInputSchema = z.object({
  persona: z.string().describe('The persona or role the AI agent should adopt.'),
  userName: z.string().describe("The user's name."),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({ text: z.string() })),
  })).describe('The conversation history.'),
  message: z.string().describe('The latest user message.'),
  sessionPhase: z.enum([
    'opening',
    'issue_identification',
    'core_analysis',
    'psychoeducation',
    'action_planning',
    'goal_assignment',
    'closing_check',
    'closed'
  ]).describe("The current phase of the session, to provide short-term memory for the agent."),
});
type AgentChatInput = z.infer<typeof AgentChatInputSchema>;

const AgentChatOutputSchema = z.object({
    response: z.string().describe("The AI agent's text response, which may or may not include a question."),
    sessionPhase: z.enum([
        'opening',
        'issue_identification',
        'core_analysis',
        'psychoeducation',
        'action_planning',
        'goal_assignment',
        'closing_check',
        'closed'
    ]).describe("The current phase of the session protocol."),
    question: z.object({
        text: z.string().describe("A follow-up question to the user."),
        options: z.array(z.string()).describe("A list of simple answers for the user to choose from."),
        addTask: z.object({
            title: z.string().describe("The title of the task to add to the user's goal list."),
            category: z.enum(['Daily Task', 'Short-Term Goal', 'Long-Term Goal']).describe("The category of the task (Daily, Short-Term, or Long-Term)."),
            addedBy: z.string().describe("The name of the agent adding the task.")
        }).optional().describe("A task for the user to add to their goal list if they agree."),
    }).optional().describe("A multiple-choice question to ask the user."),
    mantra: z.object({
        text: z.string().describe("A short, powerful mantra for the user to repeat."),
        aim: z.string().describe("A brief explanation of what the mantra is intended to help with."),
        assignedBy: z.string().describe("The name of the agent assigning the mantra.")
    }).optional().describe("A mantra to provide to the user."),
    suggestedReplies: z.array(z.string()).optional().describe("A list of simple suggested replies for the user to continue the conversation when no direct question is asked. e.g. ['Okay, sounds good', 'Can you explain more?']"),
    sessionSummary: z.object({
        issuesIdentified: z.array(z.string()).describe("List of issues identified in this session."),
        coreWounds: z.array(z.string()).describe("Core wounds explored."),
        triggersIdentified: z.array(z.string()).describe("Triggers mapped."),
        tasksAssigned: z.array(z.string()).describe("Daily tasks assigned."),
        goalsSet: z-array(z.string()).describe("Goals set (short and long-term)."),
        mantraProvided: z.string().optional().describe("Mantra provided, if any."),
    }).optional().describe("Session summary. You MUST provide this during the 'closing_check' phase."),
});
type AgentChatOutput = z.infer<typeof AgentChatOutputSchema>;

const agentChatFlow = ai.defineFlow(
  {
    name: 'agentChatFlow',
    inputSchema: AgentChatInputSchema,
    outputSchema: AgentChatOutputSchema,
  },
  async (input) => {
    const { persona, userName, history, message } = input;

    const llmResponse = await ai.generate({
      prompt: message,
      history: history,
      tools: [createCalendarEventTool],
      system: `You are an AI Agent. You MUST strictly follow the 'AI Agent Session Guide' (located in docs/agent-session-guide.md). Your primary role is to guide the user through the structured session phases.

-   **User's Name:** ${userName}
-   **Your Persona:** ${persona}
-   **Current Session Phase:** ${input.sessionPhase}

**CRITICAL INSTRUCTIONS:**
1.  **ADHERE TO THE SESSION GUIDE:** Based on the current \`sessionPhase\`, you must decide what to do next according to the guide. Determine the next appropriate phase and set it in your response.
2.  **CORE ANALYSIS:** When in 'core_analysis' phase, you MUST help identify core wounds and map triggers (TRIGGER → THOUGHT → EMOTION → BEHAVIOR → CONSEQUENCE).
3.  **TASK ASSIGNMENT:** When assigning tasks in the 'goal_assignment' phase, you MUST populate the 'addTask' object. Tasks must be small and specific (5-15 mins).
4.  **MANTRA ASSIGNMENT:** When providing mantras, you MUST populate the 'mantra' object.
5.  **CLOSING PROTOCOL:** This is non-negotiable.
    -   When you determine the session is ending, set \`sessionPhase\` to 'closing_check'.
    -   You MUST provide a full summary in the \`sessionSummary\` object during this phase.
    -   Ask the user: "Before we close, is there anything else you'd like to discuss?"
    -   If they say no, set \`sessionPhase\` to 'closed', deliver your closing statement, and STOP. Do not ask more questions.
6.  **CALENDAR TOOL:** You can use the \`createCalendarEvent\` tool to schedule tasks for the user, but always ask for permission first.`,
      output: {
        schema: AgentChatOutputSchema,
      }
    });

    const output = llmResponse.output;

    if (!output) {
      throw new Error("Flow did not produce a valid output. The AI model's response was empty.");
    }
    
    return output;
  }
);

// Only export the async function.
export async function agentChat(input: AgentChatInput): Promise<AgentChatOutput> {
  return agentChatFlow(input);
}
