
export type Symptom = {
  id: string;
  symptom: string;
  description: string;
};

export type NeuroCategory = {
  id: string;
  name: string;
  description: string;
  symptoms: Symptom[];
};

export const neuroGuideTable: NeuroCategory[] = [
  {
    id: 'anxiety',
    name: 'General Anxiety',
    description: 'Concerns related to excessive worry, fear, and physical symptoms of anxiety.',
    symptoms: [
      { id: 'anx-1', symptom: 'Excessive Worry', description: 'Uncontrollable worrying about a variety of topics.' },
      { id: 'anx-2', symptom: 'Restlessness', description: 'Feeling on edge, unable to relax.' },
      { id: 'anx-3', symptom: 'Racing Heart', description: 'Physical sensation of a rapid or pounding heartbeat.' },
      { id: 'anx-4', symptom: 'Avoidance Behavior', description: 'Actively staying away from situations that cause anxiety.' },
      { id: 'anx-5', symptom: 'Catastrophizing', description: 'Jumping to the worst-case scenario.' },
    ],
  },
  {
    id: 'depression',
    name: 'Depression',
    description: 'Concerns related to low mood, loss of interest, and changes in energy or sleep.',
    symptoms: [
      { id: 'dep-1', symptom: 'Persistent Low Mood', description: 'Feeling sad, empty, or down most of the day, nearly every day.' },
      { id: 'dep-2', symptom: 'Loss of Interest (Anhedonia)', description: 'Markedly diminished interest or pleasure in all, or almost all, activities.' },
      { id: 'dep-3', symptom: 'Fatigue/Loss of Energy', description: 'Feeling tired and having no energy.' },
      { id: 'dep-4', symptom: 'Feelings of Worthlessness', description: 'Negative self-evaluation or inappropriate guilt.' },
      { id: 'dep-5', symptom: 'Sleep Disturbance', description: 'Insomnia or hypersomnia (sleeping too much).' },
    ],
  },
  {
    id: 'trauma',
    name: 'Trauma & Attachment',
    description: 'Concerns related to past distressing events and their impact on current relationships and sense of safety.',
    symptoms: [
      { id: 'tra-1', symptom: 'Hypervigilance', description: 'Feeling constantly on guard or alert for danger.' },
      { id: 'tra-2', symptom: 'Emotional Numbness', description: 'Difficulty experiencing positive feelings.' },
      { id: 'tra-3', symptom: 'People-Pleasing (Fawn Response)', description: 'Prioritizing others\' needs over one\'s own to avoid conflict.' },
      { id: 'tra-4', symptom: 'Difficulty with Trust', description: 'Struggling to trust others in relationships.' },
      { id: 'tra-5', symptom: 'Inner Critic', description: 'A harsh, critical inner voice.' },
    ],
  },
  {
    id: 'adhd',
    name: 'ADHD Traits',
    description: 'Concerns related to inattention, hyperactivity, and impulsivity.',
    symptoms: [
      { id: 'adhd-1', symptom: 'Difficulty Sustaining Attention', description: 'Trouble staying focused on tasks or conversations.' },
      { id: 'adhd-2', symptom: 'Procrastination', description: 'Frequently putting off tasks, especially challenging ones.' },
      { id: 'adhd-3', symptom: 'Hyperactivity/Restlessness', description: 'Inability to sit still, constant fidgeting.' },
      { id: 'adhd-4', symptom: 'Impulsivity', description: 'Acting on sudden urges without much thought.' },
      { id: 'adhd-5', symptom: 'Time Blindness', description: 'Poor perception of time, often leading to lateness or underestimating task duration.' },
    ],
  },
  {
    id: 'ocd',
    name: 'OCD Traits',
    description: 'Concerns related to obsessions (intrusive thoughts) and compulsions (repetitive behaviors).',
    symptoms: [
        { id: 'ocd-1', symptom: 'Intrusive Thoughts', description: 'Unwanted, repetitive thoughts or images that cause distress.' },
        { id: 'ocd-2', symptom: 'Repetitive Behaviors (Compulsions)', description: 'Actions one feels driven to perform to reduce anxiety (e.g., checking, cleaning).' },
        { id: 'ocd-3', symptom: 'Perfectionism', description: 'An intense need for things to be "just right".' },
        { id: 'ocd-4', symptom: 'Reassurance Seeking', description: 'Constantly asking others to confirm that things are okay.' },
    ],
  },
  {
    id: 'bpd',
    name: 'BPD Traits',
    description: 'Concerns related to emotional instability, unstable relationships, and fear of abandonment.',
    symptoms: [
        { id: 'bpd-1', symptom: 'Fear of Abandonment', description: 'Intense fear of being left alone or abandoned.' },
        { id: 'bpd-2', symptom: 'Unstable Relationships', description: 'A pattern of intense and chaotic relationships.' },
        { id: 'bpd-3', symptom: 'Emotional Dysregulation', description: 'Rapid, intense mood swings.' },
        { id: 'bpd-4', symptom: 'Chronic Feelings of Emptiness', description: 'A persistent sense of being empty inside.' },
    ],
  },
  {
    id: 'bipolar',
    name: 'Bipolar Traits',
    description: 'Concerns related to extreme mood swings that include emotional highs (mania or hypomania) and lows (depression).',
    symptoms: [
        { id: 'bip-1', symptom: 'Elevated Mood/Energy (Mania)', description: 'Periods of unusually high energy, euphoria, or irritability.' },
        { id: 'bip-2', symptom: 'Depressive Episodes', description: 'Periods of low mood, loss of interest, and fatigue.' },
        { id: 'bip-3', symptom: 'Racing Thoughts', description: 'Mind feels like it\'s going too fast, with quickly jumping ideas.' },
        { id: 'bip-4', symptom: 'Impulsive/Risky Behavior', description: 'Engaging in high-risk activities without thinking of consequences.' },
    ],
  },
  {
    id: 'shame',
    name: 'Shame & Self-Worth',
    description: 'Concerns related to feelings of being flawed, unworthy, or "bad."',
    symptoms: [
        { id: 'sha-1', symptom: 'Feelings of Unworthiness', description: 'A core feeling of not being good enough.' },
        { id: 'sha-2', symptom: 'Fear of Exposure', description: 'A fear that others will "see" the real, flawed you.' },
        { id: 'sha-3', symptom: 'Sensitivity to Criticism', description: 'Feeling deeply hurt or crushed by criticism.' },
        { id: 'sha-4', symptom: 'Hiding or Withdrawing', description: 'A desire to become small or invisible when feeling shame.' },
    ],
  },
];
