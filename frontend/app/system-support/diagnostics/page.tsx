"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Activity, Server, Database, Wifi, HardDrive, Cpu, 
  MemoryStick, RefreshCw, CheckCircle, AlertTriangle, XCircle,
  TrendingUp, Clock
} from "lucide-react"

const systemMetrics = [
  { name: "CPU Usage", value: 45, max: 100, unit: "%", status: "healthy", icon: Cpu },
  { name: "Memory Usage", value: 62, max: 100, unit: "%", status: "healthy", icon: MemoryStick },
  { name: "Disk Usage", value: 78, max: 100, unit: "%", status: "warning", icon: HardDrive },
  { name: "Network I/O", value: 120, max: 1000, unit: "MB/s", status: "healthy", icon: Wifi },
]

const services = [
  { name: "API Server", status: "operational", uptime: "99.99%", latency: "45ms", lastCheck: "30s ago" },
  { name: "Database Primary", status: "operational", uptime: "99.98%", latency: "12ms", lastCheck: "30s ago" },
  { name: "Database Replica", status: "operational", uptime: "99.97%", latency: "15ms", lastCheck: "30s ago" },
  { name: "Payment Gateway", status: "operational", uptime: "99.95%", latency: "89ms", lastCheck: "30s ago" },
  { name: "Email Service", status: "degraded", uptime: "98.50%", latency: "450ms", lastCheck: "30s ago" },
  { name: "File Storage", status: "operational", uptime: "99.99%", latency: "23ms", lastCheck: "30s ago" },
  { name: "Cache Server", status: "operational", uptime: "99.99%", latency: "5ms", lastCheck: "30s ago" },
  { name: "Queue Worker", status: "operational", uptime: "99.90%", latency: "N/A", lastCheck: "30s ago" },
]

const recentAlerts = [
  { id: 1, type: "warning", message: "Email service latency increased to 450ms", time: "5 min ago", resolved: false },
  { id: 2, type: "info", message: "Scheduled maintenance completed successfully", time: "2 hours ago", resolved: true },
  { id: 3, type: "error", message: "Payment gateway timeout (auto-recovered)", time: "4 hours ago", resolved: true },
  { id: 4, type: "warning", message: "Disk usage approaching 80% threshold", time: "6 hours ago", resolved: false },
]

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
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Diagnostics</h1>
          <p className="text-muted-foreground">Monitor system health and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="glass-subtle border-white/20">
            <Clock className="w-4 h-4 mr-2" />
            Last 24 Hours
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh All
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card className="glass-card border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">System Status: Healthy</h2>
                <p className="text-muted-foreground">All critical services are operational</p>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-500 text-lg py-1 px-4">
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
              const statusConfig = statusColors[service.status as keyof typeof statusColors]
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
                      <p className="text-xs text-muted-foreground">Last check: {service.lastCheck}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-right">
                      <p className="font-medium">{service.latency}</p>
                      <p className="text-xs text-muted-foreground">Latency</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-500">{service.uptime}</p>
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
              2 Active
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAlerts.map((alert) => (
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
            ))}
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
              { label: "Run Health Check", icon: Activity, color: "from-green-500 to-emerald-500" },
              { label: "Database Diagnostics", icon: Database, color: "from-blue-500 to-blue-600" },
              { label: "Network Test", icon: Wifi, color: "from-purple-500 to-indigo-500" },
              { label: "Performance Report", icon: TrendingUp, color: "from-orange-500 to-red-500" },
            ].map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto p-4 flex-col gap-2 glass-subtle border-white/20 hover:bg-white/20"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
