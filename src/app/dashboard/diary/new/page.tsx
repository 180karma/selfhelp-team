import { NewDiaryForm } from '@/components/diary/new-diary-form';

export default function NewDiaryPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">New Diary Entry</h1>
      <NewDiaryForm />
    </div>
  );
}
