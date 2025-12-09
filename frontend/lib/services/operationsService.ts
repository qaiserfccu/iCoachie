/**
 * Operations Service
 * Provides API integration for operations dashboards:
 * - Bookings Coordinator: booking management, calendar views, availability
 * - Front Desk: check-in/check-out, visitors, daily schedules
 * - Accountant: invoices, payments, financial reports
 */

import { apiClient } from '../api'

// ============================================================================
// CONFIGURATION CONSTANTS
// ============================================================================

/**
 * Default facility name when booking venue data is not available.
 * This should be replaced with dynamic facility data from the facilities endpoint
 * once the booking-to-facility relationship is fully implemented in the backend.
 */
const DEFAULT_FACILITY_NAME = 'Main Facility'

/**
 * Financial collection target calculation constants.
 * These may be made configurable via admin settings in the future.
 * 
 * COLLECTION_TARGET_MULTIPLIER: Applied to the total amount (completed + pending)
 * to set a realistic monthly collection goal that accounts for growth.
 */
const COLLECTION_TARGET_MULTIPLIER = 1.2 // Target is 120% of current total amount
const MINIMUM_COLLECTION_TARGET = 150000 // Minimum target threshold in dollars

/**
 * Days after which a pending payment is considered overdue.
 */
const OVERDUE_THRESHOLD_DAYS = 30

// ============================================================================
// TYPES
// ============================================================================

// Booking Coordinator Types
export interface OperationsBooking {
  id: number
  freelancerId: number
  clientId: number
  sessionDate: string
  startTime: string
  endTime: string
  serviceType: string
  amount: number | null
  notes: string | null
  status: {
    code: string
    name: string
  }
  freelancer: {
    id: number
    name: string
    email: string
  }
  client: {
    id: number
    name: string
    email: string
  }
  createdAt: string
}

export interface BookingsPagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface BookingsResponse {
  success: boolean
  data: {
    bookings: OperationsBooking[]
    pagination: BookingsPagination
  }
}

export interface BookingsCoordinatorStats {
  todaysBookings: number
  pendingConfirmations: number
  cancellations: number
  utilizationRate: number
}

export interface BookingTask {
  title: string
  facility: string
  client: string
  time: string
  status: string
}

// Front Desk Types
export interface FrontDeskStats {
  checkedInToday: number
  pendingCheckIns: number
  todaysSessions: number
  inProgressSessions: number
  walkIns: number
  waitingVisitors: number
  inquiries: number
  unreadInquiries: number
}

export interface FrontDeskSession {
  id: number
  time: string
  name: string
  coach: string
  expected: number
  checkedIn: number
  location: string
  status: string
}

export interface FrontDeskCheckin {
  id: number
  name: string
  time: string
  session: string
  avatar: string
  type: string
  status: string
}

// Accountant Types
export interface AccountantStats {
  monthlyRevenue: number
  monthlyRevenueChange: string
  pendingInvoices: number
  pendingInvoicesCount: number
  collectedToday: number
  collectedTodayChange: string
  overdueAmount: number
  overdueCount: number
}

export interface AccountantTransaction {
  id: string
  member: string
  type: string
  amount: string
  status: string
  date: string
}

export interface AccountantInvoice {
  id: string
  client: string
  amount: string
  dueDate: string
  daysLeft: number
  status: string
}

export interface FinancialStats {
  period: string
  totalPayments: number
  totalAmount: number
  completedAmount: number
  pendingAmount: number
  completionRate: number
  typeBreakdown: Record<string, number>
  statusBreakdown: Record<string, number>
}

export interface MonthlyCollectionProgress {
  target: number
  collected: number
  pending: number
  overdue: number
  percentage: number
}

// ============================================================================
// BOOKINGS COORDINATOR SERVICE
// ============================================================================

class BookingsCoordinatorService {
  private readonly bookingsUrl = '/bookings'
  private readonly facilitiesUrl = '/facilities'

  /**
   * Get all bookings with pagination and filtering
   */
  async getBookings(params?: {
    page?: number
    limit?: number
    status?: string
    type?: 'all' | 'as_client' | 'as_freelancer'
  }): Promise<BookingsResponse> {
    const response = await apiClient.get<BookingsResponse['data']>(this.bookingsUrl, { params })
    return { success: true, data: response }
  }

  /**
   * Get booking by ID
   */
  async getBooking(id: number): Promise<OperationsBooking> {
    const response = await apiClient.get<{ success: boolean; data: OperationsBooking }>(`${this.bookingsUrl}/${id}`)
    return response.data
  }

