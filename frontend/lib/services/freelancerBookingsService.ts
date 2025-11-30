import { bookingService, Booking } from './bookingService'
import { sessionService, Session } from './sessionService'
import { studentService, Student } from './studentService'

// Types
export interface FreelancerBooking {
  id: string
  client: string
  avatar: string
  type: string
  date: string
  time: string
  duration: string
  amount: number
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  sessionId?: string
  studentId?: string
}

export interface BookingStats {
  confirmed: number
  pending: number
  completed: number
  cancelled: number
}

class FreelancerBookingsService {
  // Get all bookings for the freelancer
  async getFreelancerBookings(): Promise<FreelancerBooking[]> {
    try {
      const bookings = await bookingService.getBookings()
      const sessions = await sessionService.getSessions()

      // Filter bookings for freelancer (assuming current user is freelancer)
      // In a real app, this would filter by freelancer/coach ID
      const freelancerBookings = bookings.map(booking => {
        const session = sessions.find(s => s.id === booking.sessionId)

        if (!session) return null

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
          id: booking.id,
          client: `Student ${booking.studentId.slice(0, 8)}`, // Would need student data for real name
          avatar: booking.studentId.slice(0, 2).toUpperCase(),
          type: session.title,
          date: startTime.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          time: startTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }),
          duration,
          amount: session.price || 0,
          status: booking.status,
          sessionId: session.id,
          studentId: booking.studentId
        }
      }).filter(Boolean) as FreelancerBooking[]

      // Sort by date (most recent first)
      return freelancerBookings.sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`)
        const dateB = new Date(`${b.date} ${b.time}`)
        return dateB.getTime() - dateA.getTime()
      })
    } catch (error) {
      console.error('Error fetching freelancer bookings:', error)
      throw error
    }
  }

  // Get booking statistics
  async getBookingStats(): Promise<BookingStats> {
    try {
      const bookings = await bookingService.getBookings()

      const stats = {
        confirmed: 0,
        pending: 0,
        completed: 0,
        cancelled: 0
      }

      bookings.forEach(booking => {
        switch (booking.status) {
          case 'confirmed':
            stats.confirmed++
            break
          case 'pending':
            stats.pending++
            break
          case 'completed':
            stats.completed++
            break
          case 'cancelled':
            stats.cancelled++
            break
        }
      })

      return stats
    } catch (error) {
      console.error('Error fetching booking stats:', error)
      throw error
    }
  }

  // Accept a booking
  async acceptBooking(bookingId: string): Promise<void> {
    try {
      await bookingService.updateBooking(bookingId, { status: 'confirmed' })
    } catch (error) {
      console.error('Error accepting booking:', error)
      throw error
    }
  }

  // Decline a booking
  async declineBooking(bookingId: string): Promise<void> {
    try {
      await bookingService.updateBooking(bookingId, { status: 'cancelled' })
    } catch (error) {
      console.error('Error declining booking:', error)
      throw error
    }
  }

  // Cancel a booking
  async cancelBooking(bookingId: string): Promise<void> {
    try {
      await bookingService.updateBooking(bookingId, { status: 'cancelled' })
    } catch (error) {
      console.error('Error cancelling booking:', error)
      throw error
    }
  }

  // Get upcoming bookings
  async getUpcomingBookings(): Promise<FreelancerBooking[]> {
    try {
      const allBookings = await this.getFreelancerBookings()
      const now = new Date()

      return allBookings.filter(booking => {
        const bookingDate = new Date(`${booking.date} ${booking.time}`)
        return bookingDate >= now && (booking.status === 'confirmed' || booking.status === 'pending')
      }).slice(0, 10) // Limit to next 10
    } catch (error) {
      console.error('Error fetching upcoming bookings:', error)
      throw error
    }
  }

  // Search bookings
  async searchBookings(query: string): Promise<FreelancerBooking[]> {
    try {
      const allBookings = await this.getFreelancerBookings()

      if (!query.trim()) return allBookings

      const lowerQuery = query.toLowerCase()
      return allBookings.filter(booking =>
        booking.client.toLowerCase().includes(lowerQuery) ||
        booking.type.toLowerCase().includes(lowerQuery) ||
        booking.status.toLowerCase().includes(lowerQuery)
      )
    } catch (error) {
      console.error('Error searching bookings:', error)
      throw error
    }
  }
}

export const freelancerBookingsService = new FreelancerBookingsService()
export default freelancerBookingsService