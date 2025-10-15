'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { questionnaires } from '@/lib/questionnaires';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';
import { useFirestore, useUser } from '@/firebase';
import { doc, setDoc, DocumentData } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';


interface QuestionnaireProps {
  agentId: string;
  onComplete: (data: DocumentData) => void;
}

export function Questionnaire({ agentId, onComplete }: QuestionnaireProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const questionnaire = questionnaires.find((q) => q.agentId === agentId);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const currentQuestion = questionnaire?.questions[currentQuestionIndex];

  // Dynamically create a Zod schema
  const formSchema = z.object({
    [currentQuestion?.id ?? '']: z.string({
      required_error: 'Please select an option.',
    }),
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { isSubmitting } = form.formState;

  if (!questionnaire || !currentQuestion) {
    return <p>Questionnaire not found for this agent.</p>;
  }

  const handleNext = (data: z.infer<typeof formSchema>) => {
    form.clearErrors(); 
    // Persist answer temporarily
    sessionStorage.setItem(`q_${agentId}_${currentQuestion.id}`, data[currentQuestion.id]);
    
    if (currentQuestionIndex < questionnaire.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      form.reset();
    }
  };

  const handleSubmit = async () => {
    if (!user) {
       toast({
        variant: 'destructive',
        title: 'Not Authenticated',
        description: 'You must be logged in to submit.',
      });
      return;
    }

    try {
      const answers: { [key: string]: string } = {};
      questionnaire.questions.forEach(q => {
        const answer = sessionStorage.getItem(`q_${agentId}_${q.id}`);
        if(answer) {
          answers[q.id] = answer;
        }
      });
      
      const assessmentRef = doc(firestore, 'users', user.uid, 'psychologicalAssessments', agentId);
      await setDoc(assessmentRef, answers);

      questionnaire.questions.forEach(q => {
        sessionStorage.removeItem(`q_${agentId}_${q.id}`);
      });

      toast({
        title: 'Profile Updated!',
        description: "Your answers have been saved.",
      });

      onComplete(answers);

    } catch (error: any) {
      console.error("Error saving assessment:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save your answers.',
      });
    }
  };


  return (
    <Card className="w-full max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={currentQuestionIndex < questionnaire.questions.length - 1 ? form.handleSubmit(handleNext) : form.handleSubmit(handleSubmit)}>
          <CardHeader>
            <CardTitle className="font-headline">{questionnaire.title}</CardTitle>
            <CardDescription>{questionnaire.description}</CardDescription>
            <div className="w-full bg-muted rounded-full h-2.5 mt-2">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questionnaire.questions.length) * 100}%` }}></div>
            </div>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name={currentQuestion.id}
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-lg">{currentQuestion.question}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2"
                    >
                      {currentQuestion.options.map((option) => (
                        <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={option} />
                          </FormControl>
                          <FormLabel className="font-normal">{option}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {currentQuestionIndex < questionnaire.questions.length - 1 ? 'Next' : 'Finish'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
