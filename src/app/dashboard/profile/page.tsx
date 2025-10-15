import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">My Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Psychological Assessment</CardTitle>
          <CardDescription>
            This section will contain assessments for trauma, attachment style, behavioral patterns, and more to personalize your experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
