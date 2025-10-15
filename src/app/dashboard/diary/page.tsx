import { DiaryList } from '@/components/diary/diary-list';
import { Button } from '@/components/ui/button';
import { placeholderDiaryEntries } from '@/lib/placeholder-data';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function DiaryPage() {
  // In a real app, you would fetch user-specific entries from your database.
  const entries = placeholderDiaryEntries;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">My Diary</h1>
        <Button asChild>
          <Link href="/dashboard/diary/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Entry
          </Link>
        </Button>
      </div>
      <DiaryList entries={entries} />
    </div>
  );
}
