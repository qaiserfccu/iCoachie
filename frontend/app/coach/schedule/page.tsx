"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { useLoading } from "@/lib/contexts/LoadingContext"
import { useError } from "@/lib/contexts/ErrorContext"
import { coachScheduleService, WeeklySchedule } from "@/lib/services"

export default function SchedulePage() {
  const { setLoading } = useLoading()
  const { setError } = useError()

  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule | null>(null)
  const [currentWeekStart, setCurrentWeekStart] = useState<string>("")

  // Load schedule on component mount
  useEffect(() => {
    loadSchedule()
  }, [])

  const loadSchedule = async (weekStart?: string) => {
    try {
      setLoading(true)
      setError(null)

      const schedule = await coachScheduleService.getWeeklySchedule(weekStart)
      setWeeklySchedule(schedule)
      setCurrentWeekStart(schedule.weekStart)
    } catch (error) {
      console.error('Error loading schedule:', error)
      setError('Failed to load schedule')
    } finally {
      setLoading(false)
    }
  }

  const handlePreviousWeek = async () => {
    if (currentWeekStart) {
      try {
        const prevSchedule = await coachScheduleService.getPreviousWeek(currentWeekStart)
        setWeeklySchedule(prevSchedule)
        setCurrentWeekStart(prevSchedule.weekStart)
      } catch (error) {
        console.error('Error loading previous week:', error)
        setError('Failed to load previous week')
      }
    }
  }

  const handleNextWeek = async () => {
    try {
      const nextSchedule = await coachScheduleService.getNextWeek()
      setWeeklySchedule(nextSchedule)
      setCurrentWeekStart(nextSchedule.weekStart)
    } catch (error) {
      console.error('Error loading next week:', error)
      setError('Failed to load next week')
    }
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Schedule</h1>
          <p className="text-muted-foreground">View and manage your training sessions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
            <Calendar className="w-4 h-4 mr-2" />
            Calendar View
          </Button>
          <Button className="bg-gradient-to-r from-teal-500 to-green-500 text-white">Set Availability</Button>
        </div>
      </div>

      {/* Week Navigation */}
      <Card className="glass-card border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="glass-subtle"
              onClick={handlePreviousWeek}
              disabled={!weeklySchedule}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-lg font-semibold">
              {weeklySchedule
                ? `${new Date(weeklySchedule.weekStart).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric'
                  })} - ${new Date(weeklySchedule.weekEnd).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}`
                : 'Loading...'
              }
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="glass-subtle"
              onClick={handleNextWeek}
              disabled={!weeklySchedule}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Schedule List */}
      <div className="space-y-4">
        {weeklySchedule?.days.map((day) => (
          <Card key={day.day} className="glass-card border-white/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  {day.day} <span className="text-muted-foreground font-normal">- {day.date}</span>
                </CardTitle>
                <Badge variant="outline" className="border-teal-500/50 text-teal-500">
                  {day.sessions.length} sessions
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {day.sessions.length > 0 ? (
                day.sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[80px]">
                        <Clock className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                        <span className="text-sm font-medium">{session.time}</span>
                        <span className="block text-xs text-muted-foreground">{session.duration}</span>
                      </div>
                      <div>
                        <p className="font-medium">{session.name}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {session.students} students
                          </span>
                          {session.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {session.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-teal-500 to-green-500 text-white">
                      View Details
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No sessions scheduled for this day
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
