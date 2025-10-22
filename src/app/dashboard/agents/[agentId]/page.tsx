
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
import type { AiMentalHealthNote, Goal, GoalCategory, AiMentalHealthProfile, Mantra, DiaryEntry } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { roadmaps } from '@/lib/roadmaps';
import type { Module } from '@/lib/roadmaps';
import { Loader2 } from 'lucide-react';


type ProposedTask = {
    title: string;
    category: string;
    addedBy: string;
};

type ProposedMantra = {
    text: string;
    aim: string;
    assignedBy: string;
};

type ChatMessage = {
  role: 'user' | 'model';
  content: string;
  question?: {
    text: string;
    options: string[];
    addTask?: ProposedTask;
  };
  mantra?: ProposedMantra;
  suggestedReplies?: string[];
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

  const [currentRoadmap, setCurrentRoadmap] = useState<Module[] | null>(null);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [moduleQuestionIndex, setModuleQuestionIndex] = useState(0);
  const [moduleAnswers, setModuleAnswers] = useState<Record<string, string>>({});
  const [isAnsweringModuleQuestions, setIsAnsweringModuleQuestions] = useState(false);

  // Get user's name from multiple sources
  useEffect(() => {
    if (user) {
      if (user.displayName) {
        const firstName = user.displayName.split(' ')[0];
        setUserName(firstName);
        localStorage.setItem('thrivewell-user-name', firstName);
      } else {
        const storedName = localStorage.getItem('thrivewell-user-name');
        if (storedName) {
          setUserName(storedName);
        } else {
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

  // Fetch initial assessment & roadmap from localStorage
  useEffect(() => {
    const assessmentData = localStorage.getItem(`thrivewell-assessment-${agentId}`);
    if (assessmentData) {
      setAssessment(JSON.parse(assessmentData));
    }
    
    const roadmapData = localStorage.getItem(`thrivewell-roadmap-${agentId}`);
    if (roadmapData) {
        try {
            setCurrentRoadmap(JSON.parse(roadmapData));
        } catch (error) {
            console.error("Failed to parse roadmap from local storage:", error);
            // Fallback to default if parsing fails
            setCurrentRoadmap(roadmaps[agentId] || null);
        }
    } else {
        setCurrentRoadmap(roadmaps[agentId] || null);
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
  
      // Add agent's own clinical profile about the user
      const profileKey = `thrivewell-profile-${agentId}`;
      const savedProfileItem = localStorage.getItem(profileKey);
      if (savedProfileItem) {
        const profile = JSON.parse(savedProfileItem);
        if (profile.profileData) {
          personaWithContext += `\n\n## My Internal Profile Summary About the User:\n${profile.profileData}`;
        }
      }
  
      // Add the clinical roadmap
      if (currentRoadmap) {
        const nextModule = currentRoadmap.find(m => !m.completed) || currentRoadmap[0];
        personaWithContext += `\n\n## My Clinical Roadmap:\n${JSON.stringify(nextModule, null, 2)}`;
      }
  
      // Add Neuro-Insight Profile from the latest diary entry
      if (user) {
        const allEntries: DiaryEntry[] = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
        const userEntries = allEntries
          .filter(e => e.userId === user.uid)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
        if (userEntries.length > 0 && userEntries[0].neuroInsightProfile) {
          personaWithContext += `\n\n## Neuro-Insight Profile (from latest diary entry):\n${JSON.stringify(userEntries[0].neuroInsightProfile, null, 2)}`;
        }
      }
  
      const genkitHistory = toGenkitHistory(currentHistory);
      const result = await agentChat({
        persona: personaWithContext,
        userName: userName || 'friend',
        history: genkitHistory,
        message: message,
      });
        
      if (!result) {
        throw new Error("Flow did not produce a valid output.");
      }

      setHistory((prev) => [...prev, { role: 'model', content: result.response, question: result.question, mantra: result.mantra, suggestedReplies: result.suggestedReplies }]);

      if (result.mantra && user) {
        const newMantra: Mantra = {
          id: uuidv4(),
          userId: user.uid,
          mantra: result.mantra.text,
          aim: result.mantra.aim,
          assignedBy: result.mantra.assignedBy,
          createdAt: new Date().toISOString(),
        };
        const mantrasKey = 'thrivewell-mantras';
        const existingMantras = JSON.parse(localStorage.getItem(mantrasKey) || '[]');
        existingMantras.push(newMantra);
        localStorage.setItem(mantrasKey, JSON.stringify(existingMantras));
        toast({
          title: "New Mantra Added!",
          description: `Check your Mantras page to see it.`,
        });
      }


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
    if (currentHistory.length < 2 || !user || !currentModule) {
        return;
    }

    const lastMessage = currentHistory[currentHistory.length - 1];
    const secondLastMessage = currentHistory[currentHistory.length - 2];

    const agentProposedTask = secondLastMessage.role === 'model' && secondLastMessage.question?.addTask;
    const userConfirmed = lastMessage.role === 'user' && (
        lastMessage.content.toLowerCase().includes('yes') ||
        lastMessage.content.toLowerCase().includes('add it') ||
        lastMessage.content.toLowerCase().includes('let\'s do it') ||
        lastMessage.content.toLowerCase().includes('i am willing')
    );

    if (!agentProposedTask || !userConfirmed) {
        return;
    }
    
    try {
      const genkitHistory = toGenkitHistory(currentHistory);
      const { noteData } = await summarizeConversation({
        persona: agent!.persona,
        userName: userName || 'friend',
        history: genkitHistory,
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
      
      if (currentModule && currentRoadmap) {
          const updatedRoadmap = currentRoadmap.map(module => 
              module.title === currentModule.title 
                  ? { ...module, completed: true } 
                  : module
          );
          setCurrentRoadmap(updatedRoadmap);
          localStorage.setItem(`thrivewell-roadmap-${agentId}`, JSON.stringify(updatedRoadmap));
          setCurrentModule(null);
      }

      console.log('Conversation note and updated roadmap saved automatically to local storage.');

    } catch (error: any) {
       console.error('Error auto-saving note:', error);
    }
  };

  const handleOptionClick = (option: string, originalQuestion: string, proposedTask?: ProposedTask) => {
    const userMessage: ChatMessage = { role: 'user', content: option };
    
    if (isAnsweringModuleQuestions && currentModule) {
      const questionId = currentModule.questions[moduleQuestionIndex].id;
      const newAnswers = { ...moduleAnswers, [questionId]: option };
      setModuleAnswers(newAnswers);

      if (moduleQuestionIndex < currentModule.questions.length - 1) {
        setHistory(prev => [...prev, userMessage]);
        setModuleQuestionIndex(prev => prev + 1);
      } else {
        setIsAnsweringModuleQuestions(false);
        setHistory(prev => [...prev, userMessage]);
        handleAgentResponse(`I've completed the questionnaire for the '${currentModule.title}' module. My answers were: ${JSON.stringify(newAnswers)}. Now, what's the next step?`, [...history, userMessage]);
        setModuleQuestionIndex(0);
        setModuleAnswers({});
      }
      return;
    }

    const newHistory = [...history, userMessage];
    setHistory(newHistory);

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
        // Trigger note saving *after* the user confirms the task
        handleSaveNote();
    }
    
    handleAgentResponse(userMessage.content, newHistory);
  };

  const handleSuggestedReplyClick = (reply: string) => {
    const userMessage: ChatMessage = { role: 'user', content: reply };
    const newHistory = [...history, userMessage];
    setHistory(newHistory);
    handleAgentResponse(userMessage.content, newHistory);
  };

  const startModuleQuestionnaire = (module: Module) => {
    setCurrentModule(module);
    setModuleQuestionIndex(0);
    setModuleAnswers({});
    setIsAnsweringModuleQuestions(true);
  };

  useEffect(() => {
    if (!isLoadingAssessment) {
      if (!assessment) {
        setShowQuestionnaire(true);
      } else if (history.length === 0 && !introSent && currentRoadmap) {
        setIntroSent(true);
        const nextModule = currentRoadmap.find(m => !m.completed);

        if (nextModule) {
           const initialMessage = `Hello ${userName || 'friend'}, I'm ${agent?.givenName.split(' ')[0]}. It's good to connect with you. I've reviewed your file and I'm here to support you.\n\nFor our session today, let's explore the topic of **'${nextModule.title}'**. To help me understand where you're at, I have just a couple of multiple-choice questions for you.`;
           const initialHistory: ChatMessage[] = [{ role: 'model', content: initialMessage }];
           setHistory(initialHistory);
           startModuleQuestionnaire(nextModule);
        } else {
             handleAgentResponse(`Welcome back, ${userName || 'friend'}! It looks like you have completed all the modules in your roadmap. That's a huge accomplishment! How can I help you today?`, []);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessment, isLoadingAssessment, agentId, userName, currentRoadmap]);


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

    window.addEventListener('beforeunload', handleSaveNote);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleSaveNote);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      handleSaveNote();
    };
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentModule, currentRoadmap]);

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
    // This function will be called when the questionnaire is submitted
    setAssessment({ answers: data });
    setShowQuestionnaire(false);
  
    // After questionnaire is complete, re-fetch the roadmap from local storage
    const roadmapData = localStorage.getItem(`thrivewell-roadmap-${agentId}`);
    if (roadmapData) {
      try {
        setCurrentRoadmap(JSON.parse(roadmapData));
      } catch (error) {
        console.error("Failed to parse roadmap after questionnaire:", error);
        setCurrentRoadmap(roadmaps[agentId] || null);
      }
    }
  
    // The useEffect will now see the new assessment and roadmap and trigger the first message
    setIntroSent(false); 
    setHistory([]);
  };

  if (showQuestionnaire) {
    return <Questionnaire agentId={agentId} onComplete={handleQuestionnaireComplete} />;
  }


  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!data.message.trim()) return;
    const userMessage: ChatMessage = { role: 'user', content: data.message };
    
    if (isAnsweringModuleQuestions && currentModule) {
        handleOptionClick(data.message, currentModule.questions[moduleQuestionIndex].question);
    } else {
        const newHistory = [...history, userMessage];
        setHistory(newHistory);
        handleAgentResponse(data.message, newHistory);
    }
    
    reset();
  };
  
  const renderCurrentQuestion = () => {
    if (!isAnsweringModuleQuestions || !currentModule) return null;
    const question = currentModule.questions[moduleQuestionIndex];

    return (
        <div className="mt-4 space-y-2 animate-fade-in w-full">
          <p className="font-semibold text-sm break-words">{question.question}</p>
          <div className="flex flex-col space-y-2 w-full">
            {question.options.map((option, i) => (
              <Button 
                key={i} 
                variant="outline" 
                size="sm"
                className="justify-start text-left w-full whitespace-normal h-auto py-2"
                onClick={() => handleOptionClick(option, question.question)}
                disabled={isLoading}
              >
                {option}
              </Button>
            ))}
          </div>
           <p className="text-xs text-muted-foreground italic mt-2">Please select an answer above, or type your own response below.</p>
        </div>
    )
  }

  return (
    <Card className="flex h-full flex-col border-0 rounded-none shadow-none">
       <CardHeader className="sticky top-0 z-20 flex flex-row items-center justify-between border-b bg-background/80 p-3 backdrop-blur-sm sm:p-4 md:p-6">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
              <AvatarImage src={agent.avatarUrl} alt={agent.givenName} className="object-cover object-top" />
              <AvatarFallback>{agent.givenName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <CardTitle className="font-headline text-lg sm:text-xl md:text-2xl truncate">{agent.givenName}</CardTitle>
              <CardDescription className="text-xs sm:text-sm truncate">{agent.roleDescription}</CardDescription>
              <p className="text-xs text-muted-foreground italic mt-1 hidden sm:block">AI agents are not a replacement for professional medical or mental health advice.</p>
            </div>
          </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 p-3 sm:p-4 md:p-6 overflow-hidden">
        <ScrollArea className="flex-1 min-w-0" ref={scrollAreaRef}>
          <div className="space-y-4 sm:space-y-6 pr-2 sm:pr-4">
            {history.map((message, index) => {
              const isLastMessage = index === history.length - 1;
              
              return (
                <div key={index} className={cn(
                  `flex flex-col gap-2`,
                  isLastMessage ? 'animate-fade-in' : '',
                )}>
                  {message.role === 'model' && (
                    <div className="flex items-end gap-2 text-sm text-muted-foreground">
                       <Avatar className="h-8 w-8">
                        <AvatarImage src={agent.avatarUrl} alt={agent.givenName} className="object-cover object-top" />
                        <AvatarFallback>{agent.givenName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <p className="font-semibold">{agent.givenName.split(' ')[0]}</p>
                      <p className="text-xs italic">({agent.role})</p>
                    </div>
                  )}
                   {message.role === 'user' && (
                     <div className="flex items-center gap-2 self-end">
                        <p className="text-sm font-semibold text-muted-foreground">You</p>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.photoURL ?? "https://picsum.photos/seed/user-avatar/40/40"} />
                          <AvatarFallback>{user?.email?.charAt(0).toUpperCase() ?? 'U'}</AvatarFallback>
                        </Avatar>
                     </div>
                   )}
                  <div className={cn('rounded-lg p-3 min-w-0', 
                      message.role === 'user' 
                      ? 'bg-secondary text-secondary-foreground max-w-[85%] sm:max-w-md self-end' 
                      : `max-w-[90%] sm:max-w-prose self-start bg-${agent.color}-100/50 border border-${agent.color}-200/60`
                  )}>
                    <p className={cn(
                      "whitespace-pre-wrap break-words",
                      message.role === 'user' ? 'text-sm' : 'text-sm'
                    )}>{message.content}</p>
                    
                    {isLastMessage && !isLoading && message.role === 'model' && !isAnsweringModuleQuestions && (
                        <>
                          {message.question && (
                            <div className="mt-4 space-y-2 w-full">
                              <p className="font-semibold text-sm break-words">{message.question.text}</p>
                              <div className="flex flex-col space-y-2 w-full">
                                {message.question.options.map((option, i) => (
                                  <Button 
                                    key={i} 
                                    variant="outline" 
                                    size="sm"
                                    className="justify-start text-left w-full whitespace-normal h-auto py-2"
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
                          {message.suggestedReplies && !message.question && (
                             <div className="mt-4 flex flex-col space-y-2 w-full">
                                {message.suggestedReplies.map((reply, i) => (
                                  <Button 
                                    key={i} 
                                    variant="outline" 
                                    size="sm"
                                    className="justify-start text-left w-full whitespace-normal h-auto py-2"
                                    onClick={() => handleSuggestedReplyClick(reply)}
                                    disabled={isLoading}
                                  >
                                    {reply}
                                  </Button>
                                ))}
                              </div>
                          )}
                        </>
                    )}
                  </div>
                </div>
              )
            })}
             {isAnsweringModuleQuestions && (
                  <div className="flex flex-col items-start gap-2 animate-fade-in w-full">
                    <div className="flex items-end gap-2 text-sm text-muted-foreground">
                       <Avatar className="h-8 w-8">
                        <AvatarImage src={agent.avatarUrl} alt={agent.givenName} className="object-cover object-top" />
                        <AvatarFallback>{agent.givenName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <p className="font-semibold">{agent.givenName.split(' ')[0]}</p>
                      <p className="text-xs italic">({agent.role})</p>
                    </div>
                    <div className={cn(
                      "rounded-lg p-3 max-w-[90%] sm:max-w-prose self-start w-full sm:w-auto",
                      `bg-${agent.color}-100/50 border border-${agent.color}-200/60`
                    )}>
                        {renderCurrentQuestion()}
                    </div>
                  </div>
             )}
            {isLoading && !isAnsweringModuleQuestions && (
              <div className="flex flex-col items-start gap-2 animate-fade-in">
                 <div className="flex items-end gap-2 text-sm text-muted-foreground">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={agent.avatarUrl} alt={agent.givenName} className="object-cover object-top" />
                    <AvatarFallback>{agent.givenName.charAt(0)}</AvatarFallback>
                  </Avatar>
                   <p className="font-semibold">{agent.givenName.split(' ')[0]}</p>
                   <p className="text-xs italic">({agent.role})</p>
                </div>
                <div className={cn(
                    "max-w-[90%] sm:max-w-prose rounded-lg p-3",
                    `bg-${agent.color}-100/50 border border-${agent.color}-200/60`
                )}>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-foreground/50 animate-pulse"></div>
                    <div className="h-2 w-2 rounded-full bg-foreground/50 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="h-2 w-2 rounded-full bg-foreground/50 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2 border-t pt-3 sm:pt-4 flex-shrink-0">
          <Input
            {...register('message', { required: true })}
            placeholder={isAnsweringModuleQuestions ? "Type your answer..." : "Type your message..."}
            autoComplete="off"
            disabled={isLoading}
            className="min-w-0 flex-1"
          />
          <Button type="submit" disabled={isLoading} className="flex-shrink-0">
            {isLoading && !isAnsweringModuleQuestions ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

    