import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-all duration-300 shadow-sm">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2 group">
            <Logo className="h-7 w-7 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
            <span className="font-normal sm:inline-block font-headline text-lg tracking-normal bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
              ThriveWell
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-3">
          <Button asChild variant="ghost" className="font-medium">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="font-medium">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
