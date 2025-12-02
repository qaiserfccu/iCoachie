"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, MapPin, Plus, ArrowRight, CheckCircle, XCircle } from "lucide-react"

const appointments = [
  { id: 1, title: "Enrollment Meeting", client: "The Johnson Family", time: "10:00 AM", duration: "30 min", location: "Office 1", type: "enrollment", status: "confirmed" },
  { id: 2, title: "Progress Review", client: "Sarah Wilson", time: "11:00 AM", duration: "45 min", location: "Meeting Room", type: "review", status: "confirmed" },
  { id: 3, title: "Facility Tour", client: "New Member Prospect", time: "1:00 PM", duration: "60 min", location: "Main Building", type: "tour", status: "pending" },
  { id: 4, title: "Parent Conference", client: "Mr. & Mrs. Chen", time: "2:30 PM", duration: "30 min", location: "Office 2", type: "conference", status: "confirmed" },
  { id: 5, title: "Private Lesson Consultation", client: "Michael Brown", time: "4:00 PM", duration: "20 min", location: "Office 1", type: "consultation", status: "cancelled" },
]

const statusConfig = {
  confirmed: { color: "bg-green-500/20 text-green-500", icon: CheckCircle },
  pending: { color: "bg-yellow-500/20 text-yellow-500", icon: Clock },
  cancelled: { color: "bg-red-500/20 text-red-500", icon: XCircle },
}

const typeColors = {
  enrollment: "bg-blue-500/20 text-blue-500",
  review: "bg-purple-500/20 text-purple-500",
  tour: "bg-cyan-500/20 text-cyan-500",
  conference: "bg-orange-500/20 text-orange-500",
  consultation: "bg-green-500/20 text-green-500",
}

export default function AppointmentsPage() {
  const confirmedCount = appointments.filter(a => a.status === "confirmed").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground">Manage scheduled appointments</p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today&apos;s Appointments</p>
              <p className="text-2xl font-bold">{appointments.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-cyan-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Confirmed</p>
              <p className="text-2xl font-bold text-green-500">{confirmedCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-yellow-500">{appointments.filter(a => a.status === "pending").length}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Cancelled</p>
              <p className="text-2xl font-bold text-red-500">{appointments.filter(a => a.status === "cancelled").length}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Today&apos;s Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {appointments.map((apt) => {
            const config = statusConfig[apt.status as keyof typeof statusConfig]
            const StatusIcon = config.icon
            return (
              <div key={apt.id} className={`flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors ${apt.status === "cancelled" ? "opacity-60" : ""}`}>
                <div className="flex items-center gap-4">
                  <div className="w-1 h-16 rounded-full bg-cyan-500" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{apt.title}</p>
                      <Badge className={typeColors[apt.type as keyof typeof typeColors]}>{apt.type}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {apt.client}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {apt.time} ({apt.duration})</span>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {apt.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={config.color}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {apt.status}
                  </Badge>
                  <Button size="sm" variant="ghost" className="text-cyan-500">
                    <ArrowRight className="w-4 h-4" />
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
