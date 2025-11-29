import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, UserPlus, Calendar, FileText, Send } from "lucide-react"

const quickActions = [
  { icon: Plus, label: "New Session", color: "bg-primary text-primary-foreground hover:bg-primary/90" },
  { icon: UserPlus, label: "Add Member", color: "bg-secondary text-secondary-foreground hover:bg-secondary/90" },
  { icon: Calendar, label: "Schedule", color: "bg-chart-3/80 text-foreground hover:bg-chart-3/70" },
  { icon: FileText, label: "Report", color: "bg-chart-4/80 text-foreground hover:bg-chart-4/70" },
  { icon: Send, label: "Message", color: "bg-accent text-accent-foreground hover:bg-accent/90" },
]

export function QuickActionsWidget() {
  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="ghost"
              className={`h-auto py-4 flex flex-col items-center gap-2 ${action.color}`}
            >
              <action.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
