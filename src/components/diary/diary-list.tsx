'use client';

import { useState } from 'react';
import type { DiaryEntry } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { summarizeEntryAction } from '@/app/actions/diary';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

type DiaryListProps = {
  entries: DiaryEntry[];
};

export function DiaryList({ entries }: DiaryListProps) {
  const { toast } = useToast();
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSummarize = async (content: string) => {
    setIsSummarizing(true);
    const result = await summarizeEntryAction(content);
    setIsSummarizing(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else if (result.summary) {
      setSummary(result.summary);
      setIsDialogOpen(true);
    }
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <Card key={entry.id}>
            <CardHeader>
              <CardTitle className="font-headline">{entry.title}</CardTitle>
              <CardDescription>{new Date(entry.createdAt).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-4 text-muted-foreground">{entry.content}</p>
            </CardContent>
            <CardFooter>
              <Button
                variant="secondary"
                onClick={() => handleSummarize(entry.content)}
                disabled={isSummarizing}
              >
                {isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Summarize with AI
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline">Entry Summary</AlertDialogTitle>
            <AlertDialogDescription>{summary}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsDialogOpen(false)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
