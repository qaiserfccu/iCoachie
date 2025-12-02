"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ClipboardList, Plus, Search, Eye, CheckCircle, MapPin } from "lucide-react"

const patrolLogs = [
  { id: 1, officer: "James Rodriguez", shift: "Night", route: "Perimeter A", startTime: "22:00", endTime: "23:30", checkpoints: 12, completed: 12, notes: "All clear", status: "completed" },
  { id: 2, officer: "David Wilson", shift: "Night", route: "Building Interior", startTime: "23:00", endTime: "-", checkpoints: 8, completed: 5, notes: "In progress", status: "in-progress" },
  { id: 3, officer: "Mike Thompson", shift: "Evening", route: "Parking Area", startTime: "18:00", endTime: "19:45", checkpoints: 6, completed: 6, notes: "Found unlocked vehicle", status: "completed" },
  { id: 4, officer: "Sarah Garcia", shift: "Day", route: "Perimeter B", startTime: "14:00", endTime: "15:30", checkpoints: 10, completed: 10, notes: "All clear", status: "completed" },
  { id: 5, officer: "John Smith", shift: "Day", route: "Building Interior", startTime: "10:00", endTime: "11:30", checkpoints: 8, completed: 8, notes: "Maintenance issue reported", status: "completed" },
]

const routes = [
  { id: 1, name: "Perimeter A", checkpoints: 12, estimatedTime: "90 min", lastPatrol: "1 hour ago" },
  { id: 2, name: "Perimeter B", checkpoints: 10, estimatedTime: "75 min", lastPatrol: "4 hours ago" },
  { id: 3, name: "Building Interior", checkpoints: 8, estimatedTime: "60 min", lastPatrol: "30 min ago" },
  { id: 4, name: "Parking Area", checkpoints: 6, estimatedTime: "45 min", lastPatrol: "6 hours ago" },
]

export default function PatrolLogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patrol Logs</h1>
          <p className="text-muted-foreground">Track security patrol activities</p>
        </div>
        <Button className="bg-gradient-to-r from-slate-600 to-slate-800 text-white">
          <Plus className="w-4 h-4 mr-2" />Start Patrol
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/20">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed Today</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <ClipboardList className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <MapPin className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Checkpoints</p>
                <p className="text-2xl font-bold">36</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-orange-500/20">
                <ClipboardList className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Routes</p>
                <p className="text-2xl font-bold">4</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Patrol Logs</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search logs..." className="pl-10 glass-subtle" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Officer</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patrolLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.officer}</TableCell>
                    <TableCell>{log.route}</TableCell>
                    <TableCell>{log.startTime} - {log.endTime}</TableCell>
                    <TableCell>{log.completed}/{log.checkpoints}</TableCell>
                    <TableCell>
                      <Badge variant={log.status === "completed" ? "default" : "secondary"}>
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle>Patrol Routes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {routes.map((route) => (
              <div key={route.id} className="p-4 rounded-xl glass-subtle">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{route.name}</span>
                  <Badge variant="outline">{route.checkpoints} checkpoints</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Est. time: {route.estimatedTime}</p>
                  <p>Last patrol: {route.lastPatrol}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
