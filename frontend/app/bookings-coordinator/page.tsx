import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, ArrowRight, CheckCircle, Clock, AlertTriangle, Users } from "lucide-react"

const stats = [
  { title: "Active Tasks", value: "12", subtitle: "In progress", color: "from-blue-500 to-blue-600" },
  { title: "Completed", value: "45", subtitle: "This week", color: "from-green-500 to-green-600" },
  { title: "Pending", value: "8", subtitle: "Awaiting action", color: "from-yellow-500 to-orange-500" },
  { title: "Team", value: "6", subtitle: "Members active", color: "from-blue-500 to-blue-600" },
]

const recentTasks = [
  { name: "Task 1", status: "in-progress", priority: "high", assignee: "Team Member 1" },
  { name: "Task 2", status: "pending", priority: "medium", assignee: "Team Member 2" },
  { name: "Task 3", status: "completed", priority: "low", assignee: "Team Member 3" },
]

export default function BookingsCoordinatorDashboard() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bookings Dashboard</h1>
          <p className="text-muted-foreground">Manage Bookings operations and tasks</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <LayoutDashboard className="w-4 h-4 mr-2" />New Task
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="glass-card border-white/20 hover-lift">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Recent Tasks</CardTitle>
          <Button variant="ghost" size="sm">View All</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentTasks.map((task, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div><p className="font-medium">{task.name}</p><p className="text-sm text-muted-foreground">{task.assignee}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <Badge>{task.status}</Badge>
                <Button size="sm" variant="ghost"><ArrowRight className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
