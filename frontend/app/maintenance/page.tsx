"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Wrench, ArrowRight, Plus, CheckCircle, Calendar as CalendarIcon, AlertTriangle } from "lucide-react"
import { facilityService, type MaintenanceDashboardStats } from "@/lib/services"

// Loading skeleton component
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="w-14 h-14 rounded-2xl" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function TasksSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between p-4 rounded-xl glass-subtle">
          <div className="flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  )
}

export default function MaintenanceDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<MaintenanceDashboardStats | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)

        const dashboardStats = await facilityService.getMaintenanceDashboardStats()
        setStats(dashboardStats)
      } catch (err) {
        console.error("Failed to load maintenance data:", err)
        setError("Failed to load maintenance data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Convert stats to display format
  const displayStats = stats ? [
    { title: "Open Work Orders", value: String(stats.openWorkOrders), change: "+3", icon: Wrench, color: "from-blue-500 to-blue-600" },
    { title: "Completed Today", value: String(stats.completedToday), subtitle: "Tasks", icon: CheckCircle, color: "from-green-500 to-green-600" },
    { title: "Equipment Issues", value: String(stats.equipmentIssues), change: "-2", icon: AlertTriangle, color: "from-yellow-500 to-orange-500" },
    { title: "Scheduled", value: String(stats.scheduledTasks), subtitle: "This week", icon: CalendarIcon, color: "from-purple-500 to-purple-600" },
  ] : []

  // TODO: Replace with real maintenance tasks from backend when endpoint is available
  const maintenanceTasks = [
    { title: "Pool Filter Replacement", location: "Pool A", priority: "High", assignee: "Mike Tech", dueDate: "Today", status: "In Progress" },
    { title: "Court Lighting Repair", location: "Court 2", priority: "Medium", assignee: "John Maint", dueDate: "Tomorrow", status: "Pending" },
    { title: "HVAC Maintenance", location: "Gym", priority: "Low", assignee: "Sarah Fix", dueDate: "Dec 5", status: "Scheduled" },
  ]

  if (error) {
    return (
      <div className="p-6">
        <Card className="glass-card border-white/20">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">{error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Maintenance Dashboard</h1>
          <p className="text-muted-foreground">Manage work orders, equipment maintenance, and facility repairs</p>
        </div>
        <Button className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
          <Plus className="w-4 h-4 mr-2" />New Work Order
        </Button>
      </div>

      {loading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayStats.map((stat) => (
            <Card key={stat.title} className="glass-card border-white/20 hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className="text-sm text-amber-500 mt-1">{stat.change || stat.subtitle}</p>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Active Work Orders</CardTitle>
            <Button variant="ghost" size="sm" className="text-amber-500">View All</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <TasksSkeleton />
            ) : (
              maintenanceTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <Wrench className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.location} • {task.assignee}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <Badge className={task.priority === "High" ? "bg-red-500/20 text-red-600" : task.priority === "Medium" ? "bg-yellow-500/20 text-yellow-600" : "bg-blue-500/20 text-blue-600"}>{task.priority}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">Due: {task.dueDate}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="text-amber-500">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start glass-subtle border-white/20 bg-transparent">
              <Wrench className="w-4 h-4 mr-2" />View Work Orders
            </Button>
            <Button variant="outline" className="w-full justify-start glass-subtle border-white/20 bg-transparent">
              <Plus className="w-4 h-4 mr-2" />Report Issue
            </Button>
            <Button variant="outline" className="w-full justify-start glass-subtle border-white/20 bg-transparent">
              <ArrowRight className="w-4 h-4 mr-2" />View Inventory
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
