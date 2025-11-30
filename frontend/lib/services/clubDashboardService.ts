import { clubService, sessionService, paymentService, evaluationService, studentService } from './index'

interface ClubStats {
  totalMembers: number
  activeCoaches: number
  sessionsToday: number
  monthlyRevenue: number
  revenueChange: string
}

interface TodaySession {
  id: string
  time: string
  name: string
  coach: string
  enrolled: number
  capacity: number
  status: 'completed' | 'ongoing' | 'upcoming'
}

interface TopPerformer {
  id: string
  name: string
  sport: string
  progress: number
  badge: 'Gold' | 'Silver' | 'Bronze'
}

interface RecentPayment {
  id: string
  member: string
  amount: string
  type: string
  date: string
  status: 'completed' | 'pending'
}

class ClubDashboardService {
  // Get club statistics
  async getClubStats(): Promise<ClubStats> {
    try {
      // Get club info (assuming first club for current tenant)
      const clubs = await clubService.getClubs()
      const club = clubs[0]

      if (!club) {
        throw new Error('No club found')
      }

      // Get club-specific stats
      const clubStats = await clubService.getClubStats(club.id)

      // Get today's sessions
      const today = new Date()
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)

      const todaySessions = await sessionService.getSessions(club.id)
      const todaysSessions = todaySessions.filter(session => {
        const sessionDate = new Date(session.startTime)
        return sessionDate >= startOfDay && sessionDate <= endOfDay
      })

      // Get monthly payment stats
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59)

      const paymentStats = await paymentService.getPaymentStats({
        startDate: startOfMonth.toISOString(),
        endDate: endOfMonth.toISOString()
      })

      // Get previous month for comparison
      const prevMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      const prevMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59)

      const prevPaymentStats = await paymentService.getPaymentStats({
        startDate: prevMonthStart.toISOString(),
        endDate: prevMonthEnd.toISOString()
      })

      const revenueChange = prevPaymentStats.totalRevenue > 0
        ? `${Math.round(((paymentStats.totalRevenue - prevPaymentStats.totalRevenue) / prevPaymentStats.totalRevenue) * 100)}%`
        : '+0%'

      return {
        totalMembers: clubStats?.totalMembers || 0,
        activeCoaches: clubStats?.activeCoaches || 0,
        sessionsToday: todaysSessions.length,
        monthlyRevenue: paymentStats.totalRevenue,
        revenueChange: revenueChange.startsWith('-') ? revenueChange : `+${revenueChange}`
      }
    } catch (error) {
      // Return default values if API calls fail
      return {
        totalMembers: 0,
        activeCoaches: 0,
        sessionsToday: 0,
        monthlyRevenue: 0,
        revenueChange: '+0%'
      }
    }
  }

  // Get today's sessions
  async getTodaysSessions(): Promise<TodaySession[]> {
    try {
      // Get club info
      const clubs = await clubService.getClubs()
      const club = clubs[0]

      if (!club) {
        return []
      }

      // Get today's sessions
      const today = new Date()
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)

      const sessions = await sessionService.getSessions(club.id)
      const todaysSessions = sessions.filter(session => {
        const sessionDate = new Date(session.startTime)
        return sessionDate >= startOfDay && sessionDate <= endOfDay
      })

      // Get attendance for each session to determine enrolled count
      const sessionsWithAttendance = await Promise.all(
        todaysSessions.map(async (session) => {
          try {
            const attendance = await sessionService.getSessionAttendance(session.id)
            return {
              id: session.id,
              time: new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              name: session.title,
              coach: 'Coach Name', // Would need coach service to get coach name
              enrolled: attendance.length,
              capacity: session.maxCapacity,
              status: this.getSessionStatus(session.startTime, session.endTime)
            }
          } catch (error) {
            return {
              id: session.id,
              time: new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              name: session.title,
              coach: 'Coach Name',
              enrolled: 0,
              capacity: session.maxCapacity,
              status: this.getSessionStatus(session.startTime, session.endTime)
            }
          }
        })
      )

      return sessionsWithAttendance
    } catch (error) {
      return []
    }
  }

  // Get top performers
  async getTopPerformers(): Promise<TopPerformer[]> {
    try {
      // Get all students
      const students = await studentService.getStudents()

      // Get evaluation stats for each student
      const studentsWithStats = await Promise.all(
        students.map(async (student) => {
          try {
            const stats = await evaluationService.getStudentEvaluationStats(student.id)
            return {
              id: student.id,
              name: `${student.firstName} ${student.lastName}`,
              sport: 'General', // Would need session/sport data
              progress: stats?.averageRating ? Math.round(stats.averageRating * 20) : 0
            }
          } catch (error) {
            return {
              id: student.id,
              name: `${student.firstName} ${student.lastName}`,
              sport: 'General',
              progress: 0
            }
          }
        })
      )

      // Sort by progress and take top 3
      const topPerformers = studentsWithStats
        .sort((a, b) => b.progress - a.progress)
        .slice(0, 3)
        .map((performer, index) => ({
          ...performer,
          badge: index === 0 ? 'Gold' : index === 1 ? 'Silver' : 'Bronze' as 'Gold' | 'Silver' | 'Bronze'
        }))

      return topPerformers
    } catch (error) {
      return []
    }
  }

  // Get recent payments
  async getRecentPayments(): Promise<RecentPayment[]> {
    try {
      // Get recent payments
      const payments = await paymentService.getPayments()
      const recentPayments = payments
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)

      // Get student names for payments
      const paymentsWithNames = await Promise.all(
        recentPayments.map(async (payment) => {
          try {
            const student = await studentService.getStudent(payment.studentId)
            return {
              id: payment.id,
              member: `${student.firstName} ${student.lastName}`,
              amount: `$${payment.amount}`,
              type: payment.description || 'Payment',
              date: this.formatDate(payment.createdAt),
              status: payment.status
            }
          } catch (error) {
            return {
              id: payment.id,
              member: 'Unknown Student',
              amount: `$${payment.amount}`,
              type: payment.description || 'Payment',
              date: this.formatDate(payment.createdAt),
              status: payment.status
            }
          }
        })
      )

      return paymentsWithNames
    } catch (error) {
      return []
    }
  }

  private getSessionStatus(startTime: string, endTime: string): 'completed' | 'ongoing' | 'upcoming' {
    const now = new Date()
    const start = new Date(startTime)
    const end = new Date(endTime)

    if (now < start) return 'upcoming'
    if (now >= start && now <= end) return 'ongoing'
    return 'completed'
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }
}

export const clubDashboardService = new ClubDashboardService()
export default clubDashboardService