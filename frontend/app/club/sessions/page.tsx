"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, MapPin, Plus, ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react"
import { clubAdminService, type ClubSession } from "@/lib/services"

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const timeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"]

const sessionColors = [
  "bg-blue-500", "bg-orange-500", "bg-green-500", "bg-yellow-500",
  "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-red-500"
]

export default function SessionsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessions, setSessions] = useState<ClubSession[]>([])
  const [weekStart, setWeekStart] = useState(getWeekStart(new Date()))

  function getWeekStart(date: Date): Date {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff))
  }

  function getWeekEnd(start: Date): Date {
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    return end
  }

  useEffect(() => {
    loadSessions()
  }, [weekStart])

  async function loadSessions() {
    try {
      setLoading(true)
      setError(null)
      
      const weekEnd = getWeekEnd(weekStart)
      const response = await clubAdminService.getSessions({
        startDate: weekStart.toISOString(),
        endDate: weekEnd.toISOString(),
        pageSize: 100
      })
      
      setSessions(response.data)
    } catch (err) {
      console.error('Error loading sessions:', err)
      setError('Failed to load sessions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newStart = new Date(weekStart)
    newStart.setDate(newStart.getDate() + (direction === 'next' ? 7 : -7))
    setWeekStart(newStart)
  }

  const formatWeekRange = () => {
    const end = getWeekEnd(weekStart)
    const startStr = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    return `${startStr} - ${endStr}`
  }

  const getSessionForSlot = (dayIndex: number, timeSlot: string) => {
    return sessions.find(session => {
      const sessionDate = new Date(session.startTime)
      const sessionDay = sessionDate.getDay() === 0 ? 6 : sessionDate.getDay() - 1 // Convert to Monday=0
      const sessionTime = sessionDate.toTimeString().slice(0, 5) // HH:MM format
      return sessionDay === dayIndex && sessionTime === timeSlot
    })
  }

  const getSessionColor = (title: string): string => {
    let hash = 0
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash)
    }
    return sessionColors[Math.abs(hash) % sessionColors.length]
  }

  const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatSessionTime = (session: ClubSession): string => {
    const date = new Date(session.startTime)
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(now.getDate() + 1)
    
    let dayStr = ''
    if (date.toDateString() === now.toDateString()) {
      dayStr = 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      dayStr = 'Tomorrow'
    } else {
      dayStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    }
    
    return `${dayStr}, ${formatTime(session.startTime)}`
  }

  const upcomingSessions = sessions
    .filter(s => new Date(s.startTime) >= new Date() && s.status !== 'completed' && s.status !== 'cancelled')
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 5)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={loadSessions}>Try Again</Button>
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
              <Button variant="ghost" size="icon" className="glass-subtle" onClick={() => navigateWeek('prev')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium px-2">{formatWeekRange()}</span>
              <Button variant="ghost" size="icon" className="glass-subtle" onClick={() => navigateWeek('next')}>
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
                      const session = getSessionForSlot(dayIndex, time)
                      return (
                        <div key={dayIndex} className="p-1 border border-white/10 rounded-lg">
                          {session && (
                            <div
                              className={`${getSessionColor(session.title)} text-white text-xs p-2 rounded-md cursor-pointer hover:opacity-90 transition-opacity`}
                            >
                              <p className="font-medium truncate">{session.title}</p>
                              <p className="opacity-80 truncate">{session.coachName}</p>
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
            {upcomingSessions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No upcoming sessions</p>
            ) : (
              upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium">{session.title}</h3>
                    <Badge variant="outline" className="text-xs border-white/30">
                      {session.enrolledCount}/{session.maxCapacity}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>{formatSessionTime(session)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3" />
                      <span>{session.coachName}</span>
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
