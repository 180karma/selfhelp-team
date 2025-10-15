'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { agents } from '@/lib/agents';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleResetData = () => {
    try {
      // Clear diary entries
      localStorage.removeItem('diaryEntries');

      // Clear all notes
      localStorage.removeItem('thrivewell-notes');

      // Clear agent-specific assessments and profiles
      agents.forEach(agent => {
        localStorage.removeItem(`thrivewell-assessment-${agent.id}`);
        localStorage.removeItem(`thrivewell-profile-${agent.id}`);
      });
      
      toast({
        title: 'Data Cleared',
        description: 'All your local data has been successfully removed.',
      });

      // Optional: Redirect to dashboard after clearing data
      router.push('/dashboard');

    } catch (error) {
      console.error('Failed to clear local data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not clear all local data. Please try again.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">Settings</h1>
      
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="font-headline text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            These actions are irreversible. Please proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Reset All Data</h3>
              <p className="text-sm text-muted-foreground">
                This will permanently delete all your diary entries, AI profiles, notes, and assessment answers from this browser.
              </p>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Reset All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your application data stored in this browser, including diary entries, assessments, and AI-generated notes.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetData} className="bg-destructive hover:bg-destructive/90">
                    Yes, delete my data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
