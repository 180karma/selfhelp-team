'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { agents } from '@/lib/agents';
import { Users, MessageSquareText } from 'lucide-react';
import type { AiMentalHealthProfile, AiMentalHealthNote } from '@/lib/types';
import { useEffect, useState, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, collectionGroup, query, where, orderBy, getDocs } from 'firebase/firestore';


export default function ProfilePage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const [profiles, setProfiles] = useState<AiMentalHealthProfile[]>([]);
  const [notes, setNotes] = useState<AiMentalHealthNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !firestore) {
      setIsLoading(false);
      return;
    }

    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        // Fetch profiles
        const profilesQuery = query(collection(firestore, 'users', user.uid, 'aiMentalHealthProfiles'));
        const profileSnapshot = await getDocs(profilesQuery);
        const fetchedProfiles = profileSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AiMentalHealthProfile[];
        setProfiles(fetchedProfiles);

        // Fetch notes using collectionGroup
        const notesQuery = query(
          collectionGroup(firestore, 'aiMentalHealthNotes'),
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc')
        );
        const notesSnapshot = await getDocs(notesQuery);
        const fetchedNotes = notesSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.ref.path, // Use the full path as the ID for collectionGroup items
                ...data
            }
        }) as AiMentalHealthNote[];
        setNotes(fetchedNotes);

      } catch (error) {
        console.error("Error fetching profile data:", error);
        // Here you could emit a contextual error if this were a permission issue
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [user, firestore]);
  
  const notesByProfile = useMemo(() => {
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
                                        const timestamp = (note.timestamp as any).toDate ? (note.timestamp as any).toDate() : new Date(note.timestamp);
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
