'use client';

import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { agents } from '@/lib/agents';
import { Bot } from 'lucide-react';
import type { AiMentalHealthProfile } from '@/lib/types';


export default function ProfilePage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const profilesCollection = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'aiMentalHealthProfiles');
  }, [firestore, user]);

  const { data: profiles, isLoading } = useCollection<AiMentalHealthProfile>(profilesCollection);

  const getAgentName = (agentId: string) => {
    return agents.find(agent => agent.id === agentId)?.name || 'Unknown Agent';
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="font-headline text-3xl font-bold">My AI-Generated Profiles</h1>
        <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">My AI-Generated Profiles</h1>
      <p className="text-muted-foreground">
        As you interact with your AI wellness team, they will create and update profiles based on your diary entries and conversations. Here are their current assessments.
      </p>

      {profiles && profiles.length > 0 ? (
         <Accordion type="single" collapsible className="w-full">
            {profiles.map(profile => (
                <AccordionItem value={profile.id} key={profile.id}>
                    <AccordionTrigger>
                        <div className="flex items-center gap-4">
                            <Bot className="h-5 w-5 text-primary" />
                            <span className="font-semibold">{getAgentName(profile.aiAgentId)}'s Profile</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <Card>
                            <CardContent className="p-6">
                               <p style={{ whiteSpace: 'pre-wrap' }}>{profile.profileData}</p>
                            </CardContent>
                        </Card>
                    </AccordionContent>
                </AccordionItem>
            ))}
         </Accordion>
      ) : (
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">
              No AI profiles have been generated yet. Complete an agent questionnaire or write a diary entry to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
