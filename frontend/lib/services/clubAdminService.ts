/**
 * Club Admin Service
 * Replaces mock data with real backend API calls for Club Admin dashboard
 */
import { apiClient } from '../api'

// ============================================================================
// TYPES
// ============================================================================

export interface ClubInfo {
  id: number
  name: string
  location: string | null
  description: string | null
  logoUrl: string | null
  adminId: number
  admin: { id: number; name: string; email: string } | null
  userCount?: number
  studentCount?: number
  coachCount?: number
  facilityCount?: number
  createdAt: string
  updatedAt: string
}

export interface ClubDashboardStats {
  totalMembers: number
  activeCoaches: number
  sessionsToday: number
  monthlyRevenue: number
  memberChange: string
  coachChange: string
  sessionChange: string
  revenueChange: string
}

export interface ClubSession {
  id: number
  title: string
  startTime: string
  endTime: string
  location: string | null
  maxCapacity: number
  coachId: number
  coachName: string
  enrolledCount: number
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
}

export interface ClubMember {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string | null
  dateOfBirth: string | null
  sport: string
  coach: string
  coachId: number | null
  membership: string
  status: 'Active' | 'Inactive'
  joinedAt: string
  parentName: string | null
}

export interface ClubMemberStats {
  totalMembers: number
  activeMembers: number
  newThisMonth: number
  expiringSoon: number
}

export interface ClubCoach {
  id: number
  userId: number
  name: string
  email: string
  phone: string | null
  specialty: string | null
  rating: number
  studentCount: number
  sessionCount: number
  status: string
}

export interface ClubPaymentStats {
  totalRevenue: number
  monthlyRevenue: number
  pendingAmount: number
  refundAmount: number
  revenueChange: string
  monthlyChange: string
  pendingCount: number
  refundCount: number
}

export interface ClubTransaction {
  id: number
  studentId: number
  studentName: string
  type: string
  amount: number
  date: string
  method: string
  status: 'completed' | 'pending' | 'refunded'
}

export interface ClubAnalytics {
  memberGrowth: { month: string; count: number }[]
  revenueByMonth: { month: string; revenue: number }[]
  sessionsByType: { type: string; count: number }[]
  coachPerformance: { coachId: number; name: string; rating: number; sessions: number }[]
  attendanceRate: number
  retentionRate: number
}

export interface TopPerformer {
  id: number
  name: string
  sport: string
  progress: number
  badge: 'Gold' | 'Silver' | 'Bronze'
}

export interface PageInfo {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pageInfo: PageInfo
  filtersApplied?: Record<string, any>
}

// ============================================================================
// CLUB ADMIN SERVICE
// ============================================================================

class ClubAdminService {
  // Get current user's club info
  async getMyClub(): Promise<ClubInfo> {
    try {
      return await apiClient.get<ClubInfo>('/clubs/my')
    } catch (error) {
      console.error('Error fetching club info:', error)
      throw error
    }
  }

  // Update club info
  async updateClub(data: Partial<ClubInfo>): Promise<ClubInfo> {
    try {
      const club = await this.getMyClub()
      return await apiClient.put<ClubInfo>(`/clubs/${club.id}`, data)
    } catch (error) {
      console.error('Error updating club:', error)
      throw error
    }
  }

  // Get club dashboard stats
  async getDashboardStats(): Promise<ClubDashboardStats> {
    try {
      const club = await this.getMyClub()
      
      // Get various stats
      const [members, coaches, sessions, payments] = await Promise.all([
        apiClient.get<PaginatedResponse<ClubMember>>('/students?pageSize=1'),
        apiClient.get<PaginatedResponse<ClubCoach>>('/coaches?pageSize=1'),
        this.getTodaySessions(),
        this.getPaymentStats()
      ])

      return {
        totalMembers: club.studentCount || 0,
        activeCoaches: club.coachCount || 0,
        sessionsToday: sessions.length,
        monthlyRevenue: payments.monthlyRevenue,
        memberChange: '+12', // TODO: Calculate from historical data
        coachChange: '+2',
        sessionChange: sessions.length > 0 ? `${sessions.filter(s => s.status === 'in_progress').length} ongoing` : '0',
        revenueChange: payments.revenueChange
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      // Return default values on error
      return {
        totalMembers: 0,
        activeCoaches: 0,
        sessionsToday: 0,
        monthlyRevenue: 0,
        memberChange: '+0',
        coachChange: '+0',
        sessionChange: '0',
        revenueChange: '+0%'
      }
    }
  }

  // Get today's sessions
  async getTodaySessions(): Promise<ClubSession[]> {
    try {
      const today = new Date()
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).toISOString()
      
      const response = await apiClient.get<any[]>(`/sessions?startDate=${startOfDay}&endDate=${endOfDay}`)
      
      return response.map(session => ({
        id: session.id,
        title: session.title,
        startTime: session.startTime,
        endTime: session.endTime,
        location: session.location,
        maxCapacity: session.maxCapacity,
        coachId: session.coachId,
        coachName: session.coach?.user?.name || 'Unknown Coach',
        enrolledCount: session._count?.enrollments || 0,
        status: this.getSessionStatus(session.startTime, session.endTime, session.status)
      }))
    } catch (error) {
      console.error('Error fetching today sessions:', error)
      return []
    }
  }

