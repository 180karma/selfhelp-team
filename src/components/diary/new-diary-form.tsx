'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirestore, useUser, errorEmitter, FirestorePermissionError } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { categorizeDiaryEntry } from '@/ai/flows/categorize-diary-entry';
import { addDoc, collection } from 'firebase/firestore';


const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  content: z.string().min(1, { message: 'Content is required.' }),
  type: z.enum(['daily', 'dream'], { required_error: 'Please select a journal type.' }),
});

export function NewDiaryForm() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Not Authenticated',
        description: 'You must be logged in to create a diary entry.',
      });
      return;
    }

    try {
      const { categories } = await categorizeDiaryEntry({ diaryEntry: values.content });

      const entriesCollection = collection(firestore, 'users', user.uid, 'diaryEntries');
      const entryData = {
        ...values,
        categories,
        createdAt: new Date().toISOString(),
        userId: user.uid,
      };

      addDoc(entriesCollection, entryData)
        .catch(async (serverError) => {
          const permissionError = new FirestorePermissionError({
            path: entriesCollection.path,
            operation: 'create',
            requestResourceData: entryData,
          });
          errorEmitter.emit('permission-error', permissionError);
        });

      toast({
        title: 'Entry Saved!',
        description: 'Your diary entry has been successfully saved.',
      });
      form.reset();
      router.push('/dashboard/diary');
    } catch (error: any) {
      console.error('Error creating entry:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to save entry.',
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Craft Your Entry</CardTitle>
        <CardDescription>
          Choose a journal type and write about your day, your thoughts, your dreams...
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Journal Type</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a journal type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="daily">Daily Journal</SelectItem>
                      <SelectItem value="dream">Dream Journal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="My great day" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write about your day, your thoughts, your feelings..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? 'Saving...' : 'Save Entry'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
