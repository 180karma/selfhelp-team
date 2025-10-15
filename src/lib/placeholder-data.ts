import type { DiaryEntry } from './types';

export const placeholderDiaryEntries: DiaryEntry[] = [
  {
    id: '1',
    title: 'A Walk in the Park',
    content:
      'Today, I went for a walk in the park. The sun was shining, and the birds were singing. I felt a sense of peace and gratitude for the simple moments. I saw a family of ducks and it made me smile. It was a good day to reflect on the beauty of nature.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Dream Journal: Flying',
    content:
      'I had a vivid dream last night that I could fly. I soared over mountains and cities, feeling free and weightless. The world looked so different from above. I woke up feeling inspired and full of possibility.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Feeling Overwhelmed',
    content:
      "Work has been really stressful lately. I'm feeling overwhelmed with my to-do list. I tried a 5-minute breathing exercise today, and it helped calm my nerves a little. I need to remember to take these small breaks.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
