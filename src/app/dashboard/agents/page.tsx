import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">AI Wellness Team</h1>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Meet Your Agents</CardTitle>
          <CardDescription>
            Here you will be able to interact with your personal AI wellness team, including a nutritionist, psychologist, therapist, and more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
