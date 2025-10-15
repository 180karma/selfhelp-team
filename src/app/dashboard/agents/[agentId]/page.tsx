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
import type { AiMentalHealthNote, Goal, GoalCategory } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';


type ChatMessage = {
  role: 'user' | 'model';
  content: string;
  question?: {
    text: string;
    options: string[];
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
      const savedProfile = localStorage.getItem(profileKey);
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        if (profile.profileData) {
          personaWithContext += `\n\n## My Internal Profile Summary About the User:\n${profile.profileData}`;
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

      const genkitHistory = toGenkitHistory(currentHistory);
      const result = await agentChat({
        persona: personaWithContext,
        history: genkitHistory,
        message: message,
        userName: user?.displayName || 'the user',
      });

      setHistory((prev) => [...prev, { role: 'model', content: result.response, question: result.question }]);

      // Check if the agent wants to add a task
      if (result.addTask && user) {
        const newGoal: Goal = {
          id: uuidv4(),
          userId: user.uid,
          title: result.addTask.title,
          category: result.addTask.category as GoalCategory,
          addedBy: result.addTask.addedBy,
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

    } catch (error) {
      console.error('Error chatting with agent:', error);
      setHistory((prev) => [...prev, { role: 'model', content: "I'm having trouble responding right now. Please try again later." }]);
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
      const genkitHistory = toGenkitHistory(currentHistory);
      const { noteData } = await summarizeConversation({
        persona: agent!.persona,
        history: genkitHistory,
      });
      
      const note: AiMentalHealthNote = {
        id: `note-${agentId}-${Date.now()}`,
        aiAgentId: agentId,
        noteData,
        timestamp: new Date().toISOString(),
        userId: user?.uid, // Can still be useful for potential future migrations
      };

      const notesKey = 'thrivewell-notes';
      const existingNotes = JSON.parse(localStorage.getItem(notesKey) || '[]');
      existingNotes.push(note);
      localStorage.setItem(notesKey, JSON.stringify(existingNotes));
      
      console.log('Conversation note saved automatically to local storage.');

    } catch (error: any) {
       console.error('Error auto-saving note:', error);
    }
  };

  const handleOptionClick = (option: string, originalQuestion: string) => {
    const userMessage: ChatMessage = { role: 'user', content: `Regarding "${originalQuestion}", I chose: ${option}` };
    const newHistory = [...history, userMessage];
    setHistory(newHistory);
    // Let the agent respond to the selected option
    handleAgentResponse(userMessage.content, newHistory);
  };


  useEffect(() => {
    if (!isLoadingAssessment) {
      if (!assessment) {
        setShowQuestionnaire(true);
      } else if (history.length === 0 && !introSent) {
        setIntroSent(true);
        handleAgentResponse("Hello, please introduce yourself based on my profile and ask your first question.", []);
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
    handleAgentResponse("Hello, please introduce yourself based on my profile and ask your first question.", []);
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
    <Card className="flex h-[85vh] flex-col">
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
            {history.map((message, index) => (
              <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
                {message.role === 'model' && (
                   <Avatar>
                      <AvatarImage src={agent.avatarUrl} alt={agent.givenName} />
                      <AvatarFallback>{agent.givenName.charAt(0)}</AvatarFallback>
                    </Avatar>
                )}
                <div className={`max-w-prose rounded-lg p-3 ${message.role === 'user' ? 'bg-secondary text-secondary-foreground' : 'bg-muted'}`}>
                  <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>
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
                            onClick={() => handleOptionClick(option, message.question!.text)}
                            disabled={isLoading}
                          >
                            {option}
                          </Button>
                         ))}
                       </div>
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
            ))}
            {isLoading && (
              <div className="flex items-start gap-4">
                 <Avatar>
                    <AvatarImage src={agent.avatarUrl} alt={agent.givenName} />
                    <AvatarFallback>{agent.givenName.charAt(0)}</AvatarFallback>
                  </Avatar>
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
