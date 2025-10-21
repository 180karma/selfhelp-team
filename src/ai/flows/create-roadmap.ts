
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
  roadmap: z.array(ModuleSchema).describe("An array of modules, structured as: 3-5 PRIMARY modules (main issues), each followed by 5 SUPPORTING modules (related sub-topics). Total of 18-30 modules."),
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
Your task is to act as a treatment planner. You will analyze a user's questionnaire answers and create a comprehensive **Clinical Roadmap** with PRIMARY and SUPPORTING modules.

**CRITICAL INSTRUCTIONS - ROADMAP STRUCTURE:**

1.  **Analyze the Answers:** Review the user's questionnaire answers below to identify the 3 to 5 most critical areas for intervention. These are the PRIMARY issues or 'core wounds'.

2.  **Create PRIMARY Modules:** For each critical area (3-5 total), create ONE comprehensive PRIMARY module that addresses the main issue.

3.  **Create SUPPORTING Modules:** After EACH primary module, create EXACTLY 5 SUPPORTING modules that expand on related topics. These 5 supporting modules MUST cover:
    
    **Supporting Module 1:** **Identifying Core Wounds**
    - Explore the childhood origins and early life experiences that created this pattern
    - Help client understand how past experiences shaped current responses
    - Focus on self-awareness and compassion for younger self
    
    **Supporting Module 2:** **Mapping Triggers**
    - Identify specific situations, people, environments that activate the issue
    - Create a detailed trigger map (trigger → thought → emotion → behavior → consequence)
    - Teach trigger recognition and early warning signs
    
    **Supporting Module 3:** **Understanding the Pattern**
    - Psychoeducation about the psychological mechanisms at play
    - Explain why this pattern developed and how it persists
    - Normalize the experience and provide context
    
    **Supporting Module 4:** **Resolution Planning & Coping Skills**
    - Specific coping strategies and interventions for this issue
    - Step-by-step action plan for when triggered
    - Build emotional regulation and distress tolerance skills
    
    **Supporting Module 5:** **Daily Tasks & Sustainable Change**
    - Create micro-habits and daily practices for lasting change
    - Set up accountability systems and progress tracking
    - Build momentum through consistent small wins

4.  **Module Structure:** EVERY module (primary and supporting) MUST contain ALL of these elements:
    *   **title:** Clear, user-facing title describing the module focus
    *   **completed:** Always set to \`false\` initially
    *   **steps.identify:** Describe the core issue/aspect being addressed
    *   **steps.trigger:** Help user identify what activates this issue
    *   **steps.origin:** Explore the roots and history of this pattern
    *   **steps.behavior_change:** Concrete therapeutic technique or practice
    *   **steps.daily_task:** ONE specific, actionable daily task (small & achievable)
    *   **steps.short_term_goal:** Measurable 1-2 week goal
    *   **steps.long_term_goal:** Aspirational 2-3 month goal
    *   **questions:** Array of exactly TWO relevant multiple-choice questions (4-5 options each)

5.  **Organization Pattern:**
    - PRIMARY Module 1 (Main Issue 1)
    - Supporting Module 1.1 (Core Wounds for Issue 1)
    - Supporting Module 1.2 (Triggers for Issue 1)
    - Supporting Module 1.3 (Understanding Pattern for Issue 1)
    - Supporting Module 1.4 (Resolution Planning for Issue 1)
    - Supporting Module 1.5 (Daily Tasks for Issue 1)
    - PRIMARY Module 2 (Main Issue 2)
    - Supporting Module 2.1 (Core Wounds for Issue 2)
    - [and so on...]

6.  **Total Module Count:**
    - 3 primary issues = 3 + (3×5) = 18 modules total
    - 4 primary issues = 4 + (4×5) = 24 modules total
    - 5 primary issues = 5 + (5×5) = 30 modules total

**DAILY TASKS REQUIREMENTS:**
- Each daily task MUST be specific, measurable, and take 5-15 minutes
- Tasks should build progressively from basic to advanced
- Focus on one small behavior change at a time
- Examples: "Practice 5 minutes of deep breathing at 9am" NOT "Reduce stress"

**GOALS REQUIREMENTS:**
- Short-term goals: Specific metric improvement (e.g., "Reduce anxiety in social situations from 8/10 to 5/10")
- Long-term goals: Life change outcomes (e.g., "Confidently attend social events and enjoy connecting with others")

**Questionnaire Answers:**
{{#each questionnaireAnswers}}
- Question: "{{@key}}", Answer: "{{this}}"
{{/each}}

Now, generate the comprehensive Clinical Roadmap with PRIMARY and SUPPORTING modules.
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
