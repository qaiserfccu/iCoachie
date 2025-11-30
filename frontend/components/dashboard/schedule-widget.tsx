"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Clock, MapPin, Users } from "lucide-react"
import { useState, useEffect } from "react"
import { dashboardService, DashboardSession } from "@/lib/services"

export function ScheduleWidget() {
  const [sessions, setSessions] = useState<DashboardSession[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const todaySessions = await dashboardService.getTodaySchedule()
        setSessions(todaySessions)
      } catch (error) {
        console.error('Error fetching today\'s schedule:', error)
        setSessions([])
      } finally {
        setLoading(false)
      }
    }

    fetchSchedule()
  }, [currentDate])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
    setCurrentDate(newDate)
  }

  if (loading) {
    return (
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                <div className="w-1 h-full min-h-16 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Today's Schedule</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigateDate('prev')}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium text-muted-foreground">{formatDate(currentDate)}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigateDate('next')}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No sessions scheduled for today</p>
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
            >
              <div className={`w-1 h-full min-h-16 rounded-full ${
                session.status === 'scheduled' ? 'bg-primary' :
                session.status === 'in_progress' ? 'bg-yellow-500' :
                'bg-green-500'
              }`} />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground truncate">{session.title}</h4>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {session.time}
                  </span>
                  {session.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {session.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    {session.attendees}/{session.maxCapacity} athletes
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
                View
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
