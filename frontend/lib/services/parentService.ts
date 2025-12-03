/**
 * Parent Service
 * 
 * Provides all API methods for parent-related functionality.
 * Backend source paths documented for each endpoint.
 * 
 * Related endpoints:
 * - Students (My Kids): backend/src/controllers/studentController.ts
 * - Bookings: backend/src/controllers/bookingController.ts
 * - Payments: backend/src/controllers/paymentController.ts
 * - Evaluations: backend/src/controllers/evaluationController.ts
 * - Messages: backend/src/controllers/messageController.ts
 * - User Profile: backend/src/controllers/userController.ts
 */

import { apiClient } from '../api'

// =============================================================================
// Types
// =============================================================================

/**
 * Parent's child (student) record
 * Backend source: backend/src/controllers/studentController.ts
 */
export interface ParentChild {
  id: number
  userId: number
  parentId: number
  clubId: number
  coachId?: number
  name: string
  age?: number
  level?: string
  sport?: string
  createdAt: string
  updatedAt: string
  user?: {
    id: number
    email: string
    profile?: {
      displayName?: string
      phone?: string
      avatarUrl?: string
    }
  }
  coach?: {
    id: number
    name: string
    profile?: {
      displayName?: string
    }
  }
  enrollmentCount?: number
  attendanceCount?: number
  evaluationCount?: number
}

/**
 * Booking record for parent's child
 * Backend source: backend/src/controllers/bookingController.ts
 */
export interface ParentBooking {
  id: number
  freelancerId: number
  clientId: number
  sessionDate: string
  startTime: string
  endTime: string
  serviceType?: string
  amount?: number
  notes?: string
  createdAt: string
  status?: {
    code: string
    name: string
  }
  freelancer?: {
    id: number
    name: string
    email: string
  }
  client?: {
    id: number
    name: string
    email: string
  }
}

/**
 * Payment record
 * Backend source: backend/src/controllers/paymentController.ts
 */
export interface ParentPayment {
  id: number
  amount: number
  currency: string
  paymentType: string
  description?: string
  createdAt: string
  updatedAt?: string
  stripePaymentId?: string
  status?: {
    code: string
    name: string
  }
  user?: {
    id: number
    name: string
    profile?: {
      displayName?: string
    }
  }
}

/**
 * Evaluation record for child
 * Backend source: backend/src/controllers/evaluationController.ts
 */
export interface ParentEvaluation {
  id: number
  overallScore: number
  comments?: string
  evaluationType?: string
  createdAt: string
  session?: {
    id: number
    title: string
    sessionDate: string
  }
  coach?: {
    name: string
    profile?: {
      displayName?: string
    }
  }
}

/**
 * Evaluation statistics
 * Backend source: backend/src/controllers/evaluationController.ts
 */
export interface EvaluationStats {
  totalEvaluations: number
  averageRating: number
  ratingDistribution: Record<number, number>
  recentTrend: Array<{ date: string; rating: number }>
}

/**
 * Message record
 * Backend source: backend/src/controllers/messageController.ts
 */
export interface ParentMessage {
  id: number
  fromUserId: number
  toUserId: number
  subject?: string
  content: string
  isRead: boolean
  createdAt: string
  deletedAt?: string
  fromUser?: {
    id: number
    name: string
    email: string
  }
  toUser?: {
    id: number
    name: string
    email: string
  }
}

/**
 * User profile for current parent
 * Backend source: backend/src/controllers/userController.ts
 */
export interface ParentProfile {
  user: {
    id: number
    email: string
    createdAt: string
  }
  profile?: {
    displayName?: string
    bio?: string
    avatarUrl?: string
    phone?: string
  }
  role?: {
    code: string
    name: string
    description?: string
    scope?: string
  }
}

/**
 * Dashboard stats for parent
 */
export interface ParentDashboardStats {
  totalKids: number
  upcomingSessions: number
  averageProgress: number
  totalSpent: number
  unreadMessages: number
}

// =============================================================================
// Parent Service Class
// =============================================================================

class ParentService {
  // ===========================================================================
  // Profile Methods
  // Backend source: backend/src/controllers/userController.ts
  // ===========================================================================

  /**
   * Get current parent's profile
   * Endpoint: GET /api/users/me
   */
  async getProfile(): Promise<ParentProfile> {
    return apiClient.get<ParentProfile>('/users/me')
  }

  /**
   * Update parent's profile
   * Endpoint: PUT /api/users/me/profile
   */
  async updateProfile(data: {
    display_name?: string
    bio?: string
    avatar_url?: string
    phone?: string
  }): Promise<{ displayName?: string; bio?: string; avatarUrl?: string; phone?: string }> {
    return apiClient.put('/users/me/profile', data)
  }

