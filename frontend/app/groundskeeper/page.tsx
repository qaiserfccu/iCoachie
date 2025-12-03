import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trees, ArrowRight, Plus } from "lucide-react"
import { groundskeeperStats, groundskeeperRecentTasks, getStatusColor } from "@/lib/services/mockDataService"

export default function GroundskeeperDashboard() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Groundskeeper Dashboard</h1>
          <p className="text-muted-foreground">Manage daily turf maintenance, irrigation, and field care</p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <Plus className="w-4 h-4 mr-2" />Log Task
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {groundskeeperStats.map((stat) => (
          <Card key={stat.title} className="glass-card border-white/20 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-sm text-emerald-500 mt-1">{stat.change || stat.subtitle}</p>
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
            <CardTitle className="text-lg font-semibold">Today&apos;s Tasks</CardTitle>
            <Button variant="ghost" size="sm" className="text-emerald-500">View All</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {groundskeeperRecentTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Trees className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.field}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                    <Badge className={task.priority === "High" ? "bg-red-500/20 text-red-600 ml-2" : task.priority === "Medium" ? "bg-yellow-500/20 text-yellow-600 ml-2" : "bg-blue-500/20 text-blue-600 ml-2"}>{task.priority}</Badge>
                  </div>
                  <Button size="sm" variant="ghost" className="text-emerald-500">
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
              <Trees className="w-4 h-4 mr-2" />Daily Tasks
            </Button>
            <Button variant="outline" className="w-full justify-start glass-subtle border-white/20 bg-transparent">
              <Plus className="w-4 h-4 mr-2" />Irrigation Control
            </Button>
            <Button variant="outline" className="w-full justify-start glass-subtle border-white/20 bg-transparent">
              <ArrowRight className="w-4 h-4 mr-2" />Turf Management
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
