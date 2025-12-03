import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowRight, Plus } from "lucide-react"
import { securityStats, securityRecentTasks, getStatusColor } from "@/lib/services/mockDataService"

export default function SecurityDashboard() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Security Dashboard</h1>
          <p className="text-muted-foreground">Monitor access control, incidents, and patrol activities</p>
        </div>
        <Button className="bg-gradient-to-r from-slate-500 to-slate-600 text-white">
          <Plus className="w-4 h-4 mr-2" />Report Incident
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {securityStats.map((stat) => (
          <Card key={stat.title} className="glass-card border-white/20 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-sm text-slate-400 mt-1">{stat.change || stat.subtitle}</p>
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
            <CardTitle className="text-lg font-semibold">Security Tasks</CardTitle>
            <Button variant="ghost" size="sm" className="text-slate-400">View All</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {securityRecentTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-500/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.location} • {task.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                    <Badge className={task.priority === "High" ? "bg-red-500/20 text-red-600 ml-2" : "bg-blue-500/20 text-blue-600 ml-2"}>{task.priority}</Badge>
                  </div>
                  <Button size="sm" variant="ghost" className="text-slate-400">
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
              <Shield className="w-4 h-4 mr-2" />View Patrol Logs
            </Button>
            <Button variant="outline" className="w-full justify-start glass-subtle border-white/20 bg-transparent">
              <Plus className="w-4 h-4 mr-2" />Access Control
            </Button>
            <Button variant="outline" className="w-full justify-start glass-subtle border-white/20 bg-transparent">
              <ArrowRight className="w-4 h-4 mr-2" />Visitor Screening
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
