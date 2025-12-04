import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Maintenance Tasks</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Task
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Pitch Resurfacing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Priority: High</p>
            <p className="text-sm text-muted-foreground">Status: Pending</p>
            <p className="text-sm text-muted-foreground">Assigned to: Ground Staff</p>
          </CardContent>
        </Card>
        {/* More task cards would be mapped here */}
      </div>
    </div>
  );
}
