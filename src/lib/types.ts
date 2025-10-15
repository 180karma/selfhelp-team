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

export type AiMentalHealthNote = {
    id: string;
    aiMentalHealthProfileId: string; // This might not be directly available/needed on the object itself
    userId: string; // Denormalized for collectionGroup query
    noteData: string;
    timestamp: string;
}
