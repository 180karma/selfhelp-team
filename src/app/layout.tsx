import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Poppins, Slabo_27px } from 'next/font/google';
import { cn } from '@/lib/utils';

const fontBody = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
});

const fontHeadline = Slabo_27px({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-headline',
});

export const metadata: Metadata = {
  title: 'ThriveWell',
  description: 'Your personal wellness companion',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('font-body antialiased', fontBody.variable, fontHeadline.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
