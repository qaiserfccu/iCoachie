import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FamilySettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Family Settings</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Family Account Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Settings for family accounts, parent portals, and student registrations.</p>
        </CardContent>
      </Card>
    </div>
  );
}
