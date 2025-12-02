"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, MapPin, ChevronLeft, ChevronRight, Plus } from "lucide-react"

const todaySessions = [
  { id: 1, title: "U-12 Soccer Training", time: "9:00 AM - 10:30 AM", location: "Main Field", coach: "Coach Sarah", students: 18, status: "in-progress" },
  { id: 2, title: "Swimming Lessons", time: "10:00 AM - 11:00 AM", location: "Pool", coach: "Coach Lisa", students: 12, status: "in-progress" },
  { id: 3, title: "Basketball Practice", time: "11:00 AM - 12:30 PM", location: "Indoor Court A", coach: "Coach Mike", students: 15, status: "upcoming" },
  { id: 4, title: "Tennis Academy", time: "2:00 PM - 3:30 PM", location: "Tennis Courts", coach: "Coach David", students: 8, status: "upcoming" },
  { id: 5, title: "Evening Soccer", time: "5:00 PM - 6:30 PM", location: "Main Field", coach: "Coach Sarah", students: 20, status: "upcoming" },
]

const weekSchedule = [
  { day: "Mon", date: 15, sessions: 6, highlighted: true },
  { day: "Tue", date: 16, sessions: 5, highlighted: false },
  { day: "Wed", date: 17, sessions: 7, highlighted: false },
  { day: "Thu", date: 18, sessions: 4, highlighted: false },
  { day: "Fri", date: 19, sessions: 8, highlighted: false },
  { day: "Sat", date: 20, sessions: 10, highlighted: false },
  { day: "Sun", date: 21, sessions: 3, highlighted: false },
]

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Schedule</h1>
          <p className="text-muted-foreground">View and manage daily schedules</p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Session
        </Button>
      </div>

      <Card className="glass-card border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" className="glass-subtle">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="font-semibold">January 2024</h3>
            <Button variant="ghost" size="sm" className="glass-subtle">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekSchedule.map((day) => (
              <div key={day.day} className={`text-center p-3 rounded-xl cursor-pointer transition-colors ${day.highlighted ? "bg-gradient-to-br from-cyan-500 to-blue-500 text-white" : "glass-subtle hover:bg-white/20"}`}>
                <p className="text-xs font-medium">{day.day}</p>
                <p className="text-lg font-bold">{day.date}</p>
                <p className="text-xs">{day.sessions} sessions</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Today&apos;s Sessions</CardTitle>
          <Badge className="bg-cyan-500/20 text-cyan-500">{todaySessions.length} Sessions</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          {todaySessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-1 h-16 rounded-full ${session.status === "in-progress" ? "bg-green-500" : "bg-gray-400"}`} />
                <div>
                  <p className="font-medium">{session.title}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {session.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {session.location}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{session.coach} • {session.students} students</p>
                </div>
              </div>
              <Badge className={session.status === "in-progress" ? "bg-green-500/20 text-green-500" : "bg-blue-500/20 text-blue-500"}>
                {session.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
