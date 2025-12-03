"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search, Filter, Download, RefreshCw, Shield, 
  User, Key, LogIn, Settings, Loader2, Clock
} from "lucide-react"
import { useState, useEffect } from "react"
import { systemSupportService, type AuditLog } from "@/lib/services"

const actionColors: Record<string, string> = {
  LOGIN: "bg-green-500/20 text-green-500",
  LOGOUT: "bg-gray-500/20 text-gray-500",
  PASSWORD_RESET: "bg-blue-500/20 text-blue-500",
  PERMISSION_CHANGE: "bg-orange-500/20 text-orange-500",
  DATA_ACCESS: "bg-purple-500/20 text-purple-500",
  SETTINGS_UPDATE: "bg-yellow-500/20 text-yellow-600",
}

const actionIcons: Record<string, React.ElementType> = {
  LOGIN: LogIn,
  LOGOUT: LogIn,
  PASSWORD_RESET: Key,
  PERMISSION_CHANGE: Shield,
  DATA_ACCESS: User,
  SETTINGS_UPDATE: Settings,
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchLogs = async () => {
    try {
      setRefreshing(true)
      setError(null)
      const data = await systemSupportService.getAuditLogs({
        action: actionFilter || undefined,
        limit: 100
      })
      setLogs(data.logs)
    } catch (err) {
      console.error('Error fetching audit logs:', err)
      setError('Failed to load audit logs')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [actionFilter])

  const filteredLogs = logs.filter(log => 
    log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const actionStats = {
    logins: logs.filter(l => l.action === 'LOGIN').length,
    passwordResets: logs.filter(l => l.action === 'PASSWORD_RESET').length,
    permissionChanges: logs.filter(l => l.action === 'PERMISSION_CHANGE').length,
    total: logs.length
  }

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
          <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground">Security and activity monitoring</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="glass-subtle border-white/20">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button 
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
            onClick={fetchLogs}
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/20 text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Events</p>
              <p className="text-2xl font-bold">{actionStats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Logins</p>
              <p className="text-2xl font-bold">{actionStats.logins}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <LogIn className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Password Resets</p>
              <p className="text-2xl font-bold">{actionStats.passwordResets}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Key className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Permission Changes</p>
              <p className="text-2xl font-bold">{actionStats.permissionChanges}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="glass-card border-white/20">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, action, or details..."
                className="pl-10 glass-subtle border-white/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={actionFilter === null ? "default" : "outline"}
                size="sm"
                onClick={() => setActionFilter(null)}
                className={actionFilter === null ? "bg-purple-500" : "glass-subtle border-white/20"}
              >
                All
              </Button>
              <Button
                variant={actionFilter === "LOGIN" ? "default" : "outline"}
                size="sm"
                onClick={() => setActionFilter("LOGIN")}
                className={actionFilter === "LOGIN" ? "bg-green-500" : "glass-subtle border-white/20"}
              >
                Logins
              </Button>
              <Button
                variant={actionFilter === "PASSWORD_RESET" ? "default" : "outline"}
                size="sm"
                onClick={() => setActionFilter("PASSWORD_RESET")}
                className={actionFilter === "PASSWORD_RESET" ? "bg-blue-500" : "glass-subtle border-white/20"}
              >
                Password Resets
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Activity Log ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No audit logs found matching your criteria
            </div>
          ) : (
            filteredLogs.map((log) => {
              const ActionIcon = actionIcons[log.action] || Shield
              return (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <ActionIcon className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{log.userName}</span>
                        <Badge className={actionColors[log.action] || "bg-gray-500/20 text-gray-500"}>
                          {log.action.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{log.details}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Resource: {log.resource} • IP: {log.ipAddress}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
