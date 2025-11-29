"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, MapPin, Plus, ChevronLeft, ChevronRight } from "lucide-react"

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const timeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"]

const sessions = [
  { id: 1, name: "Junior Swimming", day: 0, time: "09:00", duration: 1, coach: "John Smith", color: "bg-blue-500" },
  { id: 2, name: "Basketball", day: 0, time: "15:00", duration: 2, coach: "Mike Johnson", color: "bg-orange-500" },
  { id: 3, name: "Soccer Practice", day: 1, time: "14:00", duration: 2, coach: "Sarah Wilson", color: "bg-green-500" },
  { id: 4, name: "Tennis Lessons", day: 2, time: "10:00", duration: 1, coach: "David Lee", color: "bg-yellow-500" },
  { id: 5, name: "Swimming Advanced", day: 3, time: "09:00", duration: 1, coach: "John Smith", color: "bg-blue-500" },
  { id: 6, name: "Basketball", day: 4, time: "16:00", duration: 2, coach: "Mike Johnson", color: "bg-orange-500" },
  { id: 7, name: "Soccer Match", day: 5, time: "10:00", duration: 2, coach: "Sarah Wilson", color: "bg-green-500" },
]

const upcomingSessions = [
  {
    name: "Junior Swimming",
    time: "Today, 09:00 AM",
    coach: "John Smith",
    enrolled: 15,
    capacity: 20,
    location: "Pool A",
  },
  {
    name: "Basketball Training",
    time: "Today, 03:00 PM",
    coach: "Mike Johnson",
    enrolled: 18,
    capacity: 20,
    location: "Court 1",
  },
  {
    name: "Soccer Practice",
    time: "Tomorrow, 02:00 PM",
    coach: "Sarah Wilson",
    enrolled: 22,
    capacity: 25,
    location: "Field B",
  },
]

export default function SessionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sessions</h1>
          <p className="text-muted-foreground">Manage and schedule training sessions</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Session
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold">Weekly Schedule</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="glass-subtle">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium px-2">Nov 25 - Dec 1, 2024</span>
              <Button variant="ghost" size="icon" className="glass-subtle">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                {/* Header */}
                <div className="grid grid-cols-8 gap-1 mb-2">
                  <div className="p-2 text-sm font-medium text-muted-foreground">Time</div>
                  {weekDays.map((day) => (
                    <div key={day} className="p-2 text-sm font-medium text-center">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                {timeSlots.map((time) => (
                  <div key={time} className="grid grid-cols-8 gap-1 min-h-[60px]">
                    <div className="p-2 text-xs text-muted-foreground">{time}</div>
                    {weekDays.map((_, dayIndex) => {
                      const session = sessions.find((s) => s.day === dayIndex && s.time === time)
                      return (
                        <div key={dayIndex} className="p-1 border border-white/10 rounded-lg">
                          {session && (
                            <div
                              className={`${session.color} text-white text-xs p-2 rounded-md cursor-pointer hover:opacity-90 transition-opacity`}
                            >
                              <p className="font-medium truncate">{session.name}</p>
                              <p className="opacity-80 truncate">{session.coach}</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card className="glass-card border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.map((session, index) => (
              <div
                key={index}
                className="p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium">{session.name}</h3>
                  <Badge variant="outline" className="text-xs border-white/30">
                    {session.enrolled}/{session.capacity}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span>{session.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3 h-3" />
                    <span>{session.coach}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    <span>{session.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
