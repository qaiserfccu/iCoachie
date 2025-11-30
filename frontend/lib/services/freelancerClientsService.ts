import { apiClient } from "@/lib/api/client"
import { studentService } from "./studentService"
import { bookingService } from "./bookingService"
import { reviewService } from "./reviewService"
import { paymentService } from "./paymentService"
import { sessionService } from "./sessionService"

export interface FreelancerClient {
  id: string
  name: string
  avatar: string
  sessions: number
  totalSpent: number
  rating: number
  lastSession: string
  nextSession: string
  status: "Active" | "Inactive"
}

export interface ClientStats {
  totalClients: number
  activeClients: number
  totalRevenue: number
  averageRating: number
}

class FreelancerClientsService {
  async getFreelancerClients(): Promise<FreelancerClient[]> {
    try {
      // Get all bookings for this freelancer
      const bookings = await bookingService.getBookings()

      // Get all sessions for this freelancer
      const sessions = await sessionService.getSessions()

      // Get all reviews for this freelancer
      const reviews = await reviewService.getReviews()

      // Get all payments for this freelancer
      const payments = await paymentService.getPayments()

      // Aggregate client data from bookings and sessions
      const clientMap = new Map<string, {
        id: string
        name: string
        sessions: number
        totalSpent: number
        ratings: number[]
        lastSession: Date | null
        nextSession: Date | null
        bookingCount: number
      }>()

      // Process bookings to get client information
      for (const booking of bookings) {
        if (!clientMap.has(booking.studentId)) {
          clientMap.set(booking.studentId, {
            id: booking.studentId,
            name: booking.student?.name || "Unknown Client",
            sessions: 0,
            totalSpent: 0,
            ratings: [],
            lastSession: null,
            nextSession: null,
            bookingCount: 0
          })
        }
        const client = clientMap.get(booking.studentId)!
        client.bookingCount++
      }

      // Process sessions to get session counts and dates
      for (const session of sessions) {
        if (session.studentId && clientMap.has(session.studentId)) {
          const client = clientMap.get(session.studentId)!
          client.sessions++

          const sessionDate = new Date(session.startTime)
          if (!client.lastSession || sessionDate > client.lastSession) {
            client.lastSession = sessionDate
          }

          // Check if this is a future session
          if (sessionDate > new Date() && (!client.nextSession || sessionDate < client.nextSession)) {
            client.nextSession = sessionDate
          }
        }
      }

      // Process payments to get total spent
      for (const payment of payments) {
        if (payment.studentId && clientMap.has(payment.studentId)) {
          const client = clientMap.get(payment.studentId)!
          client.totalSpent += payment.amount
        }
      }

      // Process reviews to get ratings
      for (const review of reviews) {
        if (review.studentId && clientMap.has(review.studentId)) {
          const client = clientMap.get(review.studentId)!
          client.ratings.push(review.rating)
        }
      }

      // Convert to FreelancerClient format
      const clients: FreelancerClient[] = Array.from(clientMap.values()).map(client => {
        const averageRating = client.ratings.length > 0
          ? Math.round(client.ratings.reduce((a, b) => a + b, 0) / client.ratings.length)
          : 5

        const now = new Date()
        const lastSessionDate = client.lastSession
        const nextSessionDate = client.nextSession

        // Determine status based on recent activity
        const isActive = client.sessions > 0 &&
          (!lastSessionDate || (now.getTime() - lastSessionDate.getTime()) < 30 * 24 * 60 * 60 * 1000) // 30 days

        return {
          id: client.id,
          name: client.name,
          avatar: client.name.split(' ').map(n => n[0]).join('').toUpperCase(),
          sessions: client.sessions,
          totalSpent: client.totalSpent,
          rating: averageRating,
          lastSession: lastSessionDate ? this.formatDate(lastSessionDate) : "Never",
          nextSession: nextSessionDate ? this.formatDate(nextSessionDate) : "Pending",
          status: isActive ? "Active" : "Inactive"
        }
      })

      return clients.sort((a, b) => {
        // Sort by status (Active first), then by last session date
        if (a.status !== b.status) {
          return a.status === "Active" ? -1 : 1
        }
        return new Date(b.lastSession).getTime() - new Date(a.lastSession).getTime()
      })

    } catch (error) {
      console.error('Error fetching freelancer clients:', error)
      throw error
    }
  }

  async getClientStats(): Promise<ClientStats> {
    try {
      const clients = await this.getFreelancerClients()

      const totalClients = clients.length
      const activeClients = clients.filter(c => c.status === "Active").length
      const totalRevenue = clients.reduce((sum, client) => sum + client.totalSpent, 0)
      const averageRating = clients.length > 0
        ? clients.reduce((sum, client) => sum + client.rating, 0) / clients.length
        : 0

      return {
        totalClients,
        activeClients,
        totalRevenue,
        averageRating: Math.round(averageRating * 10) / 10
      }
    } catch (error) {
      console.error('Error fetching client stats:', error)
      throw error
    }
  }

  async searchClients(query: string): Promise<FreelancerClient[]> {
    try {
      const clients = await this.getFreelancerClients()
      const lowerQuery = query.toLowerCase()

      return clients.filter(client =>
        client.name.toLowerCase().includes(lowerQuery) ||
        client.status.toLowerCase().includes(lowerQuery)
      )
    } catch (error) {
      console.error('Error searching clients:', error)
      throw error
    }
  }

  private formatDate(date: Date): string {
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`

    return date.toLocaleDateString()
  }
}

export const freelancerClientsService = new FreelancerClientsService()