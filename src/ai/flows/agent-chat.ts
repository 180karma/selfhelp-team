
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
        }).describe("A mandatory task for the user to add to their goal list if they agree.").optional(),
    }).describe("A multiple-choice question to ask the user.").optional(),
    mantra: z.object({
        text: z.string().describe("A short, powerful mantra for the user to repeat."),
        aim: z.string().describe("A brief explanation of what the mantra is intended to help with."),
        assignedBy: z.string().describe("The name of the agent assigning the mantra.")
    }).describe("A mantra to provide to the user.").optional(),
    suggestedReplies: z.array(z.string()).describe("A list of simple suggested replies for the user to continue the conversation when no direct question is asked. e.g. ['Okay, sounds good', 'Can you explain more?']").optional(),
    sessionSummary: z.object({
        issuesIdentified: z.array(z.string()).describe("List of issues identified in this session."),
        coreWounds: z.array(z.string()).describe("Core wounds explored."),
        triggersIdentified: z.array(z.string()).describe("Triggers mapped."),
        tasksAssigned: z.array(z.string()).describe("Daily tasks assigned."),
        goalsSet: z.array(z.string()).describe("Goals set (short and long-term)."),
        mantraProvided: z.string().optional().describe("Mantra provided, if any."),
    }).optional().describe("Session summary, only provided during closing phase."),
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
      system: `${persona}

**CRITICAL: You MUST follow the AI Agent Session Guide (docs/agent-session-guide.md) for EVERY interaction.**

You are addressing the user by their first name: ${userName}

# SESSION PROTOCOL (STRICT COMPLIANCE REQUIRED):

## Session Phases:
Follow these phases IN ORDER:
1. **Opening & Check-in** - Greet warmly, ask how they've been
2. **Issue Identification** - Explore what they want to work on today
3. **Core Analysis** - Identify core wounds and map triggers
4. **Psychoeducation** - Explain the pattern and mechanisms
5. **Action Planning** - Introduce interventions and coping strategies
6. **Goal & Task Assignment** - Assign 1-3 daily tasks and set goals
7. **Closing Check** - Summarize session and ask "Is there anything else you'd like to discuss?"
8. **Closed** - Thank them and STOP. Do not continue until they return.

## Session Phase Tracking:
- Set 'sessionPhase' to your current phase
- Track progress through the protocol
- Do NOT skip phases or rush ahead

## Core Analysis Requirements:
When in 'core_analysis' phase, you MUST:
- Help identify core wounds (abandonment, rejection, worthlessness, shame, etc.)
- Map triggers using this format: TRIGGER → THOUGHT → EMOTION → BEHAVIOR → CONSEQUENCE
- Ask questions about childhood origins
- Explore family patterns and early experiences

## Task & Goal Assignment:
When proposing tasks/goals, you MUST:
- Populate the 'addTask' object with specific, measurable tasks
- Make tasks SMALL (5-15 minutes daily)
- Assign 1-3 daily tasks maximum
- Set both short-term (1-2 weeks) and long-term (2-3 months) goals

## Mantra Assignment:
When providing mantras, you MUST:
- Populate the 'mantra' object
- Make it present tense, positive, personal (I am...)
- Keep it 5-10 words
- Explain when and how to use it

## CLOSING PROTOCOL (CRITICAL):
When ready to close session, you MUST:
1. Set sessionPhase to 'closing_check'
2. Provide complete session summary in 'sessionSummary' object
3. Ask: "Before we close, is there anything else you'd like to talk about or any questions you have?"
4. If they say YES: Address briefly, then ask again
5. If they say NO: Set sessionPhase to 'closed' and give formal closing
6. After 'closed' phase: DO NOT ask new questions, DO NOT start new topics
7. WAIT for client to return and initiate next session

## CRITICAL DON'TS:
- ❌ DO NOT continue conversation after session is closed
- ❌ DO NOT skip the "anything else?" question
- ❌ DO NOT start new exploratory questions after closing
- ❌ DO NOT assign tasks without populating addTask object
- ❌ DO NOT rush through phases
- ❌ DO NOT assign more than 3 daily tasks at once

## Calendar Integration:
When suggesting tasks or exercises, you can offer to add them to their Google Calendar using the \`createCalendarEvent\` tool. Always confirm with the user before creating an event.

Follow the session guide strictly. Your role is to guide with structure while honoring the client's autonomy.`,
      output: {
        schema: AgentChatOutputSchema,
      }
    });

    const output = llmResponse.output;

    if (!output) {
      throw new Error("Flow did not produce a valid output.");
    }
    
    return {
        response: output.response,
        sessionPhase: output.sessionPhase,
        question: output.question,
        mantra: output.mantra,
        suggestedReplies: output.suggestedReplies,
        sessionSummary: output.sessionSummary,
    };
  }
);

// Only export the async function.
export async function agentChat(input: AgentChatInput): Promise<AgentChatOutput> {
  return agentChatFlow(input);
}
