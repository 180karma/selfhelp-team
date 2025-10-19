
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { agents } from '@/lib/agents';
import { Users, MessageSquareText, CheckSquare, Square } from 'lucide-react';
import type { AiMentalHealthProfile, AiMentalHealthNote } from '@/lib/types';
import { useMemo, useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { Module } from '@/lib/roadmaps';

export default function ProfilePage() {
  const { user } = useUser();
  const [profiles, setProfiles] = useState<AiMentalHealthProfile[]>([]);
  const [notes, setNotes] = useState<AiMentalHealthNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Load profiles from local storage
    const storedProfiles: AiMentalHealthProfile[] = [];
    agents.forEach(agent => {
      const profileData = localStorage.getItem(`thrivewell-profile-${agent.id}`);
      if (profileData) {
        const parsedData = JSON.parse(profileData);
        // Add a unique ID for the accordion key
        parsedData.id = `profile-${agent.id}`;
        
        // Also load roadmap for this agent
        const roadmapData = localStorage.getItem(`thrivewell-roadmap-${agent.id}`);
        if(roadmapData) {
            parsedData.roadmap = JSON.parse(roadmapData);
        }

        storedProfiles.push(parsedData);
      }
    });
    setProfiles(storedProfiles);

    // Load notes from local storage
    const notesData = localStorage.getItem('thrivewell-notes');
    const storedNotes = notesData ? JSON.parse(notesData) : [];
    // Ensure notes are sorted by timestamp descending (newest first)
    storedNotes.sort((a: AiMentalHealthNote, b: AiMentalHealthNote) => 
        new Date(b.timestamp as string).getTime() - new Date(a.timestamp as string).getTime());
    setNotes(storedNotes);

    setIsLoading(false);
  }, []);
  
  const notesByProfile = useMemo(() => {
    if (!notes) return {};
    return notes.reduce((acc, note) => {
        const agentId = note.aiAgentId;
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
        <h1 className="font-headline text-3xl font-bold">Team Notes</h1>
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
      <h1 className="font-headline text-3xl font-bold">Team Notes</h1>
      <p className="text-muted-foreground">
        As you interact with your AI wellness team, they create profiles and notes from your conversations. These are saved to your browser.
      </p>

      {profiles && profiles.length > 0 ? (
         <Accordion type="single" collapsible className="w-full" defaultValue={profiles[0].id}>
            {profiles.map(profile => {
                const agent = getAgentInfo(profile.aiAgentId);
                const agentNotes = notesByProfile[profile.aiAgentId] || [];
                if (!agent) return null;
                const roadmapItems = (profile.roadmap as Module[]) || [];
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
                                   <p className="whitespace-pre-wrap text-sm">{profile.profileData}</p>
                                </CardContent>
                            </Card>

                            {roadmapItems.length > 0 && (
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="roadmap">
                                        <Card>
                                            <AccordionTrigger className="w-full p-6">
                                                <CardHeader className="p-0 text-left">
                                                    <CardTitle className="text-lg font-semibold">Clinical Roadmap</CardTitle>
                                                    <CardDescription>This is the agent's plan for your sessions. Click to expand.</CardDescription>
                                                </CardHeader>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <CardContent className="pt-0 space-y-2">
                                                    {roadmapItems.map((item, index) => {
                                                        return (
                                                            <div key={index} className="flex items-start gap-2 text-sm">
                                                                {item.completed ? <CheckSquare className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" /> : <Square className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />}
                                                                <span className={item.completed ? 'text-muted-foreground line-through' : 'text-foreground'}>{item.title}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </CardContent>
                                            </AccordionContent>
                                        </Card>
                                    </AccordionItem>
                                </Accordion>
                            )}

                            <h3 className="font-headline text-lg font-semibold pt-4">Conversation Notes</h3>
                             {agentNotes.length > 0 ? (
                                <div className="space-y-4">
                                    {agentNotes.map((note, index) => {
                                        const timestamp = new Date(note.timestamp as string);
                                        // Numbering starts from the oldest note. Since the array is sorted newest to oldest,
                                        // the number is total length minus the current index.
                                        const noteNumber = agentNotes.length - index;
                                        return (
                                            <Card key={note.id}>
                                                <CardHeader>
                                                    <CardTitle className="text-md flex items-center justify-between">
                                                      <div className="flex items-center gap-2">
                                                        <MessageSquareText className="h-4 w-4" />
                                                        Note from {timestamp.toLocaleDateString()}
                                                      </div>
                                                      <span className="text-sm font-medium text-muted-foreground">#{noteNumber}</span>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="whitespace-pre-wrap text-sm">{note.noteData}</p>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                             ) : (
                                <p className="text-sm text-muted-foreground">No conversation notes from {agent.givenName.split(' ')[0]} yet.</p>
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
