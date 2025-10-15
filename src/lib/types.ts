export type DiaryEntry = {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: 'daily' | 'dream';
  createdAt: string;
  categories: string[];
};
