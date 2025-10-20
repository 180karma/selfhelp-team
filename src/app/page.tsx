
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import Header from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookHeart, UserCheck, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const slideshowImages = [
  "https://images.pexels.com/photos/1387037/pexels-photo-1387037.jpeg",
  "https://images.pexels.com/photos/1153369/pexels-photo-1153369.jpeg",
  "https://images.pexels.com/photos/3363111/pexels-photo-3363111.jpeg",
  "https://images.pexels.com/photos/5699431/pexels-photo-5699431.jpeg",
  "https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg",
  "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg",
  "https://images.pexels.com/photos/863977/pexels-photo-863977.jpeg",
  "https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg"
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slideshowImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <BookHeart className="h-10 w-10 text-white" />,
      title: 'Mindful Journaling',
      description: 'Record your thoughts, dreams, and gratitude. Our AI helps you find patterns and insights.',
      image: 'https://images.pexels.com/photos/3363111/pexels-photo-3363111.jpeg',
      hint: 'journal writing',
    },
    {
      icon: <UserCheck className="h-10 w-10 text-white" />,
      title: 'Personalized Assessments',
      description: 'Understand your attachment style, behavioral patterns, and more with our guided assessments.',
      image: 'https://images.pexels.com/photos/5699431/pexels-photo-5699431.jpeg',
      hint: 'personal growth',
    },
    {
      icon: <Users className="h-10 w-10 text-white" />,
      title: 'AI Wellness Team',
      description: 'Chat with AI agents like a nutritionist, therapist, and fitness instructor for personalized advice.',
      image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg',
      hint: 'team collaboration',
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-white" />,
      title: 'Track Your Growth',
      description: 'Visualize your journey towards wellbeing and celebrate your progress along the way.',
      image: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg',
      hint: 'growth chart',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative h-[60vh] w-full overflow-hidden">
          {slideshowImages.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt={`Slideshow image ${index + 1}`}
              fill
              className={cn(
                "object-cover transition-opacity duration-1000 ease-in-out",
                index === currentIndex ? "opacity-100 z-10 scale-105" : "opacity-0 z-0 scale-100"
              )}
              style={{
                transition: 'opacity 1s ease-in-out, transform 6s ease-in-out',
              }}
              priority={index === 0}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 z-20" />
          <div className="relative z-30 flex h-full flex-col items-center justify-center text-center text-white px-4">
            <h1 className="font-headline text-4xl font-normal md:text-6xl lg:text-7xl animate-fade-in tracking-normal">
              Welcome to <span className="bg-gradient-to-r from-sky-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent animate-gradient-shift" style={{backgroundSize: '200% 200%'}}>ThriveWell</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg md:text-xl lg:text-2xl font-light animate-fade-in animation-delay-200 opacity-0" style={{animationFillMode: 'forwards'}}>
              Your personalized path to mental wellness and self-discovery.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in animation-delay-400 opacity-0 w-full sm:w-auto max-w-md sm:max-w-none" style={{animationFillMode: 'forwards'}}>
              <Button asChild size="lg" className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white border-0 shadow-2xl hover:shadow-blue-400/50 w-full sm:w-auto">
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="glass text-white border-white/20 hover:bg-white/20 w-full sm:w-auto">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="bg-background py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-sky-100/30 to-transparent pointer-events-none" />
          <div className="container mx-auto px-4 relative">
            <h2 className="font-headline mb-4 text-center text-3xl font-normal md:text-4xl lg:text-5xl tracking-normal animate-fade-in">
              Features to Help You <span className="text-primary">Thrive</span>
            </h2>
            <p className="text-center text-muted-foreground mb-12 text-lg font-light animate-fade-in animation-delay-100">
              Comprehensive tools designed for your wellness journey
            </p>
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <Card 
                  key={feature.title} 
                  className="text-center group opacity-0 animate-scale-in overflow-hidden relative"
                  style={{
                    animationDelay: `${(index + 1) * 100}ms`,
                    animationFillMode: 'forwards'
                  }}
                >
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={600}
                    height={400}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    data-ai-hint={feature.hint}
                  />
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors duration-300" />
                  <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-white">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                      <div className="transition-transform duration-300 group-hover:scale-110">
                        {feature.icon}
                      </div>
                    </div>
                    <CardTitle className="font-headline text-xl font-normal text-white">{feature.title}</CardTitle>
                    <p className="text-white/80 font-light leading-relaxed mt-2">{feature.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-100/40 via-blue-100/30 to-cyan-100/40 animate-gradient-shift" style={{backgroundSize: '200% 200%'}} />
          <div className="container mx-auto px-4 text-center relative">
            <h2 className="font-headline text-3xl font-normal md:text-4xl lg:text-5xl tracking-normal animate-fade-in">
              Ready to start your <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">journey</span>?
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-light animate-fade-in animation-delay-100">
              Join ThriveWell today and take the first step towards a more balanced and fulfilling life.
            </p>
            <Button 
              asChild 
              size="lg" 
              className="mt-10 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white border-0 shadow-2xl hover:shadow-sky-400/50 animate-fade-in animation-delay-200 text-base md:text-lg px-10"
            >
              <Link href="/signup">Sign Up Now</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm font-light">&copy; {new Date().getFullYear()} ThriveWell. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