  // ===========================================================================
  // Children (Kids) Methods
  // Backend source: backend/src/controllers/studentController.ts
  // ===========================================================================

  /**
   * Get all children for current parent
   * Note: The backend filters by clubId and parentId automatically
   * Endpoint: GET /api/students
   */
  async getChildren(): Promise<{ data: ParentChild[]; pageInfo: any; filtersApplied: any }> {
    return apiClient.get('/students')
  }

  /**
   * Get a specific child by ID
   * Endpoint: GET /api/students/:id
   */
  async getChild(id: number): Promise<ParentChild> {
    return apiClient.get<ParentChild>(`/students/${id}`)
  }

  /**
   * Add a new child (student)
   * Endpoint: POST /api/students
   */
  async addChild(data: {
    userId: number
    name: string
    age?: number
    level?: string
    sport?: string
    coachId?: number
  }): Promise<ParentChild> {
    return apiClient.post<ParentChild>('/students', {
      ...data,
      parentId: undefined, // Will be set by backend from current user
    })
  }

  /**
   * Update child information
   * Endpoint: PUT /api/students/:id
   */
  async updateChild(id: number, data: {
    name?: string
    age?: number
    level?: string
    sport?: string
    coachId?: number
  }): Promise<ParentChild> {
    return apiClient.put<ParentChild>(`/students/${id}`, data)
  }

  // ===========================================================================
  // Bookings Methods
  // Backend source: backend/src/controllers/bookingController.ts
  // ===========================================================================

  /**
   * Get all bookings for current parent (as client)
   * Endpoint: GET /api/bookings?type=as_client
   */
  async getBookings(params?: {
    page?: number
    limit?: number
    status?: string
  }): Promise<{
    success: boolean
    data: {
      bookings: ParentBooking[]
      pagination: { page: number; limit: number; total: number; pages: number }
    }
  }> {
    return apiClient.get('/bookings', {
      params: { ...params, type: 'as_client' }
    })
  }

  /**
   * Get a specific booking
   * Endpoint: GET /api/bookings/:id
   */
  async getBooking(id: number): Promise<{ success: boolean; data: ParentBooking }> {
    return apiClient.get(`/bookings/${id}`)
  }

  /**
   * Create a new booking
   * Endpoint: POST /api/bookings
   */
  async createBooking(data: {
    freelancerId: number
    sessionDate: string
    startTime: string
    endTime: string
    serviceType?: string
    amount?: number
    notes?: string
  }): Promise<{ success: boolean; data: ParentBooking }> {
    return apiClient.post('/bookings', data)
  }

  /**
   * Cancel a booking
   * Endpoint: PATCH /api/bookings/:id/cancel
   */
  async cancelBooking(id: number): Promise<{ success: boolean; data: ParentBooking }> {
    return apiClient.patch(`/bookings/${id}/cancel`)
  }

  /**
   * Get available freelancers for a time slot
   * Endpoint: GET /api/bookings/freelancers/available
   */
  async getAvailableFreelancers(params: {
    date: string
    startTime: string
    endTime: string
    serviceType?: string
  }): Promise<{ success: boolean; data: Array<{ id: number; name: string; email: string }> }> {
    return apiClient.get('/bookings/freelancers/available', { params })
  }

  // ===========================================================================
  // Payments Methods
  // Backend source: backend/src/controllers/paymentController.ts
  // ===========================================================================

  /**
   * Get payment history for parent
   * Endpoint: GET /api/payments
   */
  async getPayments(params?: {
    status?: string
    limit?: number
    offset?: number
  }): Promise<ParentPayment[]> {
    return apiClient.get<ParentPayment[]>('/payments', { params })
  }

  /**
   * Get payment statistics
   * Endpoint: GET /api/payments/stats/overview
   */
  async getPaymentStats(period?: string): Promise<{
    period: string
    totalPayments: number
    totalAmount: number
    completedAmount: number
    pendingAmount: number
    completionRate: number
    typeBreakdown: Record<string, number>
    statusBreakdown: Record<string, number>
  }> {
    return apiClient.get('/payments/stats/overview', { params: { period } })
  }

  /**
   * Create a Stripe payment intent
   * Endpoint: POST /api/payments/create-payment-intent
   */
  async createPaymentIntent(data: {
    amount: number
    currency?: string
    description?: string
    metadata?: Record<string, any>
  }): Promise<{
    paymentIntent: {
      id: string
      client_secret: string
      amount: number
      currency: string
      status: string
    }
    payment: ParentPayment
  }> {
    return apiClient.post('/payments/create-payment-intent', data)
  }

