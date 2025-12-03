"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Trees, ArrowRight, Plus, ClipboardList, CheckCircle, Droplets, Thermometer, AlertTriangle } from "lucide-react"
import { facilityService, type GroundskeeperDashboardStats, type Ground } from "@/lib/services"
import { getStatusColor } from "@/lib/services/mockDataService"

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

export default function GroundskeeperDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<GroundskeeperDashboardStats | null>(null)
  const [grounds, setGrounds] = useState<Ground[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)

        // Load dashboard stats and facilities
        const [dashboardStats, facilitiesResponse] = await Promise.all([
          facilityService.getGroundskeeperDashboardStats(),
          facilityService.getFacilities({ pageSize: 10 })
        ])

        setStats(dashboardStats)

        // Load grounds from all facilities
        const allGrounds: Ground[] = []
        for (const facility of facilitiesResponse.data.slice(0, 3)) {
          const groundsResponse = await facilityService.getGrounds(facility.id, { pageSize: 5 })
          allGrounds.push(...groundsResponse.data)
        }
        setGrounds(allGrounds.slice(0, 5))
      } catch (err) {
        console.error("Failed to load groundskeeper data:", err)
        setError("Failed to load groundskeeper data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Convert stats to display format
  const displayStats = stats ? [
    { title: "Tasks Today", value: String(stats.tasksToday), change: `${stats.tasksCompleted} completed`, icon: ClipboardList, color: "from-green-500 to-green-600" },
    { title: "Fields Status", value: stats.fieldsStatus, subtitle: "All fields", icon: CheckCircle, color: "from-blue-500 to-blue-600" },
    { title: "Irrigation", value: "Active", subtitle: `${stats.irrigationZones} zones`, icon: Droplets, color: "from-cyan-500 to-cyan-600" },
    { title: "Weather Alert", value: stats.weatherAlert, subtitle: "Next 3 days", icon: Thermometer, color: "from-yellow-500 to-orange-500" },
  ] : []

  // Tasks for groundskeeper (derived from grounds data)
  const groundTasks = grounds.length > 0 ? grounds.map(ground => ({
    title: `Check ${ground.name}`,
    field: ground.name,
    priority: ground.isAvailable ? "Normal" : "High",
    status: ground.isAvailable ? "Completed" : "In Progress",
    assignee: "Self"
  })) : [
    { title: "Turf Mowing", field: "Main Stadium", priority: "High", status: "Completed", assignee: "Self" },
    { title: "Irrigation Check", field: "All Fields", priority: "Normal", status: "In Progress", assignee: "Self" },
    { title: "Fertilizer Application", field: "Training Pitch", priority: "Medium", status: "Pending", assignee: "Self" },
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
          <h1 className="text-2xl font-bold text-foreground">Groundskeeper Dashboard</h1>
          <p className="text-muted-foreground">Manage daily turf maintenance, irrigation, and field care</p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <Plus className="w-4 h-4 mr-2" />Log Task
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
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Today&apos;s Tasks</CardTitle>
            <Button variant="ghost" size="sm" className="text-emerald-500">View All</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <TasksSkeleton />
            ) : (
              groundTasks.map((task, index) => (
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
