'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFormState, useFormStatus } from 'react-dom';

import { generateEntryAction } from '@/app/actions/diary';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  content: z.string().min(1, { message: 'Content is required.' }),
});

const initialState = {
  message: '',
  diaryEntry: '',
};

function GenerationButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Generate with AI
    </Button>
  );
}

export function NewDiaryForm() {
  const { toast } = useToast();

  const [state, formAction] = useFormState(generateEntryAction, initialState);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  useEffect(() => {
    if (state.message === 'success' && state.diaryEntry) {
      form.setValue('content', state.diaryEntry);
    } else if (state.message && state.message !== 'success') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, form, toast]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Implement logic to save the diary entry to the database
    console.log(values);
    toast({
      title: 'Entry Saved!',
      description: 'Your diary entry has been successfully saved.',
    });
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Craft Your Entry</CardTitle>
        <CardDescription>
          Write freely, or use our AI to get started with a prompt.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="mb-6 space-y-4 rounded-lg border p-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">AI Prompt</Label>
            <div className="flex gap-2">
              <Input
                id="prompt"
                name="prompt"
                placeholder="e.g., A moment of unexpected joy today..."
              />
              <GenerationButton />
            </div>
            {state.message && state.message !== 'success' && (
              <p className="text-sm font-medium text-destructive">{state.message}</p>
            )}
          </div>
        </form>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <Button type="submit">Save Entry</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
