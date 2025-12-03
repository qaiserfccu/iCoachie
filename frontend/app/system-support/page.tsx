"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Headphones,
  Activity,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Server,
  Database,
  Wifi,
  Loader2,
} from "lucide-react"
import { useEffect, useState } from "react"
import { systemSupportService, type Ticket, type SystemStatus } from "@/lib/services"
import Link from "next/link"

const iconMap: Record<string, React.ElementType> = {
  Headphones,
  Clock,
  CheckCircle,
  Users,
}

const priorityColors = {
  urgent: "bg-red-500/20 text-red-500",
  high: "bg-orange-500/20 text-orange-500",
  medium: "bg-yellow-500/20 text-yellow-600",
  low: "bg-green-500/20 text-green-500",
}

const statusColors = {
  open: "bg-blue-500/20 text-blue-500",
  "in-progress": "bg-purple-500/20 text-purple-500",
  resolved: "bg-green-500/20 text-green-500",
  closed: "bg-gray-500/20 text-gray-500",
}

interface DashboardStat {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: string
  color: string
}

interface Infrastructure {
  servers: { total: number; healthy: number; status: string }
  databases: { total: number; healthy: number; status: string }
  cdnNodes: { total: number; healthy: number; status: string }
}

export default function SystemSupportDashboard() {
  const [stats, setStats] = useState<DashboardStat[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([])
  const [infrastructure, setInfrastructure] = useState<Infrastructure | null>(null)
  const [overallStatus, setOverallStatus] = useState<string>("Loading...")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [dashboardData, ticketsData, diagnosticsData] = await Promise.all([
          systemSupportService.getDashboardStats(),
          systemSupportService.getTickets({ pageSize: 4 }),
          systemSupportService.getDiagnostics()
        ])

        setStats(dashboardData.stats)
        setTickets(ticketsData.tickets)
        setSystemStatus(diagnosticsData.systemStatus)
        setInfrastructure(diagnosticsData.infrastructure)
        setOverallStatus(diagnosticsData.overallStatus)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data. Using fallback data.')
        // Fallback to static data
        setStats([
          {
            title: "Open Tickets",
            value: "24",
            change: "-5 since yesterday",
            trend: "down",
            icon: "Headphones",
            color: "from-purple-500 to-indigo-500",
          },
          {
            title: "Avg Response Time",
            value: "12 min",
            change: "Target: 15 min",
            trend: "up",
            icon: "Clock",
            color: "from-blue-500 to-blue-600",
          },
          {
            title: "Resolved Today",
            value: "38",
            change: "+12 from yesterday",
            trend: "up",
            icon: "CheckCircle",
            color: "from-green-500 to-green-600",
          },
          {
            title: "Active Users",
            value: "1,847",
            change: "Online now",
            trend: "up",
            icon: "Users",
            color: "from-teal-500 to-teal-600",
          },
        ])
        setTickets([
          { id: "TKT-1234", user: "John Smith", email: "", issue: "Cannot login to account", priority: "high", status: "open", time: "5 min ago", avatar: "JS", category: "technical", responses: 2, createdAt: "" },
          { id: "TKT-1233", user: "Sarah Wilson", email: "", issue: "Payment processing failed", priority: "urgent", status: "in-progress", time: "15 min ago", avatar: "SW", category: "billing", responses: 5, createdAt: "" },
          { id: "TKT-1232", user: "Mike Johnson", email: "", issue: "Session booking not showing", priority: "medium", status: "open", time: "32 min ago", avatar: "MJ", category: "technical", responses: 1, createdAt: "" },
          { id: "TKT-1231", user: "Elite Sports Academy", email: "", issue: "Bulk user import failing", priority: "high", status: "open", time: "1 hour ago", avatar: "ES", category: "technical", responses: 3, createdAt: "" },
        ])
        setSystemStatus([
          { name: "API Server", status: "operational", latency: "45ms" },
          { name: "Database", status: "operational", latency: "12ms" },
          { name: "Payment Gateway", status: "operational", latency: "89ms" },
          { name: "Email Service", status: "degraded", latency: "450ms" },
          { name: "File Storage", status: "operational", latency: "23ms" },
        ])
        setInfrastructure({
          servers: { total: 12, healthy: 12, status: "All Healthy" },
          databases: { total: 3, healthy: 3, status: "Replicated" },
          cdnNodes: { total: 8, healthy: 8, status: "Active" }
        })
        setOverallStatus("All Systems Operational")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Support Dashboard</h1>
          <p className="text-muted-foreground">System diagnostics and user support</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/system-support/diagnostics">
            <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
              View Logs
            </Button>
          </Link>
          <Link href="/system-support/diagnostics/performance">
            <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
              <Activity className="w-4 h-4 mr-2" />
              Run Diagnostics
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-yellow-500/20 text-yellow-600 text-sm">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const IconComponent = iconMap[stat.icon] || Headphones
          return (
            <Card key={stat.title} className="glass-card border-white/20 hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className="text-sm text-purple-500 mt-1">{stat.change}</p>
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
        {/* Recent Tickets */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Tickets</CardTitle>
            <Link href="/system-support/tickets">
              <Button variant="ghost" size="sm" className="text-purple-500">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white text-sm">
                      {ticket.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{ticket.id}</span>
                      <Badge className={priorityColors[ticket.priority as keyof typeof priorityColors]}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{ticket.issue}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {ticket.user} • {ticket.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={statusColors[ticket.status as keyof typeof statusColors]}>{ticket.status}</Badge>
                  <Link href={`/system-support/tickets/${ticket.id}`}>
                    <Button size="sm" variant="ghost" className="text-purple-500">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">System Status</CardTitle>
            <Badge className={overallStatus.includes('Operational') ? "bg-green-500/20 text-green-600" : "bg-yellow-500/20 text-yellow-600"}>
              {overallStatus}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemStatus.map((system) => (
              <div key={system.name} className="flex items-center justify-between p-3 rounded-xl glass-subtle">
                <div className="flex items-center gap-3">
                  {system.status === "operational" ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  )}
                  <span className="font-medium">{system.name}</span>
                </div>
                <div className="text-right">
                  <span
                    className={`text-sm font-medium ${system.status === "operational" ? "text-green-500" : "text-yellow-500"}`}
                  >
                    {system.latency}
                  </span>
                  <p className="text-xs text-muted-foreground capitalize">{system.status}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "Reset User Password", icon: Users, color: "text-purple-500", href: "/system-support/users/passwords" },
              { label: "View System Logs", icon: Activity, color: "text-blue-500", href: "/system-support/diagnostics" },
              { label: "Check Database", icon: Database, color: "text-green-500", href: "/system-support/diagnostics/performance" },
              { label: "Test Connectivity", icon: Wifi, color: "text-teal-500", href: "/system-support/diagnostics" },
            ].map((action) => (
              <Link key={action.label} href={action.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-between glass-subtle hover:bg-white/20"
                >
                  <span className="flex items-center gap-3">
                    <action.icon className={`w-5 h-5 ${action.color}`} />
                    {action.label}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Infrastructure Overview</CardTitle>
            <Link href="/system-support/reports">
              <Button variant="ghost" size="sm" className="text-purple-500">
                Full Report
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {infrastructure && [
                { icon: Server, label: "Servers", value: `${infrastructure.servers.healthy}/${infrastructure.servers.total}`, status: infrastructure.servers.status },
                { icon: Database, label: "Databases", value: `${infrastructure.databases.healthy}/${infrastructure.databases.total}`, status: infrastructure.databases.status },
                { icon: Wifi, label: "CDN Nodes", value: `${infrastructure.cdnNodes.healthy}/${infrastructure.cdnNodes.total}`, status: infrastructure.cdnNodes.status },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-xl glass-subtle text-center">
                  <item.icon className="w-8 h-8 mx-auto text-purple-500 mb-2" />
                  <p className="font-bold text-xl">{item.value}</p>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-xs text-green-500 mt-1">{item.status}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
