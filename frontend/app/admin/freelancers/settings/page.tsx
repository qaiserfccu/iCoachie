import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FreelancerSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Freelancer Settings</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Global settings for freelancer onboarding and commissions will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
