
'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
import { useUser } from '@/firebase';
import type { Goal, GoalCategory, DiaryEntry } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Loader2, Bot, ArrowUpDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '../ui/badge';
import { categorizeDiaryEntry } from '@/ai/flows/categorize-diary-entry';
import { cn } from '@/lib/utils';
import { agents } from '@/lib/agents';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const goalSchema = z.object({
  title: z.string().min(3, { message: 'Goal must be at least 3 characters long.' }),
  category: z.enum(['Daily Task', 'Short-Term Goal', 'Long-Term Goal'], {
    required_error: 'You need to select a goal category.',
  }),
});

type GoalInput = z.infer<typeof goalSchema>;

const noteSchema = z.object({
  note: z.string().min(1, { message: 'Please enter a note describing what you did.' }),
  additionalNotes: z.string().optional(),
});

type NoteInput = z.infer<typeof noteSchema>;

export function GoalManager() {
  const { user } = useUser();
  const [goals, setGoals] = useState<Goal[]>([]);
  const { toast } = useToast();
  const [goalToComplete, setGoalToComplete] = useState<Goal | null>(null);

  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed).sort((a,b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());

  const getAgentInfo = (agentName: string) => {
    return agents.find(a => a.givenName === agentName);
  };


  useEffect(() => {
    if (user) {
      const storedGoals = JSON.parse(localStorage.getItem(`thrivewell-goals-${user.uid}`) || '[]');
      setGoals(storedGoals);
    }
  }, [user]);

  const form = useForm<GoalInput>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: '',
      category: 'Daily Task',
    },
  });

  const noteForm = useForm<NoteInput>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      note: '',
      additionalNotes: '',
    },
  });

  const { isSubmitting } = form.formState;

  const addGoal: SubmitHandler<GoalInput> = (data) => {
    if (!user) return;
    const newGoal: Goal = {
      id: uuidv4(),
      userId: user.uid,
      title: data.title,
      completed: false,
      category: data.category as GoalCategory,
      createdAt: new Date().toISOString(),
    };
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    localStorage.setItem(`thrivewell-goals-${user.uid}`, JSON.stringify(updatedGoals));
    toast({ title: 'Goal added!', description: `"${data.title}" has been added.` });
    form.reset();
  };

  const handleCompleteGoal = async (noteData: NoteInput) => {
    if (!goalToComplete || !user) return;

    // 1. Update Goal
    const updatedGoals = goals.map((goal) =>
      goal.id === goalToComplete.id
        ? {
            ...goal,
            completed: true,
            completionNote: noteData.note,
            completedAt: new Date().toISOString(),
          }
        : goal
    );
    setGoals(updatedGoals);
    localStorage.setItem(`thrivewell-goals-${user.uid}`, JSON.stringify(updatedGoals));
    
    // 2. Create Diary Entry
    const diaryContent = `I completed my goal: **${goalToComplete.title}** (from my ${goalToComplete.category} list).\n\n**What I did:**\n${noteData.note}\n\n${noteData.additionalNotes ? `**Additional thoughts:**\n${noteData.additionalNotes}` : ''}`;
    
    try {
        const { categories } = await categorizeDiaryEntry({ diaryEntry: diaryContent });

        const diaryEntry: DiaryEntry = {
            id: uuidv4(),
            userId: user.uid,
            title: `Completed Goal: ${goalToComplete.title}`,
            content: diaryContent,
            type: 'daily',
            createdAt: new Date().toISOString(),
            categories: [...categories, 'Accomplishment', 'Goals'],
        };
        
        const existingDiaryEntries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
        existingDiaryEntries.push(diaryEntry);
        localStorage.setItem('diaryEntries', JSON.stringify(existingDiaryEntries));
    } catch(e) {
        console.error("Failed to categorize diary entry from goal completion.", e)
    }

    // 3. Show Toast
    const userName = user.displayName?.split(' ')[0] || localStorage.getItem('thrivewell-user-name') || 'friend';
    if (goalToComplete.addedBy) {
        toast({ 
            title: `A message from ${goalToComplete.addedBy.split(' ')[0]} 🎉`, 
            description: `Great job on completing your goal, ${userName}!` 
        });
    } else {
        toast({ 
            title: 'Goal Completed!', 
            description: `You did it! Great job on completing "${goalToComplete.title}". A diary entry was created.`
        });
    }

    setGoalToComplete(null);
    noteForm.reset();
  };

  const handleOpenDialog = (goal: Goal) => {
    setGoalToComplete(goal);
  };
  
  const handleCloseDialog = () => {
    setGoalToComplete(null);
    noteForm.reset();
  };


  const renderGoalList = (category: GoalCategory) => {
    const filteredGoals = activeGoals.filter((goal) => goal.category === category);
    return (
      <Card className="transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle className="font-headline">{category}</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredGoals.length > 0 ? (
            <div className="space-y-4">
              {filteredGoals.map((goal) => {
                const isJournalGoal = goal.title.toLowerCase().includes('journal');
                const agent = goal.addedBy ? getAgentInfo(goal.addedBy) : null;
                
                return (
                    <div key={goal.id} className="flex items-start space-x-3 transition-all hover:translate-x-1">
                    <Checkbox
                        id={goal.id}
                        checked={false} // Checkbox only triggers dialog
                        onCheckedChange={() => handleOpenDialog(goal)}
                        aria-label={`Complete goal "${goal.title}"`}
                        className="mt-1"
                    />
                    <div className="flex-1">
                        <label
                        htmlFor={goal.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                        {isJournalGoal ? (
                            <Link href={`/dashboard/diary/new?title=${encodeURIComponent(goal.title)}&type=daily`} className="underline underline-offset-4 cursor-pointer hover:text-primary transition-colors">
                                {goal.title}
                            </Link>
                        ) : (
                            goal.title
                        )}
                        </label>
                        {agent && (
                          <div className={`flex items-center text-xs text-muted-foreground mt-1 border-l-2 pl-2 border-${agent.color}-200`}>
                            <Avatar className="h-5 w-5 mr-1.5">
                              <AvatarImage src={agent.avatarUrl} alt={agent.givenName} className="object-cover object-center" />
                              <AvatarFallback>{agent.givenName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>Added by {agent.givenName.split(' ')[0]}</span>
                          </div>
                        )}
                    </div>
                    </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No active {category.toLowerCase()} yet.</p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <Dialog open={!!goalToComplete} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="animate-scale-in">
          <DialogHeader>
            <DialogTitle>Complete: {goalToComplete?.title}</DialogTitle>
            <DialogDescription>
              Great job! Describe what you did to complete this goal. This will be saved as a diary entry.
            </DialogDescription>
          </DialogHeader>
          <Form {...noteForm}>
            <form onSubmit={noteForm.handleSubmit(handleCompleteGoal)} className="space-y-4">
               <FormField
                  control={noteForm.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What I did</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., I went for a 30-minute walk during my lunch break and felt more energetic afterward." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={noteForm.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Thoughts (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any other reflections or feelings about this accomplishment?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={noteForm.formState.isSubmitting}>
                  {noteForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Complete & Log Diary Entry
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>


       <Card>
        <CardHeader>
          <CardTitle className="font-headline">Add a New Goal</CardTitle>
          <CardDescription>What do you want to accomplish? Your AI team can add to this list too.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(addGoal)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Goal Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Drink 8 glasses of water" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="sr-only">Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Daily Task">Daily Task</SelectItem>
                          <SelectItem value="Short-Term Goal">Short-Term Goal</SelectItem>
                          <SelectItem value="Long-Term Goal">Long-Term Goal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto sm:min-w-[120px]">
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                  Add Goal
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderGoalList('Daily Task')}
        {renderGoalList('Short-Term Goal')}
        {renderGoalList('Long-Term Goal')}
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="font-headline">Completed Goals</CardTitle>
          <CardDescription>A log of your achievements. Keep up the great work!</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Completed On</TableHead>
                <TableHead>My Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedGoals.length > 0 ? (
                completedGoals.map((goal) => {
                  const agent = goal.addedBy ? getAgentInfo(goal.addedBy) : null;
                  return (
                    <TableRow key={goal.id}>
                      <TableCell className="font-medium">{goal.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{goal.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {agent ? (
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={agent.avatarUrl} alt={agent.givenName} className="object-cover object-center" />
                              <AvatarFallback>{agent.givenName.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ) : 'Me'}
                          <span>{agent ? agent.givenName.split(' ')[0] : ''}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(goal.completedAt!).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{goal.completionNote}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No completed goals yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

    
