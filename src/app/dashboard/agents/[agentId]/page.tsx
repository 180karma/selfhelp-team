'use client';

import { agentChat } from '@/ai/flows/agent-chat';
import { summarizeConversation } from '@/ai/flows/summarize-conversation';
import { agents } from '@/lib/agents';
import { useParams, notFound } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Questionnaire } from '@/components/agents/questionnaire';
import { DocumentData } from 'firebase/firestore';
import type { AiMentalHealthNote, Goal, GoalCategory, AiMentalHealthProfile } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';


type ProposedTask = {
    title: string;
    category: string;
    addedBy: string;
};

type ChatMessage = {
  role: 'user' | 'model';
  content: string;
  question?: {
    text: string;
    options: string[];
    addTask?: ProposedTask;
  }
};

type Inputs = {
  message: string;
};

// Convert chat history for Genkit
const toGenkitHistory = (history: ChatMessage[]) => {
  return history.map(msg => ({
    role: msg.role,
    // Genkit expects content to be an array of parts.
    // We are creating a simple text part.
    content: [{ text: msg.content }]
  }));
};


export default function AgentChatPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  const agent = agents.find((a) => a.id === agentId);
  const { toast } = useToast();

  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  const [assessment, setAssessment] = useState<DocumentData | null>(null);
  const [isLoadingAssessment, setIsLoadingAssessment] = useState(true);

  // Fetch initial assessment from localStorage
  useEffect(() => {
    const assessmentData = localStorage.getItem(`thrivewell-assessment-${agentId}`);
    if (assessmentData) {
      setAssessment(JSON.parse(assessmentData));
    }
    setIsLoadingAssessment(false);
  }, [agentId]);


  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [introSent, setIntroSent] = useState(false);
  const historyRef = useRef(history);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  const handleAgentResponse = async (message: string, currentHistory: ChatMessage[]) => {
    setIsLoading(true);
    try {
      let personaWithContext = agent!.persona;

      // 1. Add AI-generated profile from local storage
      const profileKey = `thrivewell-profile-${agentId}`;
      const savedProfileItem = localStorage.getItem(profileKey);
      let profile: AiMentalHealthProfile | null = null;
      if (savedProfileItem) {
        profile = JSON.parse(savedProfileItem);
        if (profile && profile.profileData) {
          personaWithContext += `\n\n## My Internal Profile Summary About the User:\n${profile.profileData}`;
        }
        if (profile && profile.roadmap) {
          personaWithContext += `\n\n## My Clinical Roadmap:\n${profile.roadmap}`;
        }
      }

      // 2. Load all notes and create briefings
      const notesKey = 'thrivewell-notes';
      const allNotes: AiMentalHealthNote[] = JSON.parse(localStorage.getItem(notesKey) || '[]');
      
      const myNotes = allNotes.filter(note => note.aiAgentId === agentId);
      const otherAgentsNotes = allNotes.filter(note => note.aiAgentId !== agentId);

      // Create "My Previous Notes" section
      if (myNotes.length > 0) {
        const myNotesText = myNotes
          .map(note => `On ${new Date(note.timestamp as string).toLocaleDateString()}, I noted:\n${note.noteData}`)
          .join('\n\n');
        personaWithContext += `\n\n## My Previous Notes (To pick up where I left off):\n${myNotesText}`;
      }
      
      // Create "Cross-Functional Briefing" from relevant other agents
      const relevantOtherNotes = otherAgentsNotes.filter(note => {
        const otherAgent = agents.find(a => a.id === note.aiAgentId);
        // Check for shared categories between current agent and the note's agent
        return otherAgent && otherAgent.categories.some(cat => agent!.categories.includes(cat));
      });

      if (relevantOtherNotes.length > 0) {
        const briefingText = relevantOtherNotes
          .map(note => {
            const otherAgent = agents.find(a => a.id === note.aiAgentId);
            return `On ${new Date(note.timestamp as string).toLocaleDateString()}, my colleague ${otherAgent?.givenName.split(' ')[0]} (${otherAgent?.role}) noted:\n${note.noteData}`;
          })
          .join('\n\n');
        personaWithContext += `\n\n## Cross-Functional Briefing (For context from the team):\n${briefingText}`;
      }

       // 3. Load goals to provide context on active and completed tasks
      if (user) {
        const goalsKey = `thrivewell-goals-${user.uid}`;
        const allGoals: Goal[] = JSON.parse(localStorage.getItem(goalsKey) || '[]');
        
        const activeGoals = allGoals.filter(g => !g.completed);
        const completedGoals = allGoals.filter(g => g.completed);

        if (activeGoals.length > 0) {
          const activeGoalsText = activeGoals.map(g => `- ${g.title} (Category: ${g.category})`).join('\n');
          personaWithContext += `\n\n## User's Active Goals (To avoid repetition):\n${activeGoalsText}`;
        }

        if (completedGoals.length > 0) {
          const completedGoalsText = completedGoals
            .map(g => `- ${g.title} (Completed on: ${new Date(g.completedAt!).toLocaleDateString()})`)
            .join('\n');
          personaWithContext += `\n\n## User's Recently Completed Goals (Acknowledge and congratulate!):\n${completedGoalsText}`;
        }
      }


      const genkitHistory = toGenkitHistory(currentHistory);
      const result = await agentChat({
        persona: personaWithContext,
        userName: user?.displayName?.split(' ')[0] || 'the user',
        history: genkitHistory,
        message: message,
      });

      setHistory((prev) => [...prev, { role: 'model', content: result.response, question: result.question }]);

    } catch (error: any) {
      console.error('Error chatting with agent:', error);
      const errorMessage = error.message || '';
      if (errorMessage.includes('429') || errorMessage.toLowerCase().includes('quota')) {
        setHistory((prev) => [...prev, { role: 'model', content: "It looks like we've hit our request limit for the day. To continue our conversation, you may need to upgrade your plan or wait until the quota resets. You can find more information on API usage and billing in your cloud provider's console." }]);
      } else {
        setHistory((prev) => [...prev, { role: 'model', content: "I'm having trouble responding right now. Please try again later." }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNote = async () => {
    const currentHistory = historyRef.current;
    const hasUserMessage = currentHistory.some(m => m.role === 'user');

    if (currentHistory.length === 0 || !hasUserMessage) {
      return;
    }
    
    try {
        const profileKey = `thrivewell-profile-${agentId}`;
        const savedProfileItem = localStorage.getItem(profileKey);
        const profile: AiMentalHealthProfile | null = savedProfileItem ? JSON.parse(savedProfileItem) : null;
        const currentRoadmap = profile?.roadmap || '';

      const genkitHistory = toGenkitHistory(currentHistory);
      const { noteData, updatedRoadmap } = await summarizeConversation({
        persona: agent!.persona,
        history: genkitHistory,
        roadmap: currentRoadmap,
      });
      
      const note: AiMentalHealthNote = {
        id: `note-${agentId}-${Date.now()}`,
        aiAgentId: agentId,
        noteData,
        timestamp: new Date().toISOString(),
        userId: user?.uid,
      };

      const notesKey = 'thrivewell-notes';
      const existingNotes = JSON.parse(localStorage.getItem(notesKey) || '[]');
      existingNotes.push(note);
      localStorage.setItem(notesKey, JSON.stringify(existingNotes));
      
      if (profile) {
        profile.roadmap = updatedRoadmap;
        localStorage.setItem(profileKey, JSON.stringify(profile));
      }

      console.log('Conversation note and updated roadmap saved automatically to local storage.');

    } catch (error: any) {
       console.error('Error auto-saving note:', error);
    }
  };

  const handleOptionClick = (option: string, originalQuestion: string, proposedTask?: ProposedTask) => {
    // Add the user's choice to the history immediately for a responsive feel
    const userMessage: ChatMessage = { role: 'user', content: `Regarding "${originalQuestion}", I chose: ${option}` };
    const newHistory = [...history, userMessage];
    setHistory(newHistory);

    // Check if the user agreed and a task was proposed
    const positiveAffirmations = ['yes', 'yep', 'ok', 'add it', 'please', 'do it', 'helpful', 'nice', 'sounds good', 'let\'s do it'];
    const userSaidYes = positiveAffirmations.some(affirmation => option.toLowerCase().includes(affirmation));

    if (userSaidYes && proposedTask && user) {
        const newGoal: Goal = {
          id: uuidv4(),
          userId: user.uid,
          title: proposedTask.title,
          category: proposedTask.category as GoalCategory,
          addedBy: proposedTask.addedBy,
          completed: false,
          createdAt: new Date().toISOString(),
        };
        const goalsKey = `thrivewell-goals-${user.uid}`;
        const existingGoals = JSON.parse(localStorage.getItem(goalsKey) || '[]');
        existingGoals.push(newGoal);
        localStorage.setItem(goalsKey, JSON.stringify(existingGoals));
        toast({
          title: "New Task Added!",
          description: `"${newGoal.title}" was added to your ${newGoal.category} list.`,
        });
    }
    
    // Let the agent respond to the selected option
    handleAgentResponse(userMessage.content, newHistory);
  };


  useEffect(() => {
    if (!isLoadingAssessment) {
      if (!assessment) {
        setShowQuestionnaire(true);
      } else if (history.length === 0 && !introSent) {
        setIntroSent(true);
        handleAgentResponse("Hello, please introduce yourself based on my profile and ask your first question based on your clinical roadmap.", []);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessment, isLoadingAssessment, introSent]);


  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [history]);
  
  useEffect(() => {
    return () => {
      handleSaveNote();
    };
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!agent) {
    notFound();
  }

  if (isLoadingAssessment) {
    return (
      <div className="flex justify-center items-center h-full">
        <Skeleton className="h-24 w-1/2" />
      </div>
    );
  }

  const handleQuestionnaireComplete = (data: DocumentData) => {
    setAssessment({ answers: data }); // Update local state with new assessment data
    setShowQuestionnaire(false);
    setIntroSent(true);
    handleAgentResponse("Hello, please introduce yourself based on my profile and ask your first question based on your new clinical roadmap.", []);
  };

  if (showQuestionnaire) {
    return <Questionnaire agentId={agentId} onComplete={handleQuestionnaireComplete} />;
  }


  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!data.message.trim()) return;
    const userMessage: ChatMessage = { role: 'user', content: data.message };
    const newHistory = [...history, userMessage];
    setHistory(newHistory);
    reset();
    handleAgentResponse(data.message, newHistory);
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between border-b">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={agent.avatarUrl} alt={agent.givenName} />
              <AvatarFallback>{agent.givenName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="font-headline text-2xl">{agent.givenName}</CardTitle>
              <CardDescription>{agent.roleDescription}</CardDescription>
              <p className="text-xs text-muted-foreground italic mt-1">AI agents are not a replacement for professional medical or mental health advice.</p>
            </div>
          </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 p-6">
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div className="space-y-6 pr-4">
            {history.map((message, index) => {
              const isLastMessage = index === history.length - 1;
              const isSecondToLast = index === history.length - 2;
              
              return (
                <div key={index} className={cn(
                  `flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`,
                  isLastMessage ? 'animate-fade-in' : 'animate-fade-out',
                  isSecondToLast && 'animate-quick-fade-in'
                )}>
                  {message.role === 'model' && (
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-[10px] font-semibold text-muted-foreground">{agent.givenName.split(' ')[0]}</p>
                      <Avatar>
                        <AvatarImage src={agent.avatarUrl} alt={agent.givenName} />
                        <AvatarFallback>{agent.givenName.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                  <div className={cn('rounded-lg p-3', 
                      message.role === 'user' 
                      ? 'bg-secondary text-secondary-foreground max-w-xs' 
                      : 'bg-muted max-w-prose'
                  )}>
                    <p className={cn(
                      "whitespace-pre-wrap",
                      message.role === 'user' ? 'text-[10px]' : 'text-sm'
                    )}>{message.content}</p>
                     {message.role === 'model' && message.question && (
                      <div className="mt-4 space-y-2">
                         <p className="font-semibold text-sm">{message.question.text}</p>
                         <div className="flex flex-col space-y-2">
                           {message.question.options.map((option, i) => (
                            <Button 
                              key={i} 
                              variant="outline" 
                              size="sm"
                              className="justify-start"
                              onClick={() => handleOptionClick(option, message.question!.text, message.question!.addTask)}
                              disabled={isLoading}
                            >
                              {option}
                            </Button>
                           ))}
                         </div>
                         <p className="text-xs text-muted-foreground italic mt-2">Or type your own response below.</p>
                      </div>
                    )}
                  </div>
                   {message.role === 'user' && (
                     <Avatar>
                       <AvatarImage src={user?.photoURL ?? "https://picsum.photos/seed/user-avatar/40/40"} />
                       <AvatarFallback>{user?.email?.charAt(0).toUpperCase() ?? 'U'}</AvatarFallback>
                    </Avatar>
                   )}
                </div>
              )
            })}
            {isLoading && (
              <div className="flex items-start gap-4 animate-fade-in">
                <div className="flex flex-col items-center gap-1">
                   <p className="text-[10px] font-semibold text-muted-foreground">{agent.givenName.split(' ')[0]}</p>
                  <Avatar>
                    <AvatarImage src={agent.avatarUrl} alt={agent.givenName} />
                    <AvatarFallback>{agent.givenName.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="max-w-prose rounded-lg p-3 bg-muted">
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2 border-t pt-4">
          <Input
            {...register('message', { required: true })}
            placeholder="Type your message..."
            autoComplete="off"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
