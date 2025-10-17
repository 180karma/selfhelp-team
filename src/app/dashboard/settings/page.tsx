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
import { Trash2, UserX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { deleteUser } from 'firebase/auth';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();

  const handleResetData = () => {
    try {
      // Clear diary entries
      localStorage.removeItem('diaryEntries');

      // Clear all notes
      localStorage.removeItem('thrivewell-notes');
      
      // Clear all goals if user exists
      if (user) {
        localStorage.removeItem(`thrivewell-goals-${user.uid}`);
      }

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

  const handleDeleteAccount = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not Authenticated',
        description: 'You must be logged in to delete your account.',
      });
      return;
    }

    try {
      await deleteUser(user);
      toast({
        title: 'Account Deleted',
        description: 'Your account has been permanently deleted.',
      });
      router.push('/'); // Redirect to homepage after deletion
    } catch (error: any) {
      console.error('Failed to delete account:', error);
      let description = 'An error occurred while deleting your account.';
      if (error.code === 'auth/requires-recent-login') {
        description = 'This is a sensitive operation. Please log out and log back in before deleting your account.';
      }
      toast({
        variant: 'destructive',
        title: 'Deletion Failed',
        description: description,
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
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Reset All Data</h3>
              <p className="text-sm text-muted-foreground">
                This will permanently delete all your diary entries, goals, AI profiles, notes, and assessment answers from this browser.
              </p>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="shrink-0">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Reset All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your application data stored in this browser, including diary entries, goals, assessments, and AI-generated notes.
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

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Delete Account</h3>
              <p className="text-sm text-muted-foreground">
                This will permanently delete your account and all associated data from our servers.
              </p>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="shrink-0">
                  <UserX className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to delete your account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action is permanent and cannot be undone. All your data, including your profile, diary entries, and goals will be permanently removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                    Yes, delete my account
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
