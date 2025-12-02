"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Plus, Search, Filter, Wrench, Clock, User, 
  MapPin, AlertTriangle, CheckCircle, Play, Pause
} from "lucide-react"

const workOrders = [
  { 
    id: "WO-001", 
    title: "HVAC System Repair", 
    facility: "Main Building", 
    priority: "high",
    status: "in-progress",
    assignedTo: "John Smith",
    createdAt: "Jan 10, 2025",
    estimatedHours: 4,
    type: "corrective"
  },
  { 
    id: "WO-002", 
    title: "Lighting Replacement", 
    facility: "Soccer Field", 
    priority: "medium",
    status: "pending",
    assignedTo: "Mike Johnson",
    createdAt: "Jan 11, 2025",
    estimatedHours: 2,
    type: "preventive"
  },
  { 
    id: "WO-003", 
    title: "Pool Pump Maintenance", 
    facility: "Swimming Pool", 
    priority: "high",
    status: "pending",
    assignedTo: "Sarah Davis",
    createdAt: "Jan 12, 2025",
    estimatedHours: 3,
    type: "preventive"
  },
  { 
    id: "WO-004", 
    title: "Door Lock Repair", 
    facility: "Equipment Room", 
    priority: "urgent",
    status: "in-progress",
    assignedTo: "John Smith",
    createdAt: "Jan 13, 2025",
    estimatedHours: 1,
    type: "emergency"
  },
  { 
    id: "WO-005", 
    title: "Flooring Inspection", 
    facility: "Indoor Court", 
    priority: "low",
    status: "completed",
    assignedTo: "Mike Johnson",
    createdAt: "Jan 8, 2025",
    estimatedHours: 2,
    type: "preventive"
  },
]

const stats = [
  { label: "Open Orders", value: 12, color: "text-blue-500" },
  { label: "In Progress", value: 5, color: "text-amber-500" },
  { label: "Completed Today", value: 3, color: "text-green-500" },
  { label: "Overdue", value: 2, color: "text-red-500" },
]

const priorityColors: Record<string, string> = {
  urgent: "bg-red-500/20 text-red-500",
  high: "bg-orange-500/20 text-orange-500",
  medium: "bg-yellow-500/20 text-yellow-500",
  low: "bg-green-500/20 text-green-500",
}

const statusColors: Record<string, string> = {
  pending: "bg-gray-500/20 text-gray-400",
  "in-progress": "bg-amber-500/20 text-amber-500",
  completed: "bg-green-500/20 text-green-500",
  "on-hold": "bg-blue-500/20 text-blue-500",
}

export default function WorkOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Work Orders</h1>
          <p className="text-muted-foreground">Manage and track maintenance work orders</p>
        </div>
        <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Work Order
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="glass-card border-white/20">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold">All Work Orders</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search orders..." className="pl-10 w-64 glass-subtle border-white/20" />
            </div>
            <Button variant="outline" size="icon" className="glass-subtle border-white/20">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {workOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  order.priority === 'urgent' ? 'bg-red-500/20' : 
                  order.priority === 'high' ? 'bg-orange-500/20' : 'bg-amber-500/20'
                }`}>
                  <Wrench className={`w-6 h-6 ${
                    order.priority === 'urgent' ? 'text-red-500' : 
                    order.priority === 'high' ? 'text-orange-500' : 'text-amber-500'
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-muted-foreground">{order.id}</span>
                    <Badge className={priorityColors[order.priority]}>{order.priority}</Badge>
                    <Badge variant="outline" className="text-xs">{order.type}</Badge>
                  </div>
                  <p className="font-medium mt-1">{order.title}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {order.facility}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {order.assignedTo}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {order.estimatedHours}h estimated
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={statusColors[order.status]}>{order.status}</Badge>
                <div className="flex gap-1">
                  {order.status === 'pending' && (
                    <Button size="sm" variant="ghost" className="text-green-500">
                      <Play className="w-4 h-4" />
                    </Button>
                  )}
                  {order.status === 'in-progress' && (
                    <>
                      <Button size="sm" variant="ghost" className="text-yellow-500">
                        <Pause className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-green-500">
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
