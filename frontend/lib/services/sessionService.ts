import { apiClient } from '../api'

// Types
export interface Session {
  id: number
  title: string
  description?: string
  sessionDate: string
  startTime: string
  endTime: string
  location?: string
  maxCapacity?: number
  currentEnrolled: number
  status: string
  createdAt: string
  coach: {
    id: number
    name: string
    profile: {
      displayName: string
    }
  }
  club: {
    id: number
    name: string
  }
  _count: {
    enrollments: number
    attendances: number
  }
}

export interface CreateSessionData {
  title: string
  description?: string
  startTime: string
  endTime: string
  maxCapacity: number
  price?: number
  location?: string
  clubId: string
  coachId: string
}

export interface UpdateSessionData {
  title?: string
  description?: string
  startTime?: string
  endTime?: string
  maxCapacity?: number
  price?: number
  location?: string
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
}

class SessionService {
  private readonly baseUrl = '/sessions'

  // Get all sessions for current tenant
  async getSessions(clubId?: string, coachId?: string, status?: string): Promise<Session[]> {
    const params: any = {}
    if (clubId) params.clubId = clubId
    if (coachId) params.coachId = coachId
    if (status) params.status = status
    return apiClient.get<Session[]>(this.baseUrl, { params })
  }

  // Get session by ID
  async getSession(id: string): Promise<Session> {
    return apiClient.get<Session>(`${this.baseUrl}/${id}`)
  }

  // Create new session
  async createSession(data: CreateSessionData): Promise<Session> {
    return apiClient.post<Session>(this.baseUrl, data)
  }

  // Update session
  async updateSession(id: string, data: UpdateSessionData): Promise<Session> {
    return apiClient.put<Session>(`${this.baseUrl}/${id}`, data)
  }

  // Delete session
  async deleteSession(id: string): Promise<void> {
    return apiClient.delete(`${this.baseUrl}/${id}`)
  }

  // Get session attendance
  async getSessionAttendance(id: string): Promise<any[]> {
    return apiClient.get(`${this.baseUrl}/${id}/attendance`)
  }

  // Mark attendance for session
  async markAttendance(sessionId: string, studentId: string, status: 'present' | 'absent' | 'late'): Promise<void> {
    return apiClient.post(`${this.baseUrl}/${sessionId}/attendance`, {
      studentId,
      status
    })
  }

  // Get available sessions for booking
  async getAvailableSessions(): Promise<Session[]> {
    return apiClient.get(`${this.baseUrl}/available`)
  }

  // Book session for student
  async bookSession(sessionId: string, studentId: string): Promise<void> {
    return apiClient.post(`${this.baseUrl}/${sessionId}/book`, { studentId })
  }

  // Cancel session booking
  async cancelBooking(sessionId: string, studentId: string): Promise<void> {
    return apiClient.delete(`${this.baseUrl}/${sessionId}/book/${studentId}`)
  }
}

export const sessionService = new SessionService()
export default sessionService