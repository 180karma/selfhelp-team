
'use server';

/**
 * @fileOverview A flow to analyze a user's questionnaire and create a personalized clinical roadmap.
 *
 * - createRoadmap - A function that generates a structured roadmap for an agent.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Module, ModuleQuestion } from '@/lib/roadmaps';

const CreateRoadmapInputSchema = z.object({
  persona: z.string().describe("The persona of the AI agent who will use this roadmap."),
  questionnaireAnswers: z.record(z.string()).describe("A JSON object of the user's answers, where keys are question IDs and values are the selected options."),
});
export type CreateRoadmapInput = z.infer<typeof CreateRoadmapInputSchema>;

const ModuleQuestionSchema = z.object({
    id: z.string(),
    question: z.string(),
    options: z.array(z.string()),
});

const ModuleSchema = z.object({
    title: z.string(),
    completed: z.boolean(),
    steps: z.object({
        identify: z.string(),
        trigger: z.string(),
        origin: z.string(),
        behavior_change: z.string(),
        daily_task: z.string(),
        short_term_goal: z.string(),
        long_term_goal: z.string(),
    }),
    questions: z.array(ModuleQuestionSchema),
});


const CreateRoadmapOutputSchema = z.object({
  roadmap: z.array(ModuleSchema).describe("An array of 3-5 Module objects, each representing a key issue to address, ordered by priority."),
});
export type CreateRoadmapOutput = z.infer<typeof CreateRoadmapOutputSchema>;


export async function createRoadmap(
  input: CreateRoadmapInput
): Promise<CreateRoadmapOutput> {
  return createRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createRoadmapPrompt',
  input: { schema: CreateRoadmapInputSchema },
  output: { schema: CreateRoadmapOutputSchema },
  prompt: `You are a senior clinician with the following persona: {{{persona}}}.
Your task is to act as a treatment planner. You will analyze a user's answers to your initial questionnaire and create a personalized **Clinical Roadmap**.

**Instructions:**

1.  **Analyze the Answers:** Review the user's questionnaire answers below to identify the 3 to 5 most critical areas for intervention.
2.  **Create Modules:** For each critical area, create a "Module" object.
3.  **Define Module Structure:** Each module MUST contain the following structured \`steps\` to guide the user:
    *   **identify:** A concise description of the core issue to be explored.
    *   **trigger:** A prompt to help the user identify what triggers this issue.
    *   **origin:** A gentle question to explore the root of this behavior or feeling.
    *   **behavior_change:** A concrete technique or practice to create change.
    *   **daily_task:** A very small, actionable daily task.
    *   **short_term_goal:** A measurable goal for the next 1-2 weeks.
    *   **long_term_goal:** A broader goal for the next 2-3 months.
4.  **Create Module Questions:** For each module, you must also create two relevant multiple-choice questions in a \`questions\` array. These will be used for a mini-assessment at the start of each module session. The questions should be distinct and designed to get a baseline on the module's topic.
5.  **Return as an Array:** The final output should be an array of these module objects, ordered from most to least urgent.

**Questionnaire Answers:**
{{#each questionnaireAnswers}}
- Question: "{{@key}}", Answer: "{{this}}"
{{/each}}

Now, generate the personalized Clinical Roadmap.
`,
});

const createRoadmapFlow = ai.defineFlow(
  {
    name: 'createRoadmapFlow',
    inputSchema: CreateRoadmapInputSchema,
    outputSchema: CreateRoadmapOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