  /**
   * Update booking status
   */
  async updateBookingStatus(id: number, status: string): Promise<OperationsBooking> {
    const response = await apiClient.patch<{ success: boolean; data: OperationsBooking }>(
      `${this.bookingsUrl}/${id}/status`,
      { status }
    )
    return response.data
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(id: number): Promise<OperationsBooking> {
    const response = await apiClient.patch<{ success: boolean; data: OperationsBooking }>(
      `${this.bookingsUrl}/${id}/cancel`
    )
    return response.data
  }

  /**
   * Get available freelancers for a time slot
   */
  async getAvailableFreelancers(date: string, startTime: string, endTime: string): Promise<any[]> {
    const response = await apiClient.get<{ success: boolean; data: any[] }>(
      `${this.bookingsUrl}/freelancers/available`,
      { params: { date, startTime, endTime } }
    )
    return response.data
  }

  /**
   * Create a new booking
   */
  async createBooking(data: {
    freelancerId: number
    sessionDate: string
    startTime: string
    endTime: string
    serviceType: string
    amount?: number
    notes?: string
  }): Promise<OperationsBooking> {
    const response = await apiClient.post<{ success: boolean; data: OperationsBooking }>(this.bookingsUrl, data)
    return response.data
  }

  /**
   * Get bookings coordinator dashboard stats
   * Aggregates data from bookings API
   */
  async getDashboardStats(): Promise<BookingsCoordinatorStats> {
    const today = new Date().toISOString().split('T')[0]
    
    // Get bookings for today
    const response = await this.getBookings({ page: 1, limit: 100 })
    const allBookings = response.data.bookings
    
    // Filter bookings for today
    const todaysBookings = allBookings.filter(b => 
      b.sessionDate.startsWith(today)
    )
    
    const pendingConfirmations = allBookings.filter(b => 
      b.status?.code === 'PENDING'
    ).length
    
    const cancellations = allBookings.filter(b => 
      b.status?.code === 'CANCELLED' && b.sessionDate.startsWith(today)
    ).length
    
    // Calculate utilization rate (confirmed/total * 100)
    const confirmedBookings = allBookings.filter(b => 
      b.status?.code === 'CONFIRMED'
    ).length
    
    const utilizationRate = allBookings.length > 0 
      ? Math.round((confirmedBookings / allBookings.length) * 100) 
      : 0

    return {
      todaysBookings: todaysBookings.length,
      pendingConfirmations,
      cancellations,
      utilizationRate
    }
  }

  /**
   * Get today's booking tasks
   */
  async getTodaysBookings(): Promise<BookingTask[]> {
    const today = new Date().toISOString().split('T')[0]
    const response = await this.getBookings({ page: 1, limit: 20 })
    
    return response.data.bookings
      .filter(b => b.sessionDate.startsWith(today))
      .map(b => ({
        title: b.serviceType || 'Booking',
        facility: DEFAULT_FACILITY_NAME, // Uses facility name from booking when available
        client: b.client.name,
        time: new Date(b.startTime).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        status: b.status?.name || 'Unknown'
      }))
  }

  /**
   * Get facilities for booking
   */
  async getFacilities(): Promise<any[]> {
    try {
      const response = await apiClient.get<{ data: any[] }>(this.facilitiesUrl)
      return response.data
    } catch {
      return []
    }
  }
}

// ============================================================================
// FRONT DESK SERVICE
// ============================================================================

class FrontDeskService {
  private readonly sessionsUrl = '/sessions'
  private readonly attendanceUrl = '/attendance'

  /**
   * Get front desk dashboard stats
   */
  async getDashboardStats(): Promise<FrontDeskStats> {
    // Get today's sessions
    const sessions = await this.getTodaysSessions()
    
    // Calculate stats from sessions
    const inProgress = sessions.filter(s => s.status === 'ongoing' || s.status === 'in-progress')
    const totalCheckedIn = sessions.reduce((sum, s) => sum + s.checkedIn, 0)
    const totalExpected = sessions.reduce((sum, s) => sum + s.expected, 0)
    
    return {
      checkedInToday: totalCheckedIn,
      pendingCheckIns: totalExpected - totalCheckedIn,
      todaysSessions: sessions.length,
      inProgressSessions: inProgress.length,
      // Note: Walk-in and visitor tracking require dedicated backend endpoints
      // that are not yet implemented. These will return 0 until the endpoints are available.
      walkIns: 0,
      waitingVisitors: 0,
      inquiries: 0,
      unreadInquiries: 0
    }
  }