  private getSessionStatus(startTime: string, endTime: string, dbStatus?: string): ClubSession['status'] {
    if (dbStatus === 'cancelled') return 'cancelled'
    if (dbStatus === 'completed') return 'completed'
    
    const now = new Date()
    const start = new Date(startTime)
    const end = new Date(endTime)
    
    if (now < start) return 'scheduled'
    if (now >= start && now <= end) return 'in_progress'
    return 'completed'
  }

  // Get all sessions for calendar view
  async getSessions(params?: { page?: number; pageSize?: number; startDate?: string; endDate?: string }): Promise<PaginatedResponse<ClubSession>> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
      if (params?.startDate) queryParams.append('startDate', params.startDate)
      if (params?.endDate) queryParams.append('endDate', params.endDate)
      
      const url = queryParams.toString() ? `/sessions?${queryParams}` : '/sessions'
      const response = await apiClient.get<any>(url)
      
      const sessions = Array.isArray(response) ? response : (response.data || [])
      
      return {
        data: sessions.map((session: any) => ({
          id: session.id,
          title: session.title,
          startTime: session.startTime,
          endTime: session.endTime,
          location: session.location,
          maxCapacity: session.maxCapacity,
          coachId: session.coachId,
          coachName: session.coach?.user?.name || 'Unknown Coach',
          enrolledCount: session._count?.enrollments || 0,
          status: this.getSessionStatus(session.startTime, session.endTime, session.status)
        })),
        pageInfo: response.pageInfo || {
          page: 1,
          pageSize: sessions.length,
          total: sessions.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        }
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
      return {
        data: [],
        pageInfo: { page: 1, pageSize: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false }
      }
    }
  }

  // Create session
  async createSession(data: {
    title: string
    startTime: string
    endTime: string
    location?: string
    maxCapacity: number
    coachId: number
  }): Promise<ClubSession> {
    try {
      const response = await apiClient.post<any>('/sessions', data)
      return {
        id: response.id,
        title: response.title,
        startTime: response.startTime,
        endTime: response.endTime,
        location: response.location,
        maxCapacity: response.maxCapacity,
        coachId: response.coachId,
        coachName: response.coach?.user?.name || 'Unknown Coach',
        enrolledCount: 0,
        status: 'scheduled'
      }
    } catch (error) {
      console.error('Error creating session:', error)
      throw error
    }
  }

  // Get club members (students)
  async getMembers(params?: { page?: number; pageSize?: number; search?: string }): Promise<PaginatedResponse<ClubMember>> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
      if (params?.search) queryParams.append('search', params.search)
      
      const url = queryParams.toString() ? `/students?${queryParams}` : '/students'
      const response = await apiClient.get<any>(url)
      
      const students = Array.isArray(response) ? response : (response.data || [])
      
      return {
        data: students.map((student: any) => ({
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          phone: student.phone,
          dateOfBirth: student.dateOfBirth,
          sport: 'General', // TODO: Get from session data
          coach: 'Unassigned', // TODO: Get from assignments
          coachId: null,
          membership: 'Standard', // TODO: Get from membership data
          status: 'Active' as const,
          joinedAt: student.createdAt,
          parentName: student.emergencyContact?.name || null
        })),
        pageInfo: response.pageInfo || {
          page: 1,
          pageSize: students.length,
          total: students.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        }
      }
    } catch (error) {
      console.error('Error fetching members:', error)
      return {
        data: [],
        pageInfo: { page: 1, pageSize: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false }
      }
    }
  }

  // Get member stats
  async getMemberStats(): Promise<ClubMemberStats> {
    try {
      const club = await this.getMyClub()
      const totalMembers = club.studentCount || 0
      
      return {
        totalMembers,
        activeMembers: Math.floor(totalMembers * 0.93), // 93% active (estimation)
        newThisMonth: Math.floor(totalMembers * 0.06), // 6% new this month
        expiringSoon: Math.floor(totalMembers * 0.03) // 3% expiring
      }
    } catch (error) {
      console.error('Error fetching member stats:', error)
      return {
        totalMembers: 0,
        activeMembers: 0,
        newThisMonth: 0,
        expiringSoon: 0
      }
    }
  }

  // Create member
  async createMember(data: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    dateOfBirth?: string
    emergencyContact?: { name: string; phone: string }
  }): Promise<ClubMember> {
    try {
      const response = await apiClient.post<any>('/students', data)
      return {
        id: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        phone: response.phone,
        dateOfBirth: response.dateOfBirth,
        sport: 'General',
        coach: 'Unassigned',
        coachId: null,
        membership: 'Standard',
        status: 'Active',
        joinedAt: response.createdAt,
        parentName: response.emergencyContact?.name || null
      }
    } catch (error) {
      console.error('Error creating member:', error)
      throw error
    }
  }

  // Get club coaches
  async getCoaches(params?: { page?: number; pageSize?: number; search?: string }): Promise<PaginatedResponse<ClubCoach>> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
      if (params?.search) queryParams.append('search', params.search)
      
      const url = queryParams.toString() ? `/coaches?${queryParams}` : '/coaches'
      const response = await apiClient.get<any>(url)
      
      const coaches = Array.isArray(response) ? response : (response.data || [])
      
      return {
        data: coaches.map((coach: any) => ({
          id: coach.id,
          userId: coach.userId,
          name: coach.user?.name || coach.name || 'Unknown',
          email: coach.user?.email || coach.email || '',
          phone: coach.user?.phone || coach.phone || null,
          specialty: coach.specialty || null,
          rating: coach.rating || 0,
          studentCount: coach._count?.students || 0,
          sessionCount: coach._count?.sessions || 0,
          status: coach.status || 'Active'
        })),
        pageInfo: response.pageInfo || {
          page: 1,
          pageSize: coaches.length,
          total: coaches.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        }
      }
    } catch (error) {
      console.error('Error fetching coaches:', error)
      return {
        data: [],
        pageInfo: { page: 1, pageSize: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false }
      }
    }
  }

  // Get payment stats
  async getPaymentStats(): Promise<ClubPaymentStats> {
    try {
      const response = await apiClient.get<any>('/payments')
      const payments = Array.isArray(response) ? response : (response.data || [])
      
      // Calculate stats from payments
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      
      let totalRevenue = 0
      let monthlyRevenue = 0
      let pendingAmount = 0
      let refundAmount = 0
      let pendingCount = 0
      let refundCount = 0
      
      for (const payment of payments) {
        const amount = parseFloat(payment.amount) || 0
        const paymentDate = new Date(payment.createdAt)
        
        if (payment.status === 'completed') {
          totalRevenue += amount
          if (paymentDate >= startOfMonth) {
            monthlyRevenue += amount
          }
        } else if (payment.status === 'pending') {
          pendingAmount += amount
          pendingCount++
        } else if (payment.status === 'refunded') {
          refundAmount += amount
          refundCount++
        }
      }
      
      return {
        totalRevenue,
        monthlyRevenue,
        pendingAmount,
        refundAmount,
        revenueChange: '+12%', // TODO: Calculate from historical data
        monthlyChange: '+8%',
        pendingCount,
        refundCount
      }
    } catch (error) {
      console.error('Error fetching payment stats:', error)
      return {
        totalRevenue: 0,
        monthlyRevenue: 0,
        pendingAmount: 0,
        refundAmount: 0,
        revenueChange: '+0%',
        monthlyChange: '+0%',
        pendingCount: 0,
        refundCount: 0
      }
    }
  }

  // Get transactions
  async getTransactions(params?: { page?: number; pageSize?: number; search?: string }): Promise<PaginatedResponse<ClubTransaction>> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
      if (params?.search) queryParams.append('search', params.search)
      
      const url = queryParams.toString() ? `/payments?${queryParams}` : '/payments'
      const response = await apiClient.get<any>(url)
      
      const payments = Array.isArray(response) ? response : (response.data || [])
      
      return {
        data: payments.map((payment: any) => ({
          id: payment.id,
          studentId: payment.studentId,
          studentName: payment.student ? `${payment.student.firstName} ${payment.student.lastName}` : 'Unknown',
          type: payment.description || 'Payment',
          amount: parseFloat(payment.amount) || 0,
          date: payment.createdAt,
          method: payment.paymentMethod || 'Credit Card',
          status: payment.status || 'pending'
        })),
        pageInfo: response.pageInfo || {
          page: 1,
          pageSize: payments.length,
          total: payments.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        }
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
      return {
        data: [],
        pageInfo: { page: 1, pageSize: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false }
      }
    }
  }

  // Get top performers
  async getTopPerformers(limit: number = 3): Promise<TopPerformer[]> {
    try {
      const response = await apiClient.get<any>(`/evaluations/top-performers?limit=${limit}`)
      
      if (Array.isArray(response)) {
        return response.map((performer: any, index: number) => ({
          id: performer.id || performer.studentId,
          name: performer.name || `${performer.firstName} ${performer.lastName}`,
          sport: performer.sport || 'General',
          progress: performer.progress || performer.averageRating * 20 || 0,
          badge: (index === 0 ? 'Gold' : index === 1 ? 'Silver' : 'Bronze') as TopPerformer['badge']
        }))
      }
      
      // Fallback: get evaluations and calculate top performers
      const evaluations = await apiClient.get<any>('/evaluations')
      const evalArray = Array.isArray(evaluations) ? evaluations : (evaluations.data || [])
      
      // Group by student and calculate average
      const studentScores: Record<number, { total: number; count: number; name: string }> = {}
      
      for (const evaluation of evalArray) {
        const studentId = evaluation.studentId
        if (!studentScores[studentId]) {
          studentScores[studentId] = { 
            total: 0, 
            count: 0, 
            name: evaluation.student ? `${evaluation.student.firstName} ${evaluation.student.lastName}` : `Student ${studentId}`
          }
        }
        studentScores[studentId].total += evaluation.rating || 0
        studentScores[studentId].count++
      }
      
      // Sort by average score
      const sorted = Object.entries(studentScores)
        .map(([id, data]) => ({
          id: parseInt(id),
          name: data.name,
          score: data.count > 0 ? data.total / data.count : 0
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
      
      return sorted.map((student, index) => ({
        id: student.id,
        name: student.name,
        sport: 'General',
        progress: Math.round(student.score * 20),
        badge: (index === 0 ? 'Gold' : index === 1 ? 'Silver' : 'Bronze') as TopPerformer['badge']
      }))
    } catch (error) {
      console.error('Error fetching top performers:', error)
      return []
    }
  }

  // Get club analytics
  async getAnalytics(): Promise<ClubAnalytics> {
    try {
      // This would be a dedicated analytics endpoint in a real implementation
      // For now, aggregate data from various sources
      
      const [members, payments] = await Promise.all([
        this.getMembers({ pageSize: 100 }),
        this.getTransactions({ pageSize: 100 })
      ])
      
      // Calculate member growth (mock for now, would need historical data)
      const memberGrowth = [
        { month: 'Jan', count: Math.floor(members.pageInfo.total * 0.7) },
        { month: 'Feb', count: Math.floor(members.pageInfo.total * 0.75) },
        { month: 'Mar', count: Math.floor(members.pageInfo.total * 0.8) },
        { month: 'Apr', count: Math.floor(members.pageInfo.total * 0.85) },
        { month: 'May', count: Math.floor(members.pageInfo.total * 0.9) },
        { month: 'Jun', count: members.pageInfo.total }
      ]
      
      // Calculate revenue by month
      const revenueByMonth: Record<string, number> = {}
      for (const txn of payments.data) {
        const month = new Date(txn.date).toLocaleString('default', { month: 'short' })
        revenueByMonth[month] = (revenueByMonth[month] || 0) + txn.amount
      }
      
      return {
        memberGrowth,
        revenueByMonth: Object.entries(revenueByMonth).map(([month, revenue]) => ({ month, revenue })),
        sessionsByType: [], // Would need session type data
        coachPerformance: [], // Would need coach performance data
        attendanceRate: 94, // Mock value
        retentionRate: 87 // Mock value
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      return {
        memberGrowth: [],
        revenueByMonth: [],
        sessionsByType: [],
        coachPerformance: [],
        attendanceRate: 0,
        retentionRate: 0
      }
    }
  }
}

export const clubAdminService = new ClubAdminService()
export default clubAdminService
