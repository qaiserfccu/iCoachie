"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Calendar, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useEffect, useState } from "react"
import { dashboardService, DashboardStats } from "@/lib/services"

export function StatsCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const dashboardStats = await dashboardService.getDashboardStats()
        setStats(dashboardStats)
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        // Fallback to default values
        setStats({
          totalMembers: 0,
          sessionsThisWeek: 0,
          revenueMTD: 0,
          attendanceRate: 0,
          memberChange: 0,
          sessionChange: 0,
          revenueChange: 0,
          attendanceChange: 0
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Total Members",
      value: loading ? "..." : stats?.totalMembers.toLocaleString() || "0",
      change: loading ? "0%" : `${stats?.memberChange > 0 ? '+' : ''}${stats?.memberChange || 0}%`,
      trend: (stats?.memberChange || 0) >= 0 ? "up" : "down",
      icon: Users,
      gradient: "from-blue-500/20 to-blue-600/10",
      iconColor: "text-blue-600",
    },
    {
      title: "Sessions This Week",
      value: loading ? "..." : (stats?.sessionsThisWeek || 0).toString(),
      change: loading ? "0%" : `${stats?.sessionChange > 0 ? '+' : ''}${stats?.sessionChange || 0}%`,
      trend: (stats?.sessionChange || 0) >= 0 ? "up" : "down",
      icon: Calendar,
      gradient: "from-teal-500/20 to-teal-600/10",
      iconColor: "text-teal-600",
    },
    {
      title: "Revenue (MTD)",
      value: loading ? "..." : `$${(stats?.revenueMTD || 0).toLocaleString()}`,
      change: loading ? "0%" : `${stats?.revenueChange > 0 ? '+' : ''}${stats?.revenueChange || 0}%`,
      trend: (stats?.revenueChange || 0) >= 0 ? "up" : "down",
      icon: DollarSign,
      gradient: "from-yellow-500/20 to-yellow-600/10",
      iconColor: "text-yellow-600",
    },
    {
      title: "Attendance Rate",
      value: loading ? "..." : `${stats?.attendanceRate || 0}%`,
      change: loading ? "0%" : `${stats?.attendanceChange > 0 ? '+' : ''}${stats?.attendanceChange || 0}%`,
      trend: (stats?.attendanceChange || 0) >= 0 ? "up" : "down",
      icon: TrendingUp,
      gradient: "from-green-500/20 to-green-600/10",
      iconColor: "text-green-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <Card key={stat.title} className="glass-card border-white/30 hover-lift">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === "up" ? "text-green-600" : "text-destructive"
                }`}
              >
                {stat.change}
                {stat.trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
