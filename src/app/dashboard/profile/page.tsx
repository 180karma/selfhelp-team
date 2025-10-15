'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { agents } from '@/lib/agents';
import { Users, MessageSquareText } from 'lucide-react';
import type { AiMentalHealthProfile, AiMentalHealthNote } from '@/lib/types';
import { useEffect, useState } from 'react';


export default function ProfilePage() {
  const [profiles, setProfiles] = useState<AiMentalHealthProfile[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [notesByProfile, setNotesByProfile] = useState<Record<string, AiMentalHealthNote[]>>({});
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);

  useEffect(() => {
    // Load profiles from localStorage
    const loadedProfiles: AiMentalHealthProfile[] = [];
    agents.forEach(agent => {
      const profileData = localStorage.getItem(`thrivewell-profile-${agent.id}`);
      if (profileData) {
        loadedProfiles.push({ id: agent.id, ...JSON.parse(profileData) } as AiMentalHealthProfile);
      }
    });
    setProfiles(loadedProfiles);
    setIsLoadingProfiles(false);

    // Note: Loading notes from localStorage would require a more complex setup
    // as they are saved under user-specific paths in Firestore.
    // For this example, we will assume notes are not available in the non-auth flow.
    setIsLoadingNotes(false);
  }, []);

  const getAgentName = (agentId: string) => {
    return agents.find(agent => agent.id === agentId)?.givenName || 'Unknown Agent';
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
        As you interact with your AI wellness team, they will create and update profiles based on your answers. These are saved in this browser.
      </p>

      {profiles && profiles.length > 0 ? (
         <Accordion type="single" collapsible className="w-full" defaultValue={profiles[0].id}>
            {profiles.map(profile => (
                <AccordionItem value={profile.id} key={profile.id}>
                    <AccordionTrigger>
                        <div className="flex items-center gap-4">
                            <Users className="h-5 w-5 text-primary" />
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
                        <p className="text-sm text-muted-foreground">Conversation notes are saved with your account when you log in. They are not available in this mode.</p>
                      </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
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
