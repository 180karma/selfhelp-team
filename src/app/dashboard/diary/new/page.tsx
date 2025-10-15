import { NewDiaryForm } from '@/components/diary/new-diary-form';

export default function NewDiaryPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const title = searchParams?.title as string | undefined;
  const type = searchParams?.type as 'daily' | 'dream' | undefined;

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">New Diary Entry</h1>
      <NewDiaryForm presetTitle={title} presetType={type} />
    </div>
  );
}
