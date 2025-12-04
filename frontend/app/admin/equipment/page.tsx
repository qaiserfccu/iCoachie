import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function EquipmentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Equipment Inventory</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Equipment
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Inventory List</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">List of available equipment and current bookings will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
