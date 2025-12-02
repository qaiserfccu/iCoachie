"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Plus, Calendar, CheckCircle, Clock } from "lucide-react"

const staff = [
  { id: 1, name: "Maria Lopez", role: "Senior Cleaner", shift: "Morning", areas: ["Main Lobby", "Staff Offices"], status: "on-duty", tasksCompleted: 8, totalTasks: 10 },
  { id: 2, name: "Carlos Santos", role: "Cleaner", shift: "Morning", areas: ["Gym Area", "Equipment Room"], status: "on-duty", tasksCompleted: 5, totalTasks: 8 },
  { id: 3, name: "Ana Garcia", role: "Cleaner", shift: "Afternoon", areas: ["Pool Area", "Locker Rooms"], status: "scheduled", tasksCompleted: 0, totalTasks: 6 },
  { id: 4, name: "Juan Martinez", role: "Cleaner", shift: "Afternoon", areas: ["Locker Rooms", "Showers"], status: "scheduled", tasksCompleted: 0, totalTasks: 7 },
  { id: 5, name: "Rosa Hernandez", role: "Senior Cleaner", shift: "Evening", areas: ["All Areas"], status: "off-duty", tasksCompleted: 0, totalTasks: 0 },
]

const upcomingShifts = [
  { id: 1, staff: "Ana Garcia", date: "Today", time: "2:00 PM - 10:00 PM", areas: 2 },
  { id: 2, staff: "Juan Martinez", date: "Today", time: "2:00 PM - 10:00 PM", areas: 2 },
  { id: 3, staff: "Rosa Hernandez", date: "Tomorrow", time: "6:00 AM - 2:00 PM", areas: 4 },
]

export default function AssignmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Staff Assignments</h1>
          <p className="text-muted-foreground">Manage cleaning staff and their assignments</p>
        </div>
        <Button className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white">
          <Plus className="w-4 h-4 mr-2" />Add Staff
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/20">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">On Duty</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gray-500/20">
                <Users className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Off Duty</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Staff</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader>
            <CardTitle>Staff Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {staff.map((member) => (
              <div key={member.id} className="p-4 rounded-xl glass-subtle flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-sky-500 to-cyan-500 text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role} • {member.shift} Shift</p>
                    <div className="flex gap-1 mt-1">
                      {member.areas.map((area, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{area}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={
                    member.status === "on-duty" ? "default" :
                    member.status === "scheduled" ? "secondary" : "outline"
                  }>
                    {member.status}
                  </Badge>
                  {member.totalTasks > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {member.tasksCompleted}/{member.totalTasks} tasks
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle>Upcoming Shifts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingShifts.map((shift) => (
              <div key={shift.id} className="p-4 rounded-xl glass-subtle">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{shift.date}</span>
                </div>
                <p className="font-medium">{shift.staff}</p>
                <p className="text-sm text-muted-foreground">{shift.time}</p>
                <p className="text-sm text-muted-foreground">{shift.areas} areas assigned</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
