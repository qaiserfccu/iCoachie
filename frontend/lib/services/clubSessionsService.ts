import { sessionService, coachService, clubService } from './index'

export interface CalendarSession {
  id: string
  name: string
  day: number // 0-6 for Monday-Sunday
  time: string // HH:MM format
  duration: number // hours
  coach: string
  color: string
  location?: string
  enrolled: number
  capacity: number
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
}

export interface UpcomingSession {
  id: string
  name: string
  time: string
  coach: string
  enrolled: number
  capacity: number
  location?: string
  status: 'upcoming' | 'ongoing' | 'completed'
}

export interface SessionStats {
  totalSessions: number
  thisWeekSessions: number
  upcomingSessions: number
  completedSessions: number
  totalCapacity: number
  totalEnrolled: number
}

class ClubSessionsService {
  // Get all sessions formatted for calendar display
  async getCalendarSessions(startDate?: Date, endDate?: Date): Promise<CalendarSession[]> {
    try {
      // Get club info
      const clubs = await clubService.getClubs()
      const club = clubs[0]

      if (!club) {
        return []
      }

      // Get sessions for the club
      const sessions = await sessionService.getSessions(club.id)

      // Get coaches for name lookup
      const coaches = await coachService.getCoaches()
      const coachMap = new Map(coaches.map(coach => [coach.id.toString(), coach.name]))

      // Filter sessions by date range if provided
      let filteredSessions = sessions
      if (startDate && endDate) {
        filteredSessions = sessions.filter(session => {
          const sessionDate = new Date(session.startTime)
          return sessionDate >= startDate && sessionDate <= endDate
        })
      }

      // Convert sessions to calendar format
      const calendarSessions = await Promise.all(
        filteredSessions.map(async (session) => {
          const sessionDate = new Date(session.startTime)
          const dayOfWeek = sessionDate.getDay() // 0 = Sunday, 1 = Monday, etc.
          const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Convert to 0 = Monday, 6 = Sunday

          // Get attendance count
          let enrolled = 0
          try {
            const attendance = await sessionService.getSessionAttendance(session.id)
            enrolled = attendance.length
          } catch (error) {
            // Attendance might not be available, use 0
            enrolled = 0
          }

          return {
            id: session.id,
            name: session.title,
            day: adjustedDay,
            time: sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            duration: Math.round((new Date(session.endTime).getTime() - sessionDate.getTime()) / (1000 * 60 * 60)),
            coach: coachMap.get(session.coachId.toString()) || 'Unknown Coach',
            color: this.getSessionColor(session.title),
            location: session.location,
            enrolled,
            capacity: session.maxCapacity,
            status: session.status
          }
        })
      )

      return calendarSessions
    } catch (error) {
      console.error('Error fetching calendar sessions:', error)
      return []
    }
  }

