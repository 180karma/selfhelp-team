'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { agents } from '@/lib/agents';
import { Users, MessageSquareText } from 'lucide-react';
import type { AiMentalHealthProfile, AiMentalHealthNote } from '@/lib/types';
import { useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, collectionGroup, query, where, orderBy } from 'firebase/firestore';


export default function ProfilePage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const profilesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'aiMentalHealthProfiles'));
  }, [user, firestore]);
  const { data: profiles, isLoading: isLoadingProfiles } = useCollection<AiMentalHealthProfile>(profilesQuery);

  const notesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collectionGroup(firestore, 'aiMentalHealthNotes'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );
  }, [user, firestore]);
  const { data: notes, isLoading: isLoadingNotes } = useCollection<AiMentalHealthNote>(notesQuery);

  const isLoading = isLoadingProfiles || isLoadingNotes;
  
  const notesByProfile = useMemo(() => {
    if (!notes) return {};
    return notes.reduce((acc, note) => {
        // e.g., users/uid/aiMentalHealthProfiles/agentId/aiMentalHealthNotes/noteId
        const pathSegments = note.id.split('/');
        const agentId = pathSegments.length > 3 ? pathSegments[3] : undefined;
        if (agentId) {
            if (!acc[agentId]) {
                acc[agentId] = [];
            }
            acc[agentId].push(note);
        }
        return acc;
    }, {} as Record<string, AiMentalHealthNote[]>);
  }, [notes]);

  const getAgentInfo = (agentId: string) => {
    return agents.find(agent => agent.id === agentId);
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
        As you interact with your AI wellness team, they create profiles and notes from your conversations. These are saved to your account.
      </p>

      {profiles && profiles.length > 0 ? (
         <Accordion type="single" collapsible className="w-full" defaultValue={profiles[0].id}>
            {profiles.map(profile => {
                const agent = getAgentInfo(profile.aiAgentId);
                const agentNotes = notesByProfile[profile.aiAgentId] || [];
                if (!agent) return null;
                return (
                    <AccordionItem value={profile.id} key={profile.id}>
                        <AccordionTrigger>
                            <div className="flex items-center gap-4">
                                <Users className="h-5 w-5 text-primary" />
                                <span className="font-semibold">{agent.givenName} ({agent.role})</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">Initial Profile Summary</CardTitle>
                                    <CardDescription>This is the initial analysis based on your questionnaire answers.</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                   <p style={{ whiteSpace: 'pre-wrap' }}>{profile.profileData}</p>
                                </CardContent>
                            </Card>

                            <h3 className="font-headline text-lg font-semibold pt-4">Conversation Notes</h3>
                             {agentNotes.length > 0 ? (
                                <div className="space-y-4">
                                    {agentNotes.map(note => {
                                        const timestamp = (note.timestamp as any)?.toDate ? (note.timestamp as any).toDate() : new Date(note.timestamp);
                                        return (
                                            <Card key={note.id}>
                                                <CardHeader>
                                                    <CardTitle className="text-md flex items-center gap-2">
                                                        <MessageSquareText className="h-4 w-4" />
                                                        Note from {timestamp.toLocaleDateString()}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p style={{ whiteSpace: 'pre-wrap' }} className="text-sm">{note.noteData}</p>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                             ) : (
                                <p className="text-sm text-muted-foreground">No conversation notes from {agent.givenName} yet.</p>
                             )}
                          </div>
                        </AccordionContent>
                    </AccordionItem>
                )
            })}
         </Accordion>
      ) : (
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">
              No AI profiles have been generated yet. Complete an agent questionnaire to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
