export type DiaryEntry = {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: 'daily' | 'dream';
  createdAt: string;
  categories: string[];
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
