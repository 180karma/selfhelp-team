'use client';

import { GoalManager } from '@/components/goals/goal-manager';
import { useUser } from '@/firebase';

export default function DashboardPage() {
  const { user } = useUser();
  const userName = user?.displayName?.split(' ')[0] || 'there';

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">Welcome back, {userName}!</h1>
      <p className="text-muted-foreground">
        Here's a look at your goals. Your AI wellness team can help you add tasks and objectives.
      </p>
      <GoalManager />
    </div>
  );
}
