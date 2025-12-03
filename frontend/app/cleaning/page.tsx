import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, ArrowRight, Plus } from "lucide-react"
import { cleaningStats, cleaningRecentTasks, getStatusColor } from "@/lib/services/mockDataService"

export default function CleaningDashboard() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cleaning Staff Dashboard</h1>
          <p className="text-muted-foreground">Manage cleaning schedules, tasks, and supply inventory</p>
        </div>
        <Button className="bg-gradient-to-r from-sky-500 to-sky-600 text-white">
          <Plus className="w-4 h-4 mr-2" />New Task
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cleaningStats.map((stat) => (
          <Card key={stat.title} className="glass-card border-white/20 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-sm text-sky-500 mt-1">{stat.change || stat.subtitle}</p>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Cleaning Tasks</CardTitle>
            <Button variant="ghost" size="sm" className="text-sky-500">View All</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {cleaningRecentTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-sky-500" />
                  </div>
                  <div>
                    <p className="font-medium">{task.area}</p>
                    <p className="text-sm text-muted-foreground">{task.type} • {task.assignee}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">{task.time}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="text-sky-500">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start glass-subtle border-white/20 bg-transparent">
              <Sparkles className="w-4 h-4 mr-2" />View Schedule
            </Button>
            <Button variant="outline" className="w-full justify-start glass-subtle border-white/20 bg-transparent">
              <Plus className="w-4 h-4 mr-2" />Report Issue
            </Button>
            <Button variant="outline" className="w-full justify-start glass-subtle border-white/20 bg-transparent">
              <ArrowRight className="w-4 h-4 mr-2" />Supplies Inventory
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