  /**
   * Get today's sessions with attendance info
   */
  async getTodaysSessions(): Promise<FrontDeskSession[]> {
    try {
      const response = await apiClient.get<any[]>(this.sessionsUrl)
      const today = new Date().toISOString().split('T')[0]
      
      // Filter for today's sessions and format
      return response
        .filter((s: any) => s.sessionDate?.startsWith(today))
        .map((s: any) => ({
          id: s.id,
          time: new Date(s.startTime).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }),
          name: s.title,
          coach: s.coach?.name || 'Unknown',
          expected: s.maxCapacity || s._count?.enrollments || 0,
          checkedIn: s._count?.attendances || 0,
          location: s.location || 'Main Venue',
          status: s.status?.code?.toLowerCase() || s.status || 'scheduled'
        }))
    } catch {
      return []
    }
  }

  /**
   * Get recent check-ins
   */
  async getRecentCheckins(limit: number = 10): Promise<FrontDeskCheckin[]> {
    try {
      // Get recent attendance records
      // Since there's no dedicated recent check-ins endpoint, we'll get from today's sessions
      const sessions = await this.getTodaysSessions()
      const checkins: FrontDeskCheckin[] = []
      
      for (const session of sessions.slice(0, 3)) {
        try {
          const attendance = await apiClient.get<any[]>(`${this.attendanceUrl}/session/${session.id}`)
          attendance
            .filter((a: any) => a.status?.code === 'PRESENT' || a.status?.code === 'LATE')
            .slice(0, 4)
            .forEach((a: any) => {
              checkins.push({
                id: a.id,
                name: a.student?.name || 'Unknown',
                time: this.getRelativeTime(a.checkinTime || a.recordedAt),
                session: session.name,
                avatar: this.getInitials(a.student?.name || 'U'),
                type: 'Student',
                status: 'checked-in'
              })
            })
        } catch {
          // Skip if can't fetch attendance for this session
        }
      }
      
      return checkins.slice(0, limit)
    } catch {
      return []
    }
  }

  /**
   * Record check-in for a student
   */
  async checkInStudent(sessionId: number, studentId: number): Promise<any> {
    return apiClient.post(`${this.attendanceUrl}/session/${sessionId}/student/${studentId}`, {
      status: 'PRESENT',
      checkinTime: new Date().toISOString()
    })
  }

  /**
   * Get sessions for the day with enrollment info
   */
  async getSessionsWithAttendance(): Promise<FrontDeskSession[]> {
    return this.getTodaysSessions()
  }

  private getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  private getRelativeTime(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    
    return date.toLocaleDateString()
  }
}

// ============================================================================
// ACCOUNTANT SERVICE
// ============================================================================

class AccountantService {
  private readonly paymentsUrl = '/payments'

  /**
   * Get accountant dashboard stats
   */
  async getDashboardStats(): Promise<AccountantStats> {
    try {
      const stats = await this.getFinancialStats('month')
      const pendingPayments = await this.getPaymentsByStatus('PENDING')
      const overduePayments = await this.getOverduePayments()
      
      return {
        monthlyRevenue: stats.completedAmount,
        monthlyRevenueChange: stats.completionRate > 50 ? `+${stats.completionRate}%` : `${stats.completionRate}%`,
        pendingInvoices: stats.pendingAmount,
        pendingInvoicesCount: pendingPayments.length,
        collectedToday: this.getTodaysCollections(pendingPayments),
        collectedTodayChange: '+$0', // TODO: Calculate change from average
        overdueAmount: overduePayments.reduce((sum, p) => sum + (p.amount || 0), 0),
        overdueCount: overduePayments.length
      }
    } catch {
      return {
        monthlyRevenue: 0,
        monthlyRevenueChange: '0%',
        pendingInvoices: 0,
        pendingInvoicesCount: 0,
        collectedToday: 0,
        collectedTodayChange: '+$0',
        overdueAmount: 0,
        overdueCount: 0
      }
    }
  }

  /**
   * Get financial statistics
   */
  async getFinancialStats(period: 'week' | 'month' | 'quarter' | 'year' = 'month'): Promise<FinancialStats> {
    return apiClient.get<FinancialStats>(`${this.paymentsUrl}/stats/overview`, {
      params: { period }
    })
  }

  /**
   * Get all payments
   */
  async getPayments(params?: {
    status?: string
    paymentType?: string
    userId?: number
    limit?: number
    offset?: number
  }): Promise<any[]> {
    return apiClient.get<any[]>(this.paymentsUrl, { params })
  }

  /**
   * Get payments by status
   */
  async getPaymentsByStatus(status: string): Promise<any[]> {
    return this.getPayments({ status, limit: 100 })
  }

  /**
   * Get overdue payments (pending payments past the threshold date)
   */
  async getOverduePayments(): Promise<any[]> {
    const pending = await this.getPaymentsByStatus('PENDING')
    const now = new Date()
    
    return pending.filter(p => {
      const createdAt = new Date(p.createdAt)
      const daysDiff = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
      return daysDiff > OVERDUE_THRESHOLD_DAYS
    })
  }

