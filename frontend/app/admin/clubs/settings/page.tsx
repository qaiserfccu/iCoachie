import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClubSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Club Settings</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Global Club Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Settings for club onboarding, default permissions, and subscription tiers.</p>
        </CardContent>
      </Card>
    </div>
  );
}
