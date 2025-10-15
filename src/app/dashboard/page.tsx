import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">Welcome back!</h1>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">How are you feeling today?</CardTitle>
          <CardDescription>
            Take a moment to check in with yourself. A new journal entry can help.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/dashboard/diary/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Entry
            </Link>
          </Button>
        </CardContent>
      </Card>
      {/* Other dashboard widgets can be added here */}
    </div>
  );
}