  // Get upcoming sessions (next 7 days)
  async getUpcomingSessions(): Promise<UpcomingSession[]> {
    try {
      const now = new Date()
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

      const calendarSessions = await this.getCalendarSessions(now, nextWeek)

      // Convert to upcoming format and sort by date/time
      const upcomingSessions = calendarSessions
        .map(session => ({
          id: session.id,
          name: session.name,
          time: this.formatUpcomingTime(session.day, session.time),
          coach: session.coach,
          enrolled: session.enrolled,
          capacity: session.capacity,
          location: session.location,
          status: this.getUpcomingStatus(session.day, session.time)
        }))
        .sort((a, b) => {
          // Sort by status priority (upcoming first), then by time
          const statusOrder = { upcoming: 0, ongoing: 1, completed: 2 }
          const statusDiff = statusOrder[a.status] - statusOrder[b.status]
          if (statusDiff !== 0) return statusDiff

          return a.time.localeCompare(b.time)
        })
        .slice(0, 10) // Limit to 10 upcoming sessions

      return upcomingSessions
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error)
      return []
    }
  }

  // Get session statistics
  async getSessionStats(): Promise<SessionStats> {
    try {
      // Get club info
      const clubs = await clubService.getClubs()
      const club = clubs[0]

      if (!club) {
        return {
          totalSessions: 0,
          thisWeekSessions: 0,
          upcomingSessions: 0,
          completedSessions: 0,
          totalCapacity: 0,
          totalEnrolled: 0
        }
      }

      const sessions = await sessionService.getSessions(club.id)
      const now = new Date()
      const weekStart = new Date(now.getTime() - now.getDay() * 24 * 60 * 60 * 1000)
      const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)

      // Calculate stats
      let totalCapacity = 0
      let totalEnrolled = 0
      let thisWeekSessions = 0
      let upcomingSessions = 0
      let completedSessions = 0

      for (const session of sessions) {
        const sessionDate = new Date(session.startTime)

        // Check if session is this week
        if (sessionDate >= weekStart && sessionDate <= weekEnd) {
          thisWeekSessions++
        }

        // Check if session is upcoming
        if (sessionDate > now && session.status === 'scheduled') {
          upcomingSessions++
        }

        // Check if session is completed
        if (session.status === 'completed') {
          completedSessions++
        }

        // Get attendance for capacity/enrolled counts
        try {
          const attendance = await sessionService.getSessionAttendance(session.id)
          totalCapacity += session.maxCapacity
          totalEnrolled += attendance.length
        } catch (error) {
          totalCapacity += session.maxCapacity
        }
      }

      return {
        totalSessions: sessions.length,
        thisWeekSessions,
        upcomingSessions,
        completedSessions,
        totalCapacity,
        totalEnrolled
      }
    } catch (error) {
      console.error('Error fetching session stats:', error)
      return {
        totalSessions: 0,
        thisWeekSessions: 0,
        upcomingSessions: 0,
        completedSessions: 0,
        totalCapacity: 0,
        totalEnrolled: 0
      }
    }
  }

  private getSessionColor(title: string): string {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-purple-500',
      'bg-red-500', 'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500'
    ]

    // Simple hash function to assign consistent colors based on title
    let hash = 0
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash)
    }

    return colors[Math.abs(hash) % colors.length]
  }

  private formatUpcomingTime(dayOffset: number, time: string): string {
    const now = new Date()
    const sessionDate = new Date(now)

    // Calculate the actual date for this session
    const daysToAdd = dayOffset - now.getDay() + 1 // Adjust for Monday start
    if (daysToAdd <= 0) {
      sessionDate.setDate(now.getDate() + daysToAdd + 7)
    } else {
      sessionDate.setDate(now.getDate() + daysToAdd)
    }

    const dayName = sessionDate.toLocaleDateString('en-US', { weekday: 'long' })
    const dateStr = sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

    // Check if it's today or tomorrow
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    if (sessionDate.toDateString() === today.toDateString()) {
      return `Today, ${time}`
    } else if (sessionDate.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${time}`
    } else {
      return `${dayName}, ${time}`
    }
  }

  private getUpcomingStatus(dayOffset: number, time: string): 'upcoming' | 'ongoing' | 'completed' {
    const now = new Date()
    const sessionDate = new Date(now)

    // Calculate the actual date for this session
    const daysToAdd = dayOffset - now.getDay() + 1
    if (daysToAdd <= 0) {
      sessionDate.setDate(now.getDate() + daysToAdd + 7)
    } else {
      sessionDate.setDate(now.getDate() + daysToAdd)
    }

    // Set the time
    const [hours, minutes] = time.split(':').map(Number)
    sessionDate.setHours(hours, minutes, 0, 0)

    const sessionEnd = new Date(sessionDate)
    sessionEnd.setHours(sessionEnd.getHours() + 1) // Assume 1 hour duration for status

    if (now < sessionDate) return 'upcoming'
    if (now >= sessionDate && now <= sessionEnd) return 'ongoing'
    return 'completed'
  }
}

export const clubSessionsService = new ClubSessionsService()
export default clubSessionsService