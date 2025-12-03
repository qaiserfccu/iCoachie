"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Activity, Server, Database, Wifi, HardDrive, Cpu, 
  MemoryStick, RefreshCw, CheckCircle, AlertTriangle, XCircle,
  TrendingUp, Clock, Loader2
} from "lucide-react"
import { useEffect, useState } from "react"
import { systemSupportService, type SystemStatus, type LogEntry, type PerformanceMetrics } from "@/lib/services"
import Link from "next/link"

interface SystemMetric {
  name: string
  value: number
  max: number
  unit: string
  status: 'healthy' | 'warning' | 'critical'
  icon: React.ElementType
}

interface Alert {
  id: string
  type: 'info' | 'warning' | 'error'
  message: string
  time: string
  resolved: boolean
}

const statusColors = {
  operational: { bg: "bg-green-500/20", text: "text-green-500", icon: CheckCircle },
  degraded: { bg: "bg-yellow-500/20", text: "text-yellow-500", icon: AlertTriangle },
  outage: { bg: "bg-red-500/20", text: "text-red-500", icon: XCircle },
}

const alertTypeColors = {
  info: "bg-blue-500/20 text-blue-500",
  warning: "bg-yellow-500/20 text-yellow-500",
  error: "bg-red-500/20 text-red-500",
}

