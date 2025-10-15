'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { agents } from '@/lib/agents';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';


export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">Your AI Wellness Team</h1>
      <p className="text-muted-foreground">
        Your personal team of AI specialists. As you write in your diary, relevant entries will be shared with the appropriate team member to provide you with insights and support. You can also chat with them directly.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Link href={`/dashboard/agents/${agent.id}`} key={agent.id} className="block hover:ring-2 hover:ring-primary rounded-lg">
            <Card className="h-full transition-all">
              <CardHeader className="flex flex-row items-center gap-4">
                 <Avatar>
                  <AvatarImage src={agent.avatarUrl} alt={agent.givenName} />
                  <AvatarFallback>{agent.givenName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="font-headline">{agent.givenName}</CardTitle>
                  <CardDescription>{agent.role}</CardDescription>
                </div>
                <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Specializes in topics like: {agent.categories.join(', ')}.
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
