import { DiaryList } from '@/components/diary/diary-list';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function DiaryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in">
        <h1 className="font-headline text-3xl font-bold">My Diary</h1>
        <Button asChild>
          <Link href="/dashboard/diary/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Entry
          </Link>
        </Button>
      </div>
      <div className="animate-fade-in animation-delay-100">
        <DiaryList />
      </div>
    </div>
  );
}
