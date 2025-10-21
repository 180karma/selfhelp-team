
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/firebase';
import type { Mantra } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { HeartHandshake } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { agents } from '@/lib/agents';
import { cn } from '@/lib/utils';

export default function MantrasPage() {
  const { user } = useUser();
  const [mantras, setMantras] = useState<Mantra[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (user) {
      const storedMantras = JSON.parse(localStorage.getItem('thrivewell-mantras') || '[]');
      const userMantras = storedMantras.filter((mantra: Mantra) => mantra.userId === user.uid);
      // Sort by newest first
      userMantras.sort((a: Mantra, b: Mantra) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setMantras(userMantras);
    }
    setIsLoading(false);
  }, [user]);

  const getAgentInfo = (agentName: string) => {
    return agents.find(a => a.givenName === agentName);
  };

  if (isLoading) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-5 w-2/3" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
            </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold flex items-center gap-2">
        <HeartHandshake className="h-8 w-8 text-primary" />
        Your Mantras
      </h1>
      <p className="text-muted-foreground">
        These are the powerful, positive statements assigned by your AI wellness team. Revisit them often to reinforce your growth.
      </p>

      {mantras.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mantras.map((mantra) => {
            const agent = getAgentInfo(mantra.assignedBy);
            return (
              <Card 
                key={mantra.id} 
                className={cn(
                  "flex flex-col border-l-4",
                  agent ? `border-${agent.color}-300` : 'border-border'
                )}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold leading-relaxed">"{mantra.mantra}"</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow pb-4">
                  <p className="text-sm text-muted-foreground">{mantra.aim}</p>
                </CardContent>
                <CardContent className="flex items-center gap-2 border-t pt-4">
                  {agent && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={agent.avatarUrl} alt={agent.givenName} className="object-cover object-center" />
                      <AvatarFallback>{agent.givenName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="text-sm">
                      <p className="font-semibold">Assigned by</p>
                      <p className="text-muted-foreground">{mantra.assignedBy.split(' ')[0]}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-muted-foreground">
              You haven't been assigned any mantras yet. Chat with your AI agents to discover some!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
