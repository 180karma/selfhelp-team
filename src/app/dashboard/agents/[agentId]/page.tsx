
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
  const [userName, setUserName] = useState<string>('');

  // Get user's name from multiple sources
  useEffect(() => {
    if (user) {
      // Priority: 1. Firebase displayName, 2. localStorage, 3. Prompt user
      if (user.displayName) {
        const firstName = user.displayName.split(' ')[0];
        setUserName(firstName);
        localStorage.setItem('thrivewell-user-name', firstName);
      } else {
        const storedName = localStorage.getItem('thrivewell-user-name');
        if (storedName) {
          setUserName(storedName);
        } else {
          // Prompt user for their name
          const name = prompt('Welcome! Please enter your first name so our agents can address you properly:');
          if (name && name.trim()) {
            const firstName = name.trim().split(' ')[0];
            setUserName(firstName);
            localStorage.setItem('thrivewell-user-name', firstName);
          } else {
            setUserName('friend');
          }
        }
      }
    }
  }, [user]);

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

      const profileKey = `thrivewell-profile-${agentId}`;
      const savedProfileItem = localStorage.getItem(profileKey);
      if (savedProfileItem) {
        const profile = JSON.parse(savedProfileItem);
        if (profile.profileData) {
          personaWithContext += `\n\n## My Internal Profile Summary About the User:\n${profile.profileData}`;
        }
        if (profile.roadmap) {
            personaWithContext += `\n\n## My Clinical Roadmap:\n${profile.roadmap}`;
        }
      }

      const genkitHistory = toGenkitHistory(currentHistory);
      const result = await agentChat({
        persona: personaWithContext,
        userName: userName || 'friend',
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

    if (currentHistory.length === 0 || !user) {
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
        userName: userName || 'friend',
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
    const userMessage: ChatMessage = { role: 'user', content: option };
    const newHistory = [...history, userMessage];
    setHistory(newHistory);

    // Check if the user agreed and a task was proposed
    const userSaidYes = option.toLowerCase().includes('yes');

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
        const allNotes = JSON.parse(localStorage.getItem('thrivewell-notes') || '[]');
        const myNotes = allNotes.filter((note: AiMentalHealthNote) => note.aiAgentId === agentId);
        if (myNotes.length === 0) {
          // This is the first session
          handleAgentResponse("Hello, please introduce yourself based on my profile and ask your first question based on your new clinical roadmap.", []);
        } else {
          // This is a returning session
          handleAgentResponse("Hello again, please review my file, including your previous notes and any relevant briefings from the team. Let's pick up where we left off based on your clinical roadmap.", []);
        }
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
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleSaveNote();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      handleSaveNote(); // Also save when component unmounts
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
     // After completing questionnaire, it's always the first session
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
                      message.role === 'user' ? 'text-sm' : 'text-sm'
                    )}>{message.content}</p>
                     {message.role === 'model' && message.question && isLastMessage && !isLoading && (
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
