'use server';

import { categorizeDiaryEntry } from '@/ai/flows/categorize-diary-entry';
import { addDoc, collection } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { z } from 'zod';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  content: z.string().min(1, 'Content is required.'),
  type: z.enum(['daily', 'dream']),
  userId: z.string(),
});

export async function createEntryAction(values: z.infer<typeof formSchema>) {
  const validatedFields = formSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid data.' };
  }
  
  const { title, content, type, userId } = validatedFields.data;

  try {
    const { categories } = await categorizeDiaryEntry({ diaryEntry: content });

    const { firestore } = initializeFirebase();
    const entriesCollection = collection(firestore, 'users', userId, 'diaryEntries');

    await addDoc(entriesCollection, {
      title,
      content,
      type,
      categories,
      createdAt: new Date().toISOString(),
      userId,
    });
    
    return { success: 'Entry saved!' };
  } catch (error: any) {
    console.error('Error creating entry:', error);
    return { error: error.message || 'Failed to save entry.' };
  }
}
