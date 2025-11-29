"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Clock, MapPin, Users } from "lucide-react"
import { useState } from "react"

const scheduleData = [
  {
    id: 1,
    title: "Junior Soccer Training",
    time: "09:00 AM - 10:30 AM",
    location: "Field A",
    attendees: 18,
    color: "bg-primary",
  },
  {
    id: 2,
    title: "Basketball Skills Camp",
    time: "11:00 AM - 12:30 PM",
    location: "Indoor Court",
    attendees: 12,
    color: "bg-secondary",
  },
  {
    id: 3,
    title: "Swimming Lessons",
    time: "02:00 PM - 03:00 PM",
    location: "Pool Area",
    attendees: 8,
    color: "bg-chart-3",
  },
  {
    id: 4,
    title: "Tennis Coaching",
    time: "04:00 PM - 05:30 PM",
    location: "Tennis Courts",
    attendees: 6,
    color: "bg-chart-4",
  },
]

export function ScheduleWidget() {
  const [currentDate] = useState(new Date())

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Today's Schedule</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium text-muted-foreground">{formatDate(currentDate)}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {scheduleData.map((session) => (
          <div
            key={session.id}
            className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
          >
            <div className={`w-1 h-full min-h-16 rounded-full ${session.color}`} />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground truncate">{session.title}</h4>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {session.time}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {session.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {session.attendees} athletes
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
              View
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