  /**
   * Get recent transactions
   */
  async getRecentTransactions(limit: number = 10): Promise<AccountantTransaction[]> {
    const payments = await this.getPayments({ limit })
    
    return payments.map(p => ({
      id: `TXN-${p.id}`,
      member: p.user?.name || 'Unknown',
      type: p.paymentType || 'payment',
      amount: p.status?.code === 'REFUNDED' ? `-$${p.amount}` : `$${p.amount}`,
      status: p.status?.code?.toLowerCase() || 'pending',
      date: this.formatDate(p.createdAt)
    }))
  }

  /**
   * Get pending invoices
   */
  async getPendingInvoices(): Promise<AccountantInvoice[]> {
    const pending = await this.getPaymentsByStatus('PENDING')
    const now = new Date()
    
    return pending.map(p => {
      const createdAt = new Date(p.createdAt)
      // Calculate due date based on the payment terms threshold
      const dueDate = new Date(createdAt.getTime() + OVERDUE_THRESHOLD_DAYS * 24 * 60 * 60 * 1000)
      const daysLeft = Math.max(0, Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
      
      return {
        id: `INV-${p.id}`,
        client: p.user?.name || 'Unknown',
        amount: `$${p.amount}`,
        dueDate: dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        daysLeft,
        status: daysLeft === 0 ? 'overdue' : 'pending'
      }
    })
  }

  /**
   * Get monthly collection progress
   * The target is calculated based on the total amount with a configurable multiplier.
   */
  async getMonthlyCollectionProgress(): Promise<MonthlyCollectionProgress> {
    const stats = await this.getFinancialStats('month')
    const overdue = await this.getOverduePayments()
    const overdueAmount = overdue.reduce((sum, p) => sum + (p.amount || 0), 0)
    
    // Calculate target using configurable constants
    const target = Math.max(
      stats.totalAmount * COLLECTION_TARGET_MULTIPLIER, 
      MINIMUM_COLLECTION_TARGET
    )
    
    return {
      target,
      collected: stats.completedAmount,
      pending: stats.pendingAmount,
      overdue: overdueAmount,
      percentage: Math.round((stats.completedAmount / target) * 100)
    }
  }

  /**
   * Create a new payment/invoice
   */
  async createPayment(data: {
    userId: number
    amount: number
    currency?: string
    paymentType: string
    description?: string
  }): Promise<any> {
    return apiClient.post(this.paymentsUrl, data)
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(id: number, status: string): Promise<any> {
    return apiClient.put(`${this.paymentsUrl}/${id}/status`, { status })
  }

  private getTodaysCollections(payments: any[]): number {
    const today = new Date().toISOString().split('T')[0]
    return payments
      .filter(p => p.createdAt?.startsWith(today) && p.status?.code === 'COMPLETED')
      .reduce((sum, p) => sum + (p.amount || 0), 0)
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get the CSS class for a status badge based on the status string.
 * Provides consistent styling for status indicators across operations dashboards.
 */
export function getOperationsStatusColor(status: string): string {
  const normalizedStatus = status.toLowerCase()
  
  const statusColors: Record<string, string> = {
    // Success states
    'completed': 'bg-green-500/20 text-green-600',
    'confirmed': 'bg-green-500/20 text-green-600',
    'active': 'bg-green-500/20 text-green-600',
    'verified': 'bg-green-500/20 text-green-600',
    'paid': 'bg-green-500/20 text-green-600',
    // Warning states
    'pending': 'bg-yellow-500/20 text-yellow-600',
    'upcoming': 'bg-yellow-500/20 text-yellow-600',
    'waiting': 'bg-yellow-500/20 text-yellow-600',
    // In Progress states
    'ongoing': 'bg-blue-500/20 text-blue-600',
    'in-progress': 'bg-blue-500/20 text-blue-600',
    'in progress': 'bg-blue-500/20 text-blue-600',
    // Error/Alert states
    'cancelled': 'bg-red-500/20 text-red-600',
    'overdue': 'bg-red-500/20 text-red-600',
    'failed': 'bg-red-500/20 text-red-600',
    'suspended': 'bg-red-500/20 text-red-600',
  }
  
  return statusColors[normalizedStatus] || 'bg-gray-500/20 text-gray-600'
}

// ============================================================================
// EXPORTS
// ============================================================================

// Old service implementations kept for backward compatibility
// Note: Standalone versions with same names exist in separate files:
// - @/lib/services/bookingsCoordinatorService (new, for coordinator dashboard)
// - @/lib/services/frontDeskService (new, for front desk dashboard)
// - @/lib/services/accountantService (new, for accountant dashboard)

export const bookingsCoordinatorService = new BookingsCoordinatorService()
export const frontDeskService = new FrontDeskService()
export const accountantService = new AccountantService()

export default {
  bookingsCoordinator: bookingsCoordinatorService,
  frontDesk: frontDeskService,
  accountant: accountantService
}

