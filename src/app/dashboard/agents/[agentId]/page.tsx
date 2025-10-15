'use client';

import { agentChat } from '@/ai/flows/agent-chat';
import { summarizeConversation } from '@/ai/flows/summarize-conversation';
import { agents } from '@/lib/agents';
import { useParams, notFound } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Questionnaire } from '@/components/agents/questionnaire';
import { doc, addDoc, collection, DocumentData, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import type { AiMentalHealthNote, DiaryEntry } from '@/lib/types';


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

  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const firestore = useFirestore();

  // Fetch initial assessment
  const assessmentRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid, 'psychologicalAssessments', agentId);
  }, [user, firestore, agentId]);
  const { data: assessment, isLoading: isLoadingAssessment } = useDoc<DocumentData>(assessmentRef);

  // Fetch past conversation notes
  const notesRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    const profileRef = doc(firestore, 'users', user.uid, 'aiMentalHealthProfiles', agentId);
    return query(collection(profileRef, 'aiMentalHealthNotes'), orderBy('timestamp', 'desc'), limit(5));
  }, [user, firestore, agentId]);
  const { data: pastNotes, isLoading: isLoadingNotes } = useCollection<AiMentalHealthNote>(notesRef);

  // Fetch all diary entries
  const diaryEntriesRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'diaryEntries');
  }, [user, firestore]);
  const { data: diaryEntries, isLoading: isLoadingDiary } = useCollection<DiaryEntry>(diaryEntriesRef);

  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [introSent, setIntroSent] = useState(false);
  const historyRef = useRef(history);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  const handleAgentResponse = async (message: string, currentHistory: ChatMessage[], profileData?: DocumentData | null) => {
    setIsLoading(true);
    try {
      let personaWithProfile = agent!.persona;

      // 1. Add questionnaire data to persona
      if (profileData) {
        const answers = profileData.answers || profileData;
        const profileSummary = Object.entries(answers)
          .map(([key, value]) => `- ${key.replace(/([A-Z])/g, ' $1').trim()}: ${value}`)
          .join('\n');
        personaWithProfile += `\n\nHere is the user's profile based on their questionnaire answers:\n${profileSummary}`;
      }

      // 2. Add past conversation notes to persona
      if (pastNotes && pastNotes.length > 0) {
        const notesSummary = pastNotes.map(note => `On ${new Date(note.timestamp).toLocaleDateString()}, we discussed: ${note.noteData}`).join('\n\n');
        personaWithProfile += `\n\nHere are summaries of our recent conversations to give you memory:\n${notesSummary}`;
      }

      // 3. Add relevant diary entries to persona
      if (diaryEntries && diaryEntries.length > 0 && agent) {
        const relevantEntries = diaryEntries.filter(entry =>
          agent.categories.some(cat => entry.categories.includes(cat))
        );
        if (relevantEntries.length > 0) {
          const diarySummary = relevantEntries.map(entry => `On ${new Date(entry.createdAt).toLocaleDateString()}, the user wrote a diary entry titled "${entry.title}" with the categories [${entry.categories.join(', ')}]. Content: ${entry.content.substring(0, 300)}...`).join('\n\n');
          personaWithProfile += `\n\nHere are some of the user's recent diary entries that are relevant to your specialty. Use them to understand the user's state of mind:\n${diarySummary}`;
        }
      }


      const genkitHistory = toGenkitHistory(currentHistory);
      const result = await agentChat({
        persona: personaWithProfile,
        history: genkitHistory,
        message: message,
      });

      setHistory((prev) => [...prev, { role: 'model', content: result.response, question: result.question }]);


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
      
      await addDoc(notesCollection, {
        noteData,
        timestamp: serverTimestamp(),
        userId: user.uid,
      });
      
      console.log('Conversation note saved automatically.');

    } catch (error: any) {
       console.error('Error auto-saving note:', error);
    }
  };

  const handleOptionClick = (option: string, originalQuestion: string) => {
    const userMessage: ChatMessage = { role: 'user', content: `Regarding "${originalQuestion}", I chose: ${option}` };
    const newHistory = [...history, userMessage];
    setHistory(newHistory);
    // Let the agent respond to the selected option
    handleAgentResponse(userMessage.content, newHistory, assessment);
  };


  useEffect(() => {
    const isLoadingData = isLoadingAssessment || isLoadingNotes || isLoadingDiary;
    if (!isLoadingData) {
      if (!assessment) {
        setShowQuestionnaire(true);
      } else if (history.length === 0 && !introSent) {
        setIntroSent(true);
        handleAgentResponse("Hello, please introduce yourself based on my profile and ask your first question.", [], assessment);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessment, isLoadingAssessment, isLoadingNotes, isLoadingDiary, introSent]);


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

  const isLoadingData = isLoadingAssessment || isLoadingNotes || isLoadingDiary;

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center h-full">
        <Skeleton className="h-24 w-1/2" />
      </div>
    );
  }

  const handleQuestionnaireComplete = (data: DocumentData) => {
    setShowQuestionnaire(false);
    setIntroSent(true);
    // Pass the raw answers object which is what handleAgentResponse now expects
    handleAgentResponse("Hello, please introduce yourself based on my profile and ask your first question.", [], data);
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
              <CardDescription>{agent.type}</CardDescription>
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
