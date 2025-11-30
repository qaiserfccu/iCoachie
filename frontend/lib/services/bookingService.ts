import { apiClient } from '../api'

// Types
export interface Booking {
  id: string
  studentId: string
  sessionId: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  bookingDate: string
  notes?: string
  paymentStatus?: 'pending' | 'paid' | 'refunded'
  tenantId: string
  createdAt: string
  updatedAt: string
}

export interface CreateBookingData {
  sessionId: string
  notes?: string
}

export interface BookingStats {
  totalBookings: number
  confirmedBookings: number
  pendingBookings: number
  cancelledBookings: number
  completedBookings: number
}

class BookingService {
  private readonly baseUrl = '/bookings'

  // Get all bookings for current tenant
  async getBookings(studentId?: string, sessionId?: string, status?: string): Promise<Booking[]> {
    const params: any = {}
    if (studentId) params.studentId = studentId
    if (sessionId) params.sessionId = sessionId
    if (status) params.status = status
    return apiClient.get<Booking[]>(this.baseUrl, { params })
  }

  // Get booking by ID
  async getBooking(id: string): Promise<Booking> {
    return apiClient.get<Booking>(`${this.baseUrl}/${id}`)
  }

  // Create new booking
  async createBooking(data: CreateBookingData): Promise<Booking> {
    return apiClient.post<Booking>(this.baseUrl, data)
  }

  // Update booking
  async updateBooking(id: string, data: { status?: string, notes?: string }): Promise<Booking> {
    return apiClient.put<Booking>(`${this.baseUrl}/${id}`, data)
  }

  // Cancel booking
  async cancelBooking(id: string): Promise<Booking> {
    return apiClient.patch<Booking>(`${this.baseUrl}/${id}/cancel`)
  }

  // Confirm booking
  async confirmBooking(id: string): Promise<Booking> {
    return apiClient.patch<Booking>(`${this.baseUrl}/${id}/confirm`)
  }

  // Get student's bookings
  async getStudentBookings(studentId: string): Promise<Booking[]> {
    return apiClient.get<Booking[]>(`${this.baseUrl}/student/${studentId}`)
  }

  // Get session bookings
  async getSessionBookings(sessionId: string): Promise<Booking[]> {
    return apiClient.get<Booking[]>(`${this.baseUrl}/session/${sessionId}`)
  }

  // Get available slots for a session
  async getAvailableSlots(sessionId: string): Promise<number> {
    const response = await apiClient.get<{ availableSlots: number }>(`${this.baseUrl}/session/${sessionId}/availability`)
    return response.availableSlots
  }

  // Get booking statistics
  async getBookingStats(period?: { startDate: string, endDate: string }): Promise<BookingStats> {
    const params: any = {}
    if (period) {
      params.startDate = period.startDate
      params.endDate = period.endDate
    }
    return apiClient.get<BookingStats>(`${this.baseUrl}/stats`, { params })
  }

  // Check if student can book session
  async canBookSession(sessionId: string): Promise<{ canBook: boolean, reason?: string }> {
    return apiClient.get<{ canBook: boolean, reason?: string }>(`${this.baseUrl}/session/${sessionId}/can-book`)
  }

  // Get upcoming bookings for student
  async getUpcomingBookings(studentId: string): Promise<Booking[]> {
    return apiClient.get<Booking[]>(`${this.baseUrl}/student/${studentId}/upcoming`)
  }

  // Get booking history for student
  async getBookingHistory(studentId: string): Promise<Booking[]> {
    return apiClient.get<Booking[]>(`${this.baseUrl}/student/${studentId}/history`)
  }
}

export const bookingService = new BookingService()
export default bookingService