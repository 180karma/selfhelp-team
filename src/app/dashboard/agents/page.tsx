'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { agents } from '@/lib/agents';
import { Bot, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">AI Wellness Team</h1>
      <p className="text-muted-foreground">
        Your personal team of AI specialists. As you write in your diary, relevant entries will be shared with the appropriate agent to provide you with insights and support. You can also chat with them directly.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Link href={`/dashboard/agents/${agent.id}`} key={agent.id} className="block hover:ring-2 hover:ring-primary rounded-lg">
            <Card className="h-full transition-all">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-headline">{agent.name}</CardTitle>
                  <CardDescription>{agent.type}</CardDescription>
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
