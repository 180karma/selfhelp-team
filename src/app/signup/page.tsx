import Link from 'next/link';
import { Logo } from '@/components/icons';
import { SignUpForm } from '@/components/auth/signup-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FirebaseClientProvider } from '@/firebase';

export default function SignUpPage() {
  return (
    <FirebaseClientProvider>
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="mb-6 flex items-center gap-2 text-2xl font-bold font-headline">
          <Logo className="h-8 w-8 text-primary" />
          <h1>ThriveWell</h1>
        </div>
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
            <CardDescription>Start your journey to wellness today</CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpForm />
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="underline">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </FirebaseClientProvider>
  );
}
