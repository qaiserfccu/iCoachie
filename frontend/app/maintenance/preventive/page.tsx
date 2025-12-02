"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, CheckCircle, AlertTriangle, Plus, Settings } from "lucide-react"

const scheduledMaintenance = [
  { 
    id: 1, 
    task: "HVAC Filter Replacement", 
    facility: "Main Building", 
    frequency: "Monthly",
    lastCompleted: "Dec 15, 2024",
    nextDue: "Jan 15, 2025",
    status: "upcoming",
    assignedTo: "John Smith"
  },
  { 
    id: 2, 
    task: "Pool Chemical Testing", 
    facility: "Swimming Pool", 
    frequency: "Weekly",
    lastCompleted: "Jan 8, 2025",
    nextDue: "Jan 15, 2025",
    status: "upcoming",
    assignedTo: "Sarah Davis"
  },
  { 
    id: 3, 
    task: "Fire Extinguisher Inspection", 
    facility: "All Buildings", 
    frequency: "Quarterly",
    lastCompleted: "Oct 1, 2024",
    nextDue: "Jan 1, 2025",
    status: "overdue",
    assignedTo: "Mike Johnson"
  },
  { 
    id: 4, 
    task: "Generator Testing", 
    facility: "Power Room", 
    frequency: "Monthly",
    lastCompleted: "Jan 5, 2025",
    nextDue: "Feb 5, 2025",
    status: "scheduled",
    assignedTo: "John Smith"
  },
  { 
    id: 5, 
    task: "Elevator Inspection", 
    facility: "Main Building", 
    frequency: "Annually",
    lastCompleted: "Jan 10, 2024",
    nextDue: "Jan 10, 2025",
    status: "in-progress",
    assignedTo: "External Vendor"
  },
]

const upcomingThisWeek = [
  { task: "HVAC Filter Replacement", date: "Jan 15", time: "09:00 AM" },
  { task: "Pool Chemical Testing", date: "Jan 15", time: "10:00 AM" },
  { task: "Lighting Check - Field A", date: "Jan 16", time: "08:00 AM" },
  { task: "Emergency Exit Testing", date: "Jan 17", time: "07:00 AM" },
]

const stats = [
  { label: "Scheduled Tasks", value: 24, color: "text-blue-500" },
  { label: "Completed This Month", value: 18, color: "text-green-500" },
  { label: "Upcoming This Week", value: 6, color: "text-amber-500" },
  { label: "Overdue", value: 2, color: "text-red-500" },
]

export default function PreventivePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Preventive Maintenance</h1>
          <p className="text-muted-foreground">Schedule and track recurring maintenance tasks</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="glass-subtle border-white/20">
            <Settings className="w-4 h-4 mr-2" />
            Schedules
          </Button>
          <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Scheduled Maintenance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {scheduledMaintenance.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    item.status === 'overdue' ? 'bg-red-500/20' : 
                    item.status === 'upcoming' ? 'bg-amber-500/20' : 
                    item.status === 'in-progress' ? 'bg-blue-500/20' : 'bg-green-500/20'
                  }`}>
                    {item.status === 'overdue' ? <AlertTriangle className="w-5 h-5 text-red-500" /> :
                     item.status === 'in-progress' ? <Clock className="w-5 h-5 text-blue-500" /> :
                     <Calendar className="w-5 h-5 text-amber-500" />}
                  </div>
                  <div>
                    <p className="font-medium">{item.task}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span>{item.facility}</span>
                      <span>•</span>
                      <span>{item.frequency}</span>
                      <span>•</span>
                      <span>{item.assignedTo}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={
                    item.status === 'overdue' ? 'bg-red-500/20 text-red-500' : 
                    item.status === 'upcoming' ? 'bg-amber-500/20 text-amber-500' : 
                    item.status === 'in-progress' ? 'bg-blue-500/20 text-blue-500' : 
                    'bg-green-500/20 text-green-500'
                  }>{item.status}</Badge>
                  <p className="text-xs text-muted-foreground mt-1">Due: {item.nextDue}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">This Week</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingThisWeek.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl glass-subtle">
                <p className="font-medium text-sm">{item.task}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <Calendar className="w-3 h-3" />
                  <span>{item.date}</span>
                  <Clock className="w-3 h-3 ml-2" />
                  <span>{item.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
