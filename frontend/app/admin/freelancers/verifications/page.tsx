import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FreelancerVerificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Freelancer Verifications</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pending Verifications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">List of freelancers awaiting document verification will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
