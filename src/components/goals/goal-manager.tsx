'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@/firebase';
import type { Goal, GoalCategory } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Loader2, Bot } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const goalSchema = z.object({
  title: z.string().min(3, { message: 'Goal must be at least 3 characters long.' }),
  category: z.enum(['Daily Task', 'Short-Term Goal', 'Long-Term Goal'], {
    required_error: 'You need to select a goal category.',
  }),
});

type GoalInput = z.infer<typeof goalSchema>;

export function GoalManager() {
  const { user } = useUser();
  const [goals, setGoals] = useState<Goal[]>([]);
  const { toast } = useToast();

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

  const toggleGoal = (id: string) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    );
    setGoals(updatedGoals);
    if (user) {
      localStorage.setItem(`thrivewell-goals-${user.uid}`, JSON.stringify(updatedGoals));
    }
  };

  const renderGoalList = (category: GoalCategory) => {
    const filteredGoals = goals.filter((goal) => goal.category === category);
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{category}</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredGoals.length > 0 ? (
            <div className="space-y-4">
              {filteredGoals.map((goal) => (
                <div key={goal.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={goal.id}
                    checked={goal.completed}
                    onCheckedChange={() => toggleGoal(goal.id)}
                    aria-label={`Mark goal "${goal.title}" as ${goal.completed ? 'incomplete' : 'complete'}`}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={goal.id}
                      className={`text-sm font-medium leading-none ${
                        goal.completed ? 'line-through text-muted-foreground' : ''
                      } peer-disabled:cursor-not-allowed peer-disabled:opacity-70`}
                    >
                      {goal.title}
                    </label>
                    {goal.addedBy && (
                       <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Bot className="h-3 w-3 mr-1" />
                        <span>Added by {goal.addedBy}</span>
                       </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No {category.toLowerCase()} yet.</p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
       <Card>
        <CardHeader>
          <CardTitle className="font-headline">Add a New Goal</CardTitle>
          <CardDescription>What do you want to accomplish? Your AI team can add to this list too.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(addGoal)} className="flex flex-col sm:flex-row items-start gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex-grow w-full">
                    <FormLabel className="sr-only">Goal Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Drink 8 glasses of water" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full sm:w-[180px]">
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
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                Add Goal
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderGoalList('Daily Task')}
        {renderGoalList('Short-Term Goal')}
        {renderGoalList('Long-Term Goal')}
      </div>
    </div>
  );
}
