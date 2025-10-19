import Link from 'next/link';
import { Logo } from '@/components/icons';
import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FirebaseClientProvider } from '@/firebase';

export default function LoginPage() {
  return (
    <FirebaseClientProvider>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDE2YzAtMS4xLjktMiAyLTJzMiAuOSAyIDItLjkgMi0yIDItMi0uOS0yLTJ6bTAtNGMwLTEuMS45LTIgMi0yczIgLjkgMiAyLS45IDItMiAyLTItLjktMi0yem0tNCA0YzAtMS4xLjktMiAyLTJzMiAuOSAyIDItLjkgMi0yIDItMi0uOS0yLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="mb-8 flex items-center gap-2 text-2xl font-normal font-headline animate-fade-in">
          <Logo className="h-8 w-8 text-primary animate-float" />
          <h1 className="bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">ThriveWell</h1>
        </div>
        <Card className="w-full max-w-sm animate-scale-in shadow-2xl border-sky-200/50 hover:border-sky-300/70">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl tracking-normal font-normal">Welcome Back</CardTitle>
            <CardDescription className="text-base font-light">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <div className="mt-6 text-center text-sm font-light">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-primary hover:underline font-medium transition-all duration-300 hover:text-primary/80">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </FirebaseClientProvider>
  );
}
