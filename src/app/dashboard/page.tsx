'use client';

import { GoalManager } from '@/components/goals/goal-manager';
import { useUser } from '@/firebase';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { user } = useUser();
  const [userName, setUserName] = useState<string>('friend');

  useEffect(() => {
    if (user) {
      // Get name from Firebase displayName or localStorage
      if (user.displayName) {
        setUserName(user.displayName.split(' ')[0]);
      } else {
        const storedName = localStorage.getItem('thrivewell-user-name');
        if (storedName) {
          setUserName(storedName);
        }
      }
    }
  }, [user]);

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
