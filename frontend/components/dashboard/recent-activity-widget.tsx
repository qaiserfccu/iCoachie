import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, CreditCard, Calendar, Award } from "lucide-react"

const activities = [
  {
    icon: UserPlus,
    title: "New member joined",
    description: "Emma Wilson registered",
    time: "2 min ago",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: CreditCard,
    title: "Payment received",
    description: "$150 from M. Brown",
    time: "1 hour ago",
    color: "bg-chart-3/20 text-chart-3",
  },
  {
    icon: Calendar,
    title: "Session completed",
    description: "Junior Soccer Training",
    time: "3 hours ago",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: Award,
    title: "Achievement unlocked",
    description: "Sarah earned Gold Badge",
    time: "5 hours ago",
    color: "bg-accent/20 text-accent-foreground",
  },
]

export function RecentActivityWidget() {
  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${activity.color}`}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground">{activity.title}</p>
              <p className="text-xs text-muted-foreground">{activity.description}</p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
