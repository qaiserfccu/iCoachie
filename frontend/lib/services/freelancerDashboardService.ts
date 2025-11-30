import { bookingService, Booking } from './bookingService'
import { reviewService, Review, ReviewStats } from './reviewService'
import { sessionService, Session } from './sessionService'
import { paymentService } from './paymentService'

// Types
export interface FreelancerStats {
  totalEarnings: number
  weeklyEarnings: number
  activeClients: number
  monthlyClientGrowth: number
  sessionsThisWeek: number
  completedSessions: number
  averageRating: number
  totalReviews: number
}

export interface FreelancerBooking {
  id: string
  time: string
  clientName: string
  type: string
  duration: string
  amount: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  date: string
}

export interface FreelancerClient {
  id: string
  name: string
  avatar: string
  sessionsCount: number
  totalSpent: number
  lastSession: string
  averageRating: number
}

export interface FreelancerReview {
  id: string
  clientName: string
  rating: number
  comment: string
  date: string
}

class FreelancerDashboardService {
  // Get freelancer dashboard statistics
  async getFreelancerStats(): Promise<FreelancerStats> {
    try {
      // Get current week dates
      const now = new Date()
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)

      // Get freelancer's sessions and bookings
      const sessions = await sessionService.getSessions()
      const bookings = await bookingService.getBookings()

      // Filter for current week sessions
      const weekSessions = sessions.filter(session => {
        const sessionDate = new Date(session.startTime)
        return sessionDate >= weekStart && sessionDate <= weekEnd
      })

      // Calculate earnings from payments
      const payments = await paymentService.getPayments()
      const freelancerPayments = payments.filter(p => p.status === 'completed')

      const totalEarnings = freelancerPayments.reduce((sum, payment) => sum + payment.amount, 0)
      const weeklyEarnings = freelancerPayments
        .filter(payment => {
          const paymentDate = new Date(payment.createdAt)
          return paymentDate >= weekStart && paymentDate <= weekEnd
        })
        .reduce((sum, payment) => sum + payment.amount, 0)

      // Get unique clients from bookings
      const uniqueClients = new Set(bookings.map(b => b.studentId))
      const activeClients = uniqueClients.size

      // Calculate monthly client growth (simplified - compare to last month)
      const lastMonth = new Date()
      lastMonth.setMonth(lastMonth.getMonth() - 1)
      const lastMonthClients = new Set(
        bookings
          .filter(b => new Date(b.createdAt) >= lastMonth && new Date(b.createdAt) < weekStart)
          .map(b => b.studentId)
      )
      const monthlyClientGrowth = activeClients - lastMonthClients.size

      // Count sessions this week and completed
      const sessionsThisWeek = weekSessions.length
      const completedSessions = bookings.filter(b => b.status === 'completed').length

      // Get review stats
      const reviews = await reviewService.getReviews()
      const freelancerReviews = reviews.filter(r => r.reviewType === 'coach_review')

      const averageRating = freelancerReviews.length > 0
        ? freelancerReviews.reduce((sum, r) => sum + r.rating, 0) / freelancerReviews.length
        : 0

      return {
        totalEarnings,
        weeklyEarnings,
        activeClients,
        monthlyClientGrowth,
        sessionsThisWeek,
        completedSessions,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: freelancerReviews.length
      }
    } catch (error) {
      console.error('Error fetching freelancer stats:', error)
      throw error
    }
  }

  // Get upcoming bookings for freelancer
  async getUpcomingBookings(): Promise<FreelancerBooking[]> {
    try {
      const sessions = await sessionService.getSessions()
      const bookings = await bookingService.getBookings()

      // Get upcoming sessions with confirmed bookings
      const upcomingSessions = sessions
        .filter(session => {
          const sessionDate = new Date(session.startTime)
          return sessionDate >= new Date() && session.status === 'scheduled'
        })
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        .slice(0, 10) // Limit to next 10

      return upcomingSessions.map(session => {
        const booking = bookings.find(b => b.sessionId === session.id && b.status === 'confirmed')
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
          time: this.formatBookingTime(startTime),
          clientName: booking ? 'Client Name' : 'TBD', // Would need student data
          type: session.title,
          duration,
          amount: session.price || 0,
          status: booking ? booking.status : 'pending',
          date: startTime.toISOString().split('T')[0]
        }
      })
    } catch (error) {
      console.error('Error fetching upcoming bookings:', error)
      throw error
    }
  }

  // Get top clients for freelancer
  async getTopClients(): Promise<FreelancerClient[]> {
    try {
      const bookings = await bookingService.getBookings()
      const payments = await paymentService.getPayments()

      // Group bookings by student
      const clientStats = new Map<string, {
        sessionsCount: number
        totalSpent: number
        lastSession: Date
        ratings: number[]
      }>()

      bookings.forEach(booking => {
        if (!clientStats.has(booking.studentId)) {
          clientStats.set(booking.studentId, {
            sessionsCount: 0,
            totalSpent: 0,
            lastSession: new Date(0),
            ratings: []
          })
        }

        const stats = clientStats.get(booking.studentId)!
        stats.sessionsCount++

        // Find related payment
        const payment = payments.find(p => p.bookingId === booking.id)
        if (payment) {
          stats.totalSpent += payment.amount
        }

        // Update last session
        const sessionDate = new Date(booking.bookingDate)
        if (sessionDate > stats.lastSession) {
          stats.lastSession = sessionDate
        }
      })

      // Convert to array and sort by total spent
      const clients = Array.from(clientStats.entries())
        .map(([studentId, stats]) => ({
          id: studentId,
          name: `Student ${studentId.slice(0, 8)}`, // Would need student data for real name
          avatar: studentId.slice(0, 2).toUpperCase(),
          sessionsCount: stats.sessionsCount,
          totalSpent: stats.totalSpent,
          lastSession: this.formatRelativeTime(stats.lastSession),
          averageRating: stats.ratings.length > 0
            ? stats.ratings.reduce((sum, r) => sum + r, 0) / stats.ratings.length
            : 5.0
        }))
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 5) // Top 5 clients

      return clients
    } catch (error) {
      console.error('Error fetching top clients:', error)
      throw error
    }
  }

  // Get recent reviews for freelancer
  async getRecentReviews(): Promise<FreelancerReview[]> {
    try {
      const reviews = await reviewService.getReviews()
      const freelancerReviews = reviews
        .filter(r => r.reviewType === 'coach_review')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5) // Most recent 5

      return freelancerReviews.map(review => ({
        id: review.id,
        clientName: `Client ${review.reviewerId.slice(0, 8)}`, // Would need user data for real name
        rating: review.rating,
        comment: review.content,
        date: this.formatRelativeTime(new Date(review.createdAt))
      }))
    } catch (error) {
      console.error('Error fetching recent reviews:', error)
      throw error
    }
  }

  private formatBookingTime(date: Date): string {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })}`
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })}`
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }
  }

  private formatRelativeTime(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }
}

export const freelancerDashboardService = new FreelancerDashboardService()
export default freelancerDashboardService