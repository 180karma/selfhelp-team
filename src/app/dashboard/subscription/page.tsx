import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SubscriptionPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">Subscription</h1>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Manage Your Plan</CardTitle>
          <CardDescription>
            Unlock advanced features and expanded use with our subscription plans. This section will be powered by Stripe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
