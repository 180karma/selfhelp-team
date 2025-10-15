'use client';

import { DiaryEntry } from '@/lib/types';
import { useParams, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { useUser } from '@/firebase';

export default function DiaryEntryPage() {
  const params = useParams();
  const entryId = params.id as string;
  const { user } = useUser();
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (user && entryId) {
      const storedEntries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
      const foundEntry = storedEntries.find((e: DiaryEntry) => e.id === entryId && e.userId === user.uid);
      setEntry(foundEntry || null);
    }
    setIsLoading(false);
  }, [user, entryId]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!entry) {
    notFound();
    return null;
  }
  
  const formattedDate = new Date(entry.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-3xl">{entry.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 pt-2">
            <Calendar className="h-4 w-4" /> 
            <span>{formattedDate}</span>
            <Badge variant="outline" className="capitalize">{entry.type} Journal</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose prose-sm max-w-none text-foreground" style={{ whiteSpace: 'pre-wrap' }}>
            {entry.content}
        </div>
        
        {entry.categories && entry.categories.length > 0 && (
            <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">AI-Generated Categories</h3>
                <div className="flex flex-wrap gap-2">
                {entry.categories.map(category => (
                    <Badge key={category} variant="secondary">{category}</Badge>
                ))}
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
