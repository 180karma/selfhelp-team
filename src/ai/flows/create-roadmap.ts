
'use server';

/**
 * @fileOverview A flow to analyze a user's questionnaire and create a personalized clinical roadmap.
 *
 * - createRoadmap - A function that generates a structured roadmap for an agent.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CreateRoadmapInputSchema = z.object({
  persona: z.string().describe("The persona of the AI agent who will use this roadmap."),
  questionnaireAnswers: z.record(z.string()).describe("A JSON object of the user's answers, where keys are question IDs and values are the selected options."),
});
export type CreateRoadmapInput = z.infer<typeof CreateRoadmapInputSchema>;

const ModuleQuestionSchema = z.object({
    id: z.string().describe("A unique identifier for the question (e.g., 'anxiety_level_past_week')."),
    question: z.string().describe("The text of the multiple-choice question."),
    options: z.array(z.string()).describe("An array of 4-5 string options for the user to choose from."),
});

const ModuleSchema = z.object({
    title: z.string().describe("A concise, user-facing title for the module (e.g., 'Understanding & Managing Anxiety')."),
    completed: z.boolean().describe("The completion status of the module, which should always be `false` on creation."),
    steps: z.object({
        identify: z.string().describe("A concise description of the core issue or 'wound' to be explored."),
        trigger: z.string().describe("A prompt to help the user identify what situations, thoughts, or feelings trigger this issue."),
        origin: z.string().describe("A gentle, exploratory question to help the user reflect on the root of this behavior or feeling."),
        behavior_change: z.string().describe("A concrete therapeutic technique, practice, or reframing exercise to create change. This is the core 'resolution plan' for the module."),
        daily_task: z.string().describe("A very small, specific, and actionable daily task that reinforces the behavior_change."),
        short_term_goal: z.string().describe("A measurable, achievable goal for the next 1-2 weeks."),
        long_term_goal: z.string().describe("A broader, aspirational goal for the next 2-3 months."),
    }).describe("A comprehensive object containing the step-by-step resolution plan for the module."),
    questions: z.array(ModuleQuestionSchema).describe("An array of exactly two relevant multiple-choice questions for a mini-assessment at the start of the module session."),
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
Your task is to act as a treatment planner. You will analyze a user's questionnaire answers and create a personalized **Clinical Roadmap**.

**Instructions:**

1.  **Analyze the Answers:** Review the user's questionnaire answers below to identify the 3 to 5 most critical areas for intervention. These can be considered the core issues or 'wounds'.
2.  **Create Modules:** For each critical area, create a "Module" object. Order the modules from most to least urgent. Each module MUST have a 'completed' property, which should be set to 'false'.
3.  **Define Detailed Module Structure:** Each module MUST contain a comprehensive 'steps' object to guide the user through a resolution process. The steps must be detailed and actionable, covering the following:
    *   **identify:** A concise description of the core issue or 'wound' to be explored.
    *   **trigger:** A prompt to help the user identify what situations, thoughts, or feelings trigger this issue.
    *   **origin:** A gentle, exploratory question to help the user reflect on the root of this behavior or feeling.
    *   **behavior_change:** A concrete therapeutic technique, practice, or reframing exercise to create change. This is the core 'resolution plan' for the module.
    *   **daily_task:** A very small, specific, and actionable daily task that reinforces the behavior_change.
    *   **short_term_goal:** A measurable, achievable goal for the next 1-2 weeks.
    *   **long_term_goal:** A broader, aspirational goal for the next 2-3 months.
4.  **Create Module Questions:** For each module, you must also create two relevant multiple-choice questions in a \`questions\` array. These will be used for a mini-assessment at the start of each module session. The questions should be distinct and designed to get a baseline on the module's topic.
5.  **Return as an Array:** The final output should be an array of these detailed module objects.

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
