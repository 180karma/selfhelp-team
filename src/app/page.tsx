import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Header from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, BookHeart, UserCheck, BarChart3 } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');

  const features = [
    {
      icon: <BookHeart className="h-10 w-10 text-primary" />,
      title: 'Mindful Journaling',
      description: 'Record your thoughts, dreams, and gratitude. Our AI helps you find patterns and insights.',
    },
    {
      icon: <UserCheck className="h-10 w-10 text-primary" />,
      title: 'Personalized Assessments',
      description: 'Understand your attachment style, behavioral patterns, and more with our guided assessments.',
    },
    {
      icon: <Bot className="h-10 w-10 text-primary" />,
      title: 'AI Wellness Team',
      description: 'Chat with AI agents like a nutritionist, therapist, and fitness instructor for personalized advice.',
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-primary" />,
      title: 'Track Your Growth',
      description: 'Visualize your journey towards wellbeing and celebrate your progress along the way.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative h-[60vh] w-full">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
            <h1 className="font-headline text-4xl font-bold md:text-6xl">Welcome to ThriveWell</h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl">
              Your personalized path to mental wellness and self-discovery.
            </p>
            <div className="mt-8 flex gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="bg-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="font-headline mb-12 text-center text-3xl font-bold md:text-4xl">
              Features to Help You Thrive
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="text-center">
                  <CardHeader>
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      {feature.icon}
                    </div>
                    <CardTitle className="font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">Ready to start your journey?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Join ThriveWell today and take the first step towards a more balanced and fulfilling life.
            </p>
            <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/signup">Sign Up Now</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ThriveWell. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
