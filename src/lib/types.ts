import { Timestamp } from 'firebase/firestore';

export type DiaryEntry = {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: 'daily' | 'dream';
  createdAt: string;
  categories: string[];
};

export type GoalCategory = 'Daily Task' | 'Short-Term Goal' | 'Long-Term Goal';

export type Goal = {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
  category: GoalCategory;
  createdAt: string;
  addedBy?: string; // agent's givenName
  completedAt?: string;
  completionNote?: string;
};

export type AiAgentInteraction = {
  id: string;
  userId: string;
  aiAgentId: string;
  timestamp: string;
  userMessage: string;
  aiResponse: string;
};

export type AiMentalHealthProfile = {
    id: string;
    userId: string;
    aiAgentId: string;
    profileData: string;
}

export type AiMentalHealthNote = {
    id:string;
    userId?: string; // Denormalized for collectionGroup query, now optional
    aiAgentId: string;
    noteData: string;
    timestamp: Timestamp | string;
}
