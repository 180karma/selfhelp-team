'use client';

import { agentChat } from '@/ai/flows/agent-chat';
import { summarizeConversation } from '@/ai/flows/summarize-conversation';
import { agents } from '@/lib/agents';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Questionnaire } from '@/components/agents/questionnaire';
import { doc, addDoc, collection, DocumentData, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

type ChatMessage = {
  role: 'user' | 'model';
  content: string;
};

type Inputs = {
  message: string;
};

// Convert chat history for Genkit
const toGenkitHistory = (history: ChatMessage[]) => {
  return history.map(msg => ({
    role: msg.role,
    content: [{ text: msg.content }]
  }));
};

export default function AgentChatPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  const agent = agents.find((a) => a.id === agentId);

  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const assessmentRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid, 'psychologicalAssessments', agentId);
  }, [user, firestore, agentId]);

  const { data: assessment, isLoading: isLoadingAssessment } = useDoc<DocumentData>(assessmentRef);

  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [introSent, setIntroSent] = useState(false);

  // Use a ref to hold the latest history for the cleanup function
  const historyRef = useRef(history);
  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  const handleAgentResponse = async (message: string, currentHistory: ChatMessage[], profileData?: DocumentData | null) => {
    setIsLoading(true);
    try {
      let personaWithProfile = agent!.persona;
      if (profileData) {
        const answers = profileData.answers || profileData;
        const profileSummary = Object.entries(answers)
          .map(([key, value]) => `- ${key.replace(/([A-Z])/g, ' $1').trim()}: ${value}`)
          .join('\n');
        personaWithProfile += `\n\nHere is the user's profile based on their questionnaire answers. Use this to tailor your conversation:\n${profileSummary}`;
      }

      const genkitHistory = toGenkitHistory(currentHistory);
      const { response } = await agentChat({
        persona: personaWithProfile,
        history: genkitHistory,
        message: message,
      });

      setHistory((prev) => [...prev, { role: 'model', content: response }]);
    } catch (error) {
      console.error('Error chatting with agent:', error);
      setHistory((prev) => [...prev, { role: 'model', content: "I'm having trouble responding right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNote = async () => {
    // Use the ref to get the latest history
    const currentHistory = historyRef.current;
    
    // Only save if there's a user message in the history
    const hasUserMessage = currentHistory.some(m => m.role === 'user');

    if (!user || !firestore || currentHistory.length === 0 || !hasUserMessage) {
      return;
    }
    
    try {
      const genkitHistory = toGenkitHistory(currentHistory);
      const { noteData } = await summarizeConversation({
        persona: agent!.persona,
        history: genkitHistory,
      });

      const profileRef = doc(firestore, 'users', user.uid, 'aiMentalHealthProfiles', agentId);
      const notesCollection = collection(profileRef, 'aiMentalHealthNotes');
      
      // We use addDoc which is already non-blocking as per our setup
      addDoc(notesCollection, {
        noteData,
        timestamp: new Date().toISOString(),
        userId: user.uid,
      });
      
      console.log('Conversation note saved automatically.');

    } catch (error: any) {
       console.error('Error auto-saving note:', error);
       // We might not want to show a toast here as it could be disruptive when navigating away
    }
  };


  useEffect(() => {
    if (!isLoadingAssessment) {
      if (!assessment) {
        setShowQuestionnaire(true);
      } else if (history.length === 0 && !introSent) {
        setIntroSent(true);
        handleAgentResponse("Hello, please introduce yourself based on my profile.", [], assessment);
      }
    }
  }, [assessment, isLoadingAssessment, introSent]);


  useEffect(() => {
    // Scroll to the bottom when history changes
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [history]);
  
  // This effect will run when the component unmounts
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
    setShowQuestionnaire(false);
    setIntroSent(true);
    handleAgentResponse("Hello, please introduce yourself based on my profile.", [], {answers: data});
  };

  if (showQuestionnaire) {
    return <Questionnaire agentId={agentId} onComplete={handleQuestionnaireComplete} />;
  }


  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const userMessage: ChatMessage = { role: 'user', content: data.message };
    const newHistory = [...history, userMessage];
    setHistory(newHistory);
    reset();
    handleAgentResponse(data.message, newHistory, assessment);
  };

  return (
    <Card className="flex h-[85vh] flex-col">
      <CardHeader className="flex flex-row items-center justify-between border-b">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="font-headline text-2xl">{agent.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{agent.type}</p>
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
                      <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full items-center justify-center bg-primary text-primary-foreground">
                        <Bot className="h-6 w-6" />
                      </span>
                    </Avatar>
                )}
                <div className={`max-w-prose rounded-lg p-3 ${message.role === 'user' ? 'bg-secondary text-secondary-foreground' : 'bg-muted'}`}>
                  <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>
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
                    <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full items-center justify-center bg-primary text-primary-foreground">
                      <Bot className="h-6 w-6" />
                    </span>
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
