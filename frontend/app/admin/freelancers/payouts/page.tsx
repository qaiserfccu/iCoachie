import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FreelancerPayoutsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Freelancer Payouts</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">History of payouts to freelancers will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
