"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, MapPin, Plus, ChevronLeft, ChevronRight, Loader2, AlertCircle, Calendar } from "lucide-react"
import clubSessionsService, { CalendarSession, UpcomingSession } from "@/lib/services/clubSessionsService"

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const timeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"]

export default function SessionsPage() {
  const [calendarSessions, setCalendarSessions] = useState<CalendarSession[]>([])
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [weekOffset, setWeekOffset] = useState(0)

  // Calculate date range for display
  const getDateRange = () => {
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay() + 1 + (weekOffset * 7)) // Monday
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6) // Sunday

    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
    return `${startOfWeek.toLocaleDateString('en-US', options)} - ${endOfWeek.toLocaleDateString('en-US', { ...options, year: 'numeric' })}`
  }

  useEffect(() => {
    async function fetchSessionsData() {
      try {
        setLoading(true)
        setError(null)

        const now = new Date()
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay() + 1 + (weekOffset * 7))
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)

        const [calendarData, upcomingData] = await Promise.all([
          clubSessionsService.getCalendarSessions(startOfWeek, endOfWeek),
          clubSessionsService.getUpcomingSessions(),
        ])

        setCalendarSessions(calendarData)
        setUpcomingSessions(upcomingData)
      } catch (err) {
        console.error('Failed to fetch sessions data:', err)
        setError('Failed to load sessions. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchSessionsData()
  }, [weekOffset])

  // Get session for a specific day and time slot
  const getSessionForSlot = (dayIndex: number, time: string) => {
    return calendarSessions.find(s => s.day === dayIndex && s.time === time)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading sessions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sessions</h1>
          <p className="text-muted-foreground">Manage and schedule training sessions</p>
        </div>
        <Link href="/club/sessions/create">
          <Button className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Session
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold">Weekly Schedule</CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="glass-subtle"
                onClick={() => setWeekOffset(prev => prev - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium px-2">{getDateRange()}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="glass-subtle"
                onClick={() => setWeekOffset(prev => prev + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {calendarSessions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No sessions scheduled</p>
                <p className="text-sm mt-1">Create your first session to get started</p>
              </div>
            ) : (
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
                        const session = getSessionForSlot(dayIndex, time)
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
            )}
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card className="glass-card border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No upcoming sessions</p>
              </div>
            ) : (
              upcomingSessions.map((session) => (
                <div
                  key={session.id}
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
                    {session.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        <span>{session.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
