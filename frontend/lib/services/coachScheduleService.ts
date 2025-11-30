import { sessionService, Session } from './sessionService'

// Types
export interface ScheduleSession {
  id: string
  time: string
  name: string
  students: number
  location?: string
  duration: string
  date: string
}

export interface ScheduleDay {
  day: string
  date: string
  sessions: ScheduleSession[]
}

export interface WeeklySchedule {
  weekStart: string
  weekEnd: string
  days: ScheduleDay[]
}

class CoachScheduleService {
  // Get coach's schedule for a specific week
  async getWeeklySchedule(weekStart?: string): Promise<WeeklySchedule> {
    try {
      // Get sessions for current coach
      const sessions = await sessionService.getSessions()

      // If weekStart not provided, use current week
      const startDate = weekStart ? new Date(weekStart) : this.getWeekStart(new Date())

      // Calculate week end (6 days later)
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 6)

      // Filter sessions for the week
      const weekSessions = sessions.filter(session => {
        const sessionDate = new Date(session.startTime)
        return sessionDate >= startDate && sessionDate <= endDate
      })

      // Group sessions by day
      const days: ScheduleDay[] = []
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate)
        currentDate.setDate(startDate.getDate() + i)

        const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' })
        const dateStr = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

        const daySessions = weekSessions
          .filter(session => {
            const sessionDate = new Date(session.startTime)
            return sessionDate.toDateString() === currentDate.toDateString()
          })
          .map(session => this.formatSession(session))
          .sort((a, b) => a.time.localeCompare(b.time))

        days.push({
          day: dayName,
          date: dateStr,
          sessions: daySessions
        })
      }

      return {
        weekStart: startDate.toISOString().split('T')[0],
        weekEnd: endDate.toISOString().split('T')[0],
        days
      }
    } catch (error) {
      console.error('Error fetching coach schedule:', error)
      throw error
    }
  }

  // Get next week's schedule
  async getNextWeek(): Promise<WeeklySchedule> {
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    return this.getWeeklySchedule(this.getWeekStart(nextWeek).toISOString().split('T')[0])
  }

  // Get previous week's schedule
  async getPreviousWeek(currentWeekStart: string): Promise<WeeklySchedule> {
    const currentStart = new Date(currentWeekStart)
    const previousStart = new Date(currentStart)
    previousStart.setDate(currentStart.getDate() - 7)
    return this.getWeeklySchedule(previousStart.toISOString().split('T')[0])
  }

  private getWeekStart(date: Date): Date {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day // Adjust to Sunday (0)
    return new Date(d.setDate(diff))
  }

  private formatSession(session: Session): ScheduleSession {
    const startTime = new Date(session.startTime)
    const endTime = new Date(session.endTime)

    // Calculate duration
    const durationMs = endTime.getTime() - startTime.getTime()
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60))
    const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

    let duration: string
    if (durationHours > 0) {
      duration = durationMinutes > 0 ? `${durationHours}h ${durationMinutes}m` : `${durationHours}h`
    } else {
      duration = `${durationMinutes}m`
    }

    return {
      id: session.id,
      time: startTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      name: session.title,
      students: session.currentCapacity,
      location: session.location,
      duration,
      date: startTime.toISOString().split('T')[0]
    }
  }
}

export const coachScheduleService = new CoachScheduleService()
export default coachScheduleService