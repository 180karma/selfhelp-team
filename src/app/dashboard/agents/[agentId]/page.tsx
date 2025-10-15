'use client';

import { agentChat } from '@/ai/flows/agent-chat';
import { agents, AIAgent } from '@/lib/agents';
import { notFound } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';

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

export default function AgentChatPage({ params }: { params: { agentId: string } }) {
  const agent = agents.find((a) => a.id === params.agentId);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();


  useEffect(() => {
    // Scroll to the bottom when history changes
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [history]);

  if (!agent) {
    notFound();
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const userMessage: ChatMessage = { role: 'user', content: data.message };
    setHistory((prev) => [...prev, userMessage]);
    setIsLoading(true);
    reset();

    try {
      const genkitHistory = toGenkitHistory([...history, userMessage]);
      const { response } = await agentChat({
        persona: agent.persona,
        history: genkitHistory.slice(0, -1), // History before the latest user message
        message: data.message,
      });

      setHistory((prev) => [...prev, { role: 'model', content: response }]);
    } catch (error) {
      console.error('Error chatting with agent:', error);
      setHistory((prev) => [...prev, { role: 'model', content: "I'm having trouble responding right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex h-[85vh] flex-col">
      <CardHeader className="flex flex-row items-center gap-4 border-b">
        <div className="rounded-full bg-primary/10 p-3">
          <Bot className="h-6 w-6 text-primary" />
        </div>
        <div>
          <CardTitle className="font-headline text-2xl">{agent.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{agent.type}</p>
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
                  <p className="text-sm">{message.content}</p>
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
