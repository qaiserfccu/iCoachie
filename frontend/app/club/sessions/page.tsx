"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Clock, Users, MapPin, Plus, ChevronLeft, ChevronRight, Search, Calendar, TrendingUp } from "lucide-react"
import { useLoading } from "@/lib/contexts/LoadingContext"
import { useError } from "@/lib/contexts/ErrorContext"
import { clubSessionsService, type CalendarSession, type UpcomingSession, type SessionStats } from "@/lib/services"

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const timeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"]

export default function SessionsPage() {
  const [calendarSessions, setCalendarSessions] = useState<CalendarSession[]>([])
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([])
  const [stats, setStats] = useState<SessionStats | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredSessions, setFilteredSessions] = useState<CalendarSession[]>([])
  const [filteredUpcoming, setFilteredUpcoming] = useState<UpcomingSession[]>([])

  const { showLoading, hideLoading } = useLoading()
  const { showError } = useError()

  useEffect(() => {
    fetchSessionsData()
  }, [])

  useEffect(() => {
    // Filter sessions based on search term
    const filtered = calendarSessions.filter(session =>
      session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.coach.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredSessions(filtered)

    const filteredUpcomingList = upcomingSessions.filter(session =>
      session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.coach.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUpcoming(filteredUpcomingList)
  }, [searchTerm, calendarSessions, upcomingSessions])

  const fetchSessionsData = async () => {
    try {
      showLoading()

      // Get current week dates
      const now = new Date()
      const weekStart = new Date(now.getTime() - now.getDay() * 24 * 60 * 60 * 1000)
      const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)

      const [calendarData, upcomingData, statsData] = await Promise.all([
        clubSessionsService.getCalendarSessions(weekStart, weekEnd),
        clubSessionsService.getUpcomingSessions(),
        clubSessionsService.getSessionStats()
      ])

      setCalendarSessions(calendarData)
      setUpcomingSessions(upcomingData)
      setStats(statsData)
    } catch (error) {
      console.error('Error fetching sessions data:', error)
      showError('Failed to load sessions data')
    } finally {
      hideLoading()
    }
  }

  const getDisplayStats = () => {
    if (!stats) return []

    return [
      {
        label: "Total Sessions",
        value: stats.totalSessions.toString(),
        icon: Calendar,
        color: "text-blue-500"
      },
      {
        label: "This Week",
        value: stats.thisWeekSessions.toString(),
        icon: TrendingUp,
        color: "text-green-500"
      },
      {
        label: "Upcoming",
        value: stats.upcomingSessions.toString(),
        icon: Clock,
        color: "text-orange-500"
      },
      {
        label: "Capacity Used",
        value: stats.totalCapacity > 0 ? `${Math.round((stats.totalEnrolled / stats.totalCapacity) * 100)}%` : "0%",
        icon: Users,
        color: "text-purple-500"
      }
    ]
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {getDisplayStats().map((stat, index) => (
          <Card key={index} className="glass-card border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-white/10 ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search sessions by name or coach..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 glass-input"
        />
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
                      const session = filteredSessions.find((s) => s.day === dayIndex && s.time === time)
                      return (
                        <div key={dayIndex} className="p-1 border border-white/10 rounded-lg">
                          {session && (
                            <div
                              className={`${session.color} text-white text-xs p-2 rounded-md cursor-pointer hover:opacity-90 transition-opacity`}
                            >
                              <p className="font-medium truncate">{session.name}</p>
                              <p className="opacity-80 truncate">{session.coach}</p>
                              <p className="opacity-60 text-xs">{session.enrolled}/{session.capacity}</p>
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
            {filteredUpcoming.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No upcoming sessions found</p>
                {searchTerm && <p className="text-sm">Try adjusting your search</p>}
              </div>
            ) : (
              filteredUpcoming.map((session, index) => (
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