  // ===========================================================================
  // Evaluations/Progress Methods
  // Backend source: backend/src/controllers/evaluationController.ts
  // ===========================================================================

  /**
   * Get evaluations for a specific child
   * Endpoint: GET /api/evaluations/student/:studentId
   */
  async getChildEvaluations(studentId: number): Promise<ParentEvaluation[]> {
    return apiClient.get<ParentEvaluation[]>(`/evaluations/student/${studentId}`)
  }

  /**
   * Get evaluation statistics for a child
   * Endpoint: GET /api/evaluations/student/:studentId/stats
   */
  async getChildEvaluationStats(studentId: number): Promise<EvaluationStats> {
    return apiClient.get<EvaluationStats>(`/evaluations/student/${studentId}/stats`)
  }

  // ===========================================================================
  // Messages Methods
  // Backend source: backend/src/controllers/messageController.ts
  // ===========================================================================

  /**
   * Get all messages for parent
   * Endpoint: GET /api/messages
   */
  async getMessages(params?: {
    page?: number
    limit?: number
    type?: 'all' | 'sent' | 'received' | 'unread'
  }): Promise<{
    success: boolean
    data: {
      messages: ParentMessage[]
      pagination: { page: number; limit: number; total: number; pages: number }
    }
  }> {
    return apiClient.get('/messages', { params })
  }

  /**
   * Get a specific message
   * Endpoint: GET /api/messages/:id
   */
  async getMessage(id: number): Promise<{ success: boolean; data: ParentMessage }> {
    return apiClient.get(`/messages/${id}`)
  }

  /**
   * Send a message
   * Endpoint: POST /api/messages
   */
  async sendMessage(data: {
    toUserId: number
    subject?: string
    content: string
  }): Promise<{ success: boolean; data: ParentMessage }> {
    return apiClient.post('/messages', data)
  }

  /**
   * Mark messages as read
   * Endpoint: PATCH /api/messages/mark-read
   */
  async markMessagesAsRead(messageIds: number[]): Promise<{ success: boolean; data: { markedAsRead: number } }> {
    return apiClient.patch('/messages/mark-read', { messageIds })
  }

  /**
   * Delete a message
   * Endpoint: DELETE /api/messages/:id
   */
  async deleteMessage(id: number): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(`/messages/${id}`)
  }

  /**
   * Get unread message count
   * Endpoint: GET /api/messages/unread-count
   */
  async getUnreadMessageCount(): Promise<{ success: boolean; data: { unreadCount: number } }> {
    return apiClient.get('/messages/unread-count')
  }

  // ===========================================================================
  // Dashboard/Combined Methods
  // ===========================================================================

  /**
   * Get dashboard statistics for parent
   * Aggregates data from multiple endpoints
   */
  async getDashboardStats(): Promise<ParentDashboardStats> {
    try {
      const [
        childrenResponse,
        bookingsResponse,
        paymentsStats,
        unreadCountResponse
      ] = await Promise.all([
        this.getChildren(),
        this.getBookings({ limit: 100 }),
        this.getPaymentStats('month'),
        this.getUnreadMessageCount()
      ])

      const children = childrenResponse.data || []
      const bookings = bookingsResponse.data?.bookings || []
      
      // Calculate upcoming sessions (bookings with PENDING or CONFIRMED status)
      const upcomingSessions = bookings.filter(b => 
        b.status?.code === 'PENDING' || b.status?.code === 'CONFIRMED'
      ).length

      // Calculate average progress from children's evaluation counts
      // (in a real scenario, this would come from evaluation stats)
      const totalEvaluationScore = children.reduce((sum, child) => {
        return sum + (child.evaluationCount || 0)
      }, 0)
      const averageProgress = children.length > 0 
        ? Math.round((totalEvaluationScore / children.length) * 10) 
        : 0

      return {
        totalKids: children.length,
        upcomingSessions,
        averageProgress: Math.min(averageProgress, 100), // Cap at 100%
        totalSpent: paymentsStats.completedAmount || 0,
        unreadMessages: unreadCountResponse.data?.unreadCount || 0
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      return {
        totalKids: 0,
        upcomingSessions: 0,
        averageProgress: 0,
        totalSpent: 0,
        unreadMessages: 0
      }
    }
  }
}

// =============================================================================
// Export singleton instance
// =============================================================================

export const parentService = new ParentService()
export default parentService
