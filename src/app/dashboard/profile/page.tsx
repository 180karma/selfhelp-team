'use client';

import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, collectionGroup, query, where, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { agents } from '@/lib/agents';
import { Bot, MessageSquareText } from 'lucide-react';
import type { AiMentalHealthProfile, AiMentalHealthNote } from '@/lib/types';
import { useEffect, useState } from 'react';


export default function ProfilePage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const profilesCollection = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'aiMentalHealthProfiles');
  }, [firestore, user]);

  const { data: profiles, isLoading: isLoadingProfiles } = useCollection<AiMentalHealthProfile>(profilesCollection);

  const [notesByProfile, setNotesByProfile] = useState<Record<string, AiMentalHealthNote[]>>({});
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);

  useEffect(() => {
    const fetchAllNotes = async () => {
        if (!user || !firestore) return;
        
        setIsLoadingNotes(true);
        const notesGroup = collectionGroup(firestore, 'aiMentalHealthNotes');
        const q = query(notesGroup, where('userId', '==', user.uid));
        
        const querySnapshot = await getDocs(q);
        const notesMap: Record<string, AiMentalHealthNote[]> = {};

        querySnapshot.forEach((doc) => {
            const note = { id: doc.id, ...doc.data() } as AiMentalHealthNote;
            const agentId = doc.ref.parent.parent?.id;
            if (agentId) {
                if (!notesMap[agentId]) {
                    notesMap[agentId] = [];
                }
                notesMap[agentId].push(note);
            }
        });

         // Sort notes by timestamp
        for (const agentId in notesMap) {
            notesMap[agentId].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        }

        setNotesByProfile(notesMap);
        setIsLoadingNotes(false);
    }
    
    if(user?.uid) {
        fetchAllNotes();
    }
  }, [user, firestore, profiles]); // Re-fetch notes if profiles change as well
  

  const getAgentName = (agentId: string) => {
    return agents.find(agent => agent.id === agentId)?.name || 'Unknown Agent';
  }

  const isLoading = isLoadingProfiles || isLoadingNotes;

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
        As you interact with your AI wellness team, they will create and update profiles and notes based on your diary entries and conversations. Here are their current assessments.
      </p>

      {profiles && profiles.length > 0 ? (
         <Accordion type="single" collapsible className="w-full" defaultValue={profiles[0].id}>
            {profiles.map(profile => (
                <AccordionItem value={profile.id} key={profile.id}>
                    <AccordionTrigger>
                        <div className="flex items-center gap-4">
                            <Bot className="h-5 w-5 text-primary" />
                            <span className="font-semibold">{getAgentName(profile.aiAgentId)}'s Profile & Notes</span>
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
                        
                        {notesByProfile[profile.aiAgentId] && notesByProfile[profile.aiAgentId].length > 0 ? (
                           <div className="space-y-3">
                                {notesByProfile[profile.aiAgentId].map(note => (
                                    <Card key={note.id}>
                                       <CardHeader className="flex-row gap-4 items-center">
                                            <MessageSquareText className="h-5 w-5 text-primary" />
                                            <div>
                                               <CardTitle className="text-base font-semibold">Note from {new Date(note.timestamp).toLocaleDateString()}</CardTitle>
                                                <CardDescription>{new Date(note.timestamp).toLocaleTimeString()}</CardDescription>
                                            </div>
                                       </CardHeader>
                                       <CardContent className="pt-0">
                                            <p className="text-sm text-muted-foreground" style={{whiteSpace: 'pre-wrap'}}>{note.noteData}</p>
                                       </CardContent>
                                    </Card>
                                ))}
                           </div>
                        ) : (
                           <p className="text-sm text-muted-foreground">No conversation notes have been saved for this agent yet. Notes are saved automatically when you leave a chat session.</p>
                        )}
                      </div>
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
