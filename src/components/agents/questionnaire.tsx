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
import { useFirestore, useUser, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, setDoc, DocumentData } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { analyzeUserProfile } from '@/ai/flows/analyze-user-profile';
import { agents } from '@/lib/agents';


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
    } else {
      // If it's the last question, we also need to trigger the final submit logic
      const latestAnswers = { ...data };
      sessionStorage.setItem(`q_${agentId}_${currentQuestion.id}`, latestAnswers[currentQuestion.id]);
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!user || !firestore) {
       toast({
        variant: 'destructive',
        title: 'Not Authenticated',
        description: 'You must be logged in to submit.',
      });
      return;
    }

    const answers: { [key: string]: string } = {};
    questionnaire.questions.forEach(q => {
      const answer = sessionStorage.getItem(`q_${agentId}_${q.id}`);
      if(answer) {
        answers[q.id] = answer;
      }
    });
    
    const assessmentRef = doc(firestore, 'users', user.uid, 'psychologicalAssessments', agentId);
    
    setDoc(assessmentRef, { answers })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: assessmentRef.path,
          operation: 'write',
          requestResourceData: { answers },
        });
        errorEmitter.emit('permission-error', permissionError);
      });
      
    // Generate AI profile
    try {
        const agent = agents.find(a => a.id === agentId);
        if (agent) {
            const { profileData } = await analyzeUserProfile({
                persona: agent.persona,
                questionnaireAnswers: answers,
            });

            const profileRef = doc(firestore, 'users', user.uid, 'aiMentalHealthProfiles', agentId);
            setDoc(profileRef, {
                userId: user.uid,
                aiAgentId: agentId,
                profileData: profileData,
            }).catch(async (serverError) => {
                 const permissionError = new FirestorePermissionError({
                    path: profileRef.path,
                    operation: 'write',
                    requestResourceData: { userId: user.uid, aiAgentId: agentId, profileData },
                });
                errorEmitter.emit('permission-error', permissionError);
            })
        }
    } catch (error) {
        console.error("Failed to generate AI profile:", error);
         toast({
            variant: 'destructive',
            title: 'AI Analysis Failed',
            description: 'Could not generate the AI profile summary.',
        });
    }


    questionnaire.questions.forEach(q => {
      sessionStorage.removeItem(`q_${agentId}_${q.id}`);
    });

    toast({
      title: 'Profile Updated!',
      description: "Your answers have been saved and analyzed.",
    });

    onComplete(answers);
  };


  return (
    <Card className="w-full max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleNext)}>
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
