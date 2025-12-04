import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function FacilitiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Facilities Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Facility
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Main Pitch</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Status: Active</p>
            <p className="text-sm text-muted-foreground">Type: Outdoor</p>
          </CardContent>
        </Card>
        {/* More facility cards would be mapped here */}
      </div>
    </div>
  );
}