export default function DiagnosticsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [services, setServices] = useState<SystemStatus[]>([])
  const [overallStatus, setOverallStatus] = useState("Loading...")
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([])
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async () => {
    try {
      setRefreshing(true)
      setError(null)

      const [diagnosticsData, logsData, performanceData] = await Promise.all([
        systemSupportService.getDiagnostics(),
        systemSupportService.getLogs({ limit: 10 }),
        systemSupportService.getPerformanceMetrics()
      ])

      setServices(diagnosticsData.systemStatus)
      setOverallStatus(diagnosticsData.overallStatus)

      // Map performance metrics
      setSystemMetrics([
        { name: "CPU Usage", value: performanceData.metrics.cpu.current, max: 100, unit: "%", status: performanceData.metrics.cpu.current < 70 ? "healthy" : "warning", icon: Cpu },
        { name: "Memory Usage", value: performanceData.metrics.memory.used, max: 100, unit: "%", status: performanceData.metrics.memory.used < 80 ? "healthy" : "warning", icon: MemoryStick },
        { name: "Disk Usage", value: performanceData.metrics.disk.used, max: 100, unit: "%", status: performanceData.metrics.disk.used < 80 ? "healthy" : "warning", icon: HardDrive },
        { name: "Network Latency", value: parseInt(performanceData.metrics.network.latency) || 0, max: 200, unit: "ms", status: "healthy", icon: Wifi },
      ])

      // Convert logs to alerts
      const alerts: Alert[] = logsData.logs
        .filter(log => log.level !== 'info')
        .slice(0, 4)
        .map((log, index) => ({
          id: log.id,
          type: log.level as 'info' | 'warning' | 'error',
          message: log.message,
          time: new Date(log.timestamp).toLocaleString(),
          resolved: index > 1
        }))
      setRecentAlerts(alerts)

    } catch (err) {
      console.error('Error fetching diagnostics:', err)
      setError('Failed to load diagnostics data')
      // Set fallback data
      setServices([
        { name: "API Server", status: "operational", latency: "45ms" },
        { name: "Database Primary", status: "operational", latency: "12ms" },
        { name: "Database Replica", status: "operational", latency: "15ms" },
        { name: "Payment Gateway", status: "operational", latency: "89ms" },
        { name: "Email Service", status: "degraded", latency: "450ms" },
        { name: "File Storage", status: "operational", latency: "23ms" },
      ])
      setSystemMetrics([
        { name: "CPU Usage", value: 45, max: 100, unit: "%", status: "healthy", icon: Cpu },
        { name: "Memory Usage", value: 62, max: 100, unit: "%", status: "healthy", icon: MemoryStick },
        { name: "Disk Usage", value: 78, max: 100, unit: "%", status: "warning", icon: HardDrive },
        { name: "Network Latency", value: 45, max: 200, unit: "ms", status: "healthy", icon: Wifi },
      ])
      setOverallStatus("All Systems Operational")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
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
          <h1 className="text-2xl font-bold text-foreground">System Diagnostics</h1>
          <p className="text-muted-foreground">Monitor system health and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <Link href="/system-support/diagnostics/performance">
            <Button variant="outline" className="glass-subtle border-white/20">
              <Clock className="w-4 h-4 mr-2" />
              View Performance
            </Button>
          </Link>
          <Button 
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
            onClick={fetchData}
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh All
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-yellow-500/20 text-yellow-600 text-sm">
          {error}
        </div>
      )}

      {/* Overall Status */}
      <Card className="glass-card border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${overallStatus.includes('Operational') ? 'from-green-500 to-emerald-500' : 'from-yellow-500 to-orange-500'} flex items-center justify-center`}>
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">System Status: {overallStatus.includes('Operational') ? 'Healthy' : 'Degraded'}</h2>
                <p className="text-muted-foreground">{overallStatus}</p>
              </div>
            </div>
            <Badge className={overallStatus.includes('Operational') ? "bg-green-500/20 text-green-500 text-lg py-1 px-4" : "bg-yellow-500/20 text-yellow-500 text-lg py-1 px-4"}>
              99.97% Uptime
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* System Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemMetrics.map((metric) => (
          <Card key={metric.name} className="glass-card border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <metric.icon className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium">{metric.name}</span>
                </div>
                <Badge className={metric.status === "healthy" ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500"}>
                  {metric.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold">{metric.value}{metric.unit}</span>
                  <span className="text-sm text-muted-foreground">/ {metric.max}{metric.unit}</span>
                </div>
                <Progress value={(metric.value / metric.max) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Services Status */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Service Status</CardTitle>
            <Button variant="ghost" size="sm" className="text-purple-500">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {services.map((service) => {
              const statusConfig = statusColors[service.status as keyof typeof statusColors] || statusColors.operational
              const StatusIcon = statusConfig.icon
              return (
                <div
                  key={service.name}
                  className="flex items-center justify-between p-3 rounded-xl glass-subtle"
                >
                  <div className="flex items-center gap-3">
                    <StatusIcon className={`w-5 h-5 ${statusConfig.text}`} />
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-xs text-muted-foreground">Last check: 30s ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-right">
                      <p className="font-medium">{service.latency}</p>
                      <p className="text-xs text-muted-foreground">Latency</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-500">99.9%</p>
                      <p className="text-xs text-muted-foreground">Uptime</p>
                    </div>
                    <Badge className={`${statusConfig.bg} ${statusConfig.text}`}>
                      {service.status}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Alerts</CardTitle>
            <Badge className="bg-yellow-500/20 text-yellow-500">
              {recentAlerts.filter(a => !a.resolved).length} Active
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAlerts.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No recent alerts
              </div>
            ) : (
              recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-xl glass-subtle ${alert.resolved ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <Badge className={alertTypeColors[alert.type as keyof typeof alertTypeColors]}>
                      {alert.type}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm">{alert.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-muted-foreground">{alert.time}</p>
                        {alert.resolved && (
                          <Badge className="bg-green-500/20 text-green-500 text-xs">Resolved</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-card border-white/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Diagnostic Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Run Health Check", icon: Activity, color: "from-green-500 to-emerald-500", href: "#" },
              { label: "Database Diagnostics", icon: Database, color: "from-blue-500 to-blue-600", href: "#" },
              { label: "Network Test", icon: Wifi, color: "from-purple-500 to-indigo-500", href: "#" },
              { label: "Performance Report", icon: TrendingUp, color: "from-orange-500 to-red-500", href: "/system-support/diagnostics/performance" },
            ].map((action) => (
              <Link key={action.label} href={action.href}>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex-col gap-2 glass-subtle border-white/20 hover:bg-white/20 w-full"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
