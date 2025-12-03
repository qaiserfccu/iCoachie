"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  ArrowRight,
  AlertTriangle,
  Users,
  Building2,
  UserCog,
  CreditCard,
  Loader2,
} from "lucide-react"
import { adminService, type AdminStat, type PendingAction, type Activity, type TopClub, type SystemHealth } from "@/lib/services/adminService"

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  Building2,
  UserCog,
  CreditCard,
  AlertTriangle,
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStat[]>([])
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [topClubs, setTopClubs] = useState<TopClub[]>([])
  const [systemHealth, setSystemHealth] = useState<{ overallStatus: string; systems: SystemHealth[] }>({
    overallStatus: 'Loading...',
    systems: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true)
      setError(null)
      
      try {
        const [statsData, pendingData, activitiesData, clubsData, healthData] = await Promise.all([
          adminService.getStats(),
          adminService.getPendingActions(),
          adminService.getRecentActivities(),
          adminService.getTopClubs(),
          adminService.getSystemHealth(),
        ])
        
        setStats(statsData)
        setPendingActions(pendingData)
        setActivities(activitiesData)
        setTopClubs(clubsData)
        setSystemHealth(healthData)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-destructive" />
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and management</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
            Download Report
          </Button>
          <Button className="gradient-primary text-white">View Analytics</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const IconComponent = iconMap[stat.icon] || Users
          return (
            <Card key={stat.title} className="glass-card border-white/20 hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className={stat.trend === "up" ? "text-green-500 text-sm" : "text-red-500 text-sm"}>
                        {stat.change}
                      </span>
                      <span className="text-muted-foreground text-sm">vs last month</span>
                    </div>
                  </div>
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                  >
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Actions */}
        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Pending Actions</CardTitle>
            <Badge variant="secondary" className="bg-red-500/20 text-red-600">
              {pendingActions.reduce((acc, item) => acc + item.count, 0)} Total
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingActions.map((item) => {
              const IconComponent = iconMap[item.icon] || AlertTriangle
              return (
                <div
                  key={item.type}
                  className="flex items-center justify-between p-3 rounded-xl glass-subtle hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center ${item.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/20 text-primary">{item.count}</Badge>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`/.jpg?height=40&width=40&query=${activity.user} avatar`} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-sm">
                    {activity.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    activity.type === "club"
                      ? "border-blue-500/50 text-blue-500"
                      : activity.type === "coach"
                        ? "border-teal-500/50 text-teal-500"
                        : activity.type === "payment"
                          ? "border-yellow-500/50 text-yellow-600"
                          : "border-green-500/50 text-green-500"
                  }
                >
                  {activity.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Top Clubs & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Top Performing Clubs</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topClubs.map((club, index) => (
                <div key={club.name} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{club.name}</p>
                    <p className="text-xs text-muted-foreground">{club.members} members</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{club.revenue}</p>
                    <p className="text-xs text-green-500">{club.growth}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">System Health</CardTitle>
            <Badge className="bg-green-500/20 text-green-600">{systemHealth.overallStatus}</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.systems.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-xl glass-subtle">
                  <div className="flex items-center gap-3">
                    {item.status === "good" ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    )}
                    <span>{item.name}</span>
                  </div>
                  <span
                    className={item.status === "good" ? "text-green-500 font-medium" : "text-yellow-500 font-medium"}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
