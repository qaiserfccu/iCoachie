"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, AlertTriangle, Info, XCircle, Settings, Trash2 } from "lucide-react"
import { adminNotifications } from "@/lib/services/mockDataService"

const typeIcons: Record<string, typeof Bell> = {
  info: Info,
  error: XCircle,
  warning: AlertTriangle,
}

const typeColors: Record<string, string> = {
  info: "text-blue-500",
  error: "text-red-500",
  warning: "text-yellow-500",
}

export default function NotificationsPage() {
  const unreadCount = adminNotifications.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">System alerts and notifications</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unread</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
              </div>
              <Bell className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Warnings</p>
                <p className="text-2xl font-bold">{adminNotifications.filter(n => n.type === "warning").length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Errors</p>
                <p className="text-2xl font-bold">{adminNotifications.filter(n => n.type === "error").length}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {adminNotifications.map((notification) => {
            const Icon = typeIcons[notification.type] || Info
            const color = typeColors[notification.type] || "text-blue-500"
            
            return (
              <div 
                key={notification.id} 
                className={`flex items-start gap-4 p-4 rounded-xl glass-subtle ${!notification.read ? 'border-l-4 border-primary' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{notification.title}</p>
                    <span className="text-sm text-muted-foreground">{notification.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!notification.read && (
                    <Button variant="ghost" size="icon">
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
