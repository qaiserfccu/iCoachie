"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wrench, Plus, Clock, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react"

const requests = [
  { id: 1, title: "HVAC Repair - Indoor Court", facility: "Indoor Court A", priority: "high", status: "in-progress", requestedBy: "Coach Sarah", date: "Jan 12" },
  { id: 2, title: "Light Bulb Replacement", facility: "Parking Lot", priority: "low", status: "pending", requestedBy: "Security", date: "Jan 14" },
  { id: 3, title: "Plumbing Issue - Pool Area", facility: "Swimming Pool", priority: "urgent", status: "in-progress", requestedBy: "Lifeguard", date: "Jan 15" },
  { id: 4, title: "Door Lock Repair", facility: "Conference Room", priority: "medium", status: "completed", requestedBy: "Admin", date: "Jan 10" },
  { id: 5, title: "Floor Crack Repair", facility: "Fitness Center", priority: "medium", status: "pending", requestedBy: "Maintenance", date: "Jan 13" },
]

const priorityColors = { urgent: "bg-red-500/20 text-red-500", high: "bg-orange-500/20 text-orange-500", medium: "bg-yellow-500/20 text-yellow-500", low: "bg-green-500/20 text-green-500" }
const statusColors = { pending: "bg-blue-500/20 text-blue-500", "in-progress": "bg-purple-500/20 text-purple-500", completed: "bg-green-500/20 text-green-500" }

export default function MaintenancePage() {
  const pendingCount = requests.filter(r => r.status === "pending").length
  const inProgressCount = requests.filter(r => r.status === "in-progress").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Maintenance Requests</h1>
          <p className="text-muted-foreground">Manage facility maintenance</p>
        </div>
        <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Request
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Requests</p>
              <p className="text-2xl font-bold">{requests.length}</p>
            </div>
            <Wrench className="w-8 h-8 text-teal-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-blue-500">{pendingCount}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold text-purple-500">{inProgressCount}</p>
            </div>
            <Wrench className="w-8 h-8 text-purple-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Urgent</p>
              <p className="text-2xl font-bold text-red-500">{requests.filter(r => r.priority === "urgent").length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">All Requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {requests.map((request) => (
            <div key={request.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-teal-500" />
                </div>
                <div>
                  <p className="font-medium">{request.title}</p>
                  <p className="text-sm text-muted-foreground">{request.facility} • By: {request.requestedBy} • {request.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={priorityColors[request.priority as keyof typeof priorityColors]}>{request.priority}</Badge>
                <Badge className={statusColors[request.status as keyof typeof statusColors]}>{request.status}</Badge>
                <Button size="sm" variant="ghost" className="text-teal-500">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
