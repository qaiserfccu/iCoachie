"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, Plus, Search, CheckCircle, XCircle, Clock, Edit, MoreHorizontal } from "lucide-react"

const accessLogs = [
  { id: 1, user: "John Smith", location: "Main Entrance", method: "Card", time: "08:15 AM", action: "Entry", status: "success" },
  { id: 2, user: "Sarah Johnson", location: "Gym Access", method: "Biometric", time: "08:22 AM", action: "Entry", status: "success" },
  { id: 3, user: "Unknown", location: "Staff Room", method: "Card", time: "08:45 AM", action: "Entry", status: "denied" },
  { id: 4, user: "Mike Davis", location: "Pool Area", method: "Card", time: "09:00 AM", action: "Entry", status: "success" },
  { id: 5, user: "Emma Wilson", location: "Main Entrance", method: "Manual", time: "09:15 AM", action: "Exit", status: "success" },
]

const accessPoints = [
  { id: 1, name: "Main Entrance", type: "Card + Biometric", status: "active", lastAccess: "2 min ago" },
  { id: 2, name: "Gym Access", type: "Card Only", status: "active", lastAccess: "5 min ago" },
  { id: 3, name: "Pool Area", type: "Card Only", status: "maintenance", lastAccess: "15 min ago" },
  { id: 4, name: "Staff Room", type: "Biometric", status: "active", lastAccess: "8 min ago" },
  { id: 5, name: "Equipment Storage", type: "Card Only", status: "active", lastAccess: "1 hour ago" },
]

export default function AccessControlPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Access Control</h1>
          <p className="text-muted-foreground">Monitor and manage facility access points</p>
        </div>
        <Button className="bg-gradient-to-r from-slate-600 to-slate-800 text-white">
          <Plus className="w-4 h-4 mr-2" />Add Access Point
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
                <p className="text-sm text-muted-foreground">Successful Access</p>
                <p className="text-2xl font-bold">847</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-red-500/20">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Denied Access</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <Shield className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Points</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-yellow-500/20">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Maintenance</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Access Points</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search points..." className="pl-10 glass-subtle" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Access</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessPoints.map((point) => (
                <TableRow key={point.id}>
                  <TableCell className="font-medium">{point.name}</TableCell>
                  <TableCell>{point.type}</TableCell>
                  <TableCell>
                    <Badge variant={point.status === "active" ? "default" : "secondary"}>
                      {point.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{point.lastAccess}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle>Recent Access Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell>{log.location}</TableCell>
                  <TableCell>{log.method}</TableCell>
                  <TableCell>{log.time}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>
                    <Badge variant={log.status === "success" ? "default" : "destructive"}>
                      {log.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
