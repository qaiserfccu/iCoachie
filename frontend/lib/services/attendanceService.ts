import { apiClient } from '../api'

// Types
export interface Attendance {
  id: string
  sessionId: string
  studentId: string
  status: 'present' | 'absent' | 'late'
  checkInTime?: string
  notes?: string
  tenantId: string
  createdAt: string
  updatedAt: string
}

export interface MarkAttendanceData {
  studentId: string
  status: 'present' | 'absent' | 'late'
  checkInTime?: string
  notes?: string
}

export interface AttendanceStats {
  totalSessions: number
  presentCount: number
  absentCount: number
  lateCount: number
  attendanceRate: number
}

class AttendanceService {
  private readonly baseUrl = '/attendance'

  // Get attendance for a session
  async getSessionAttendance(sessionId: string): Promise<Attendance[]> {
    return apiClient.get<Attendance[]>(`${this.baseUrl}/session/${sessionId}`)
  }

  // Get attendance for a student
  async getStudentAttendance(studentId: string, limit?: number): Promise<Attendance[]> {
    const params = limit ? { limit: limit.toString() } : {}
    return apiClient.get<Attendance[]>(`${this.baseUrl}/student/${studentId}`, { params })
  }

  // Mark attendance for a student in a session
  async markAttendance(sessionId: string, data: MarkAttendanceData): Promise<Attendance> {
    return apiClient.post<Attendance>(`${this.baseUrl}/session/${sessionId}`, data)
  }

  // Update attendance record
  async updateAttendance(attendanceId: string, data: Partial<MarkAttendanceData>): Promise<Attendance> {
    return apiClient.put<Attendance>(`${this.baseUrl}/${attendanceId}`, data)
  }

  // Delete attendance record
  async deleteAttendance(attendanceId: string): Promise<void> {
    return apiClient.delete(`${this.baseUrl}/${attendanceId}`)
  }

  // Bulk mark attendance for a session
  async bulkMarkAttendance(sessionId: string, attendanceData: MarkAttendanceData[]): Promise<Attendance[]> {
    return apiClient.post<Attendance[]>(`${this.baseUrl}/session/${sessionId}/bulk`, {
      attendance: attendanceData
    })
  }

  // Get attendance statistics for a student
  async getStudentAttendanceStats(studentId: string, period?: { startDate: string, endDate: string }): Promise<AttendanceStats> {
    const params: any = {}
    if (period) {
      params.startDate = period.startDate
      params.endDate = period.endDate
    }
    return apiClient.get<AttendanceStats>(`${this.baseUrl}/student/${studentId}/stats`, { params })
  }

  // Get attendance statistics for a session
  async getSessionAttendanceStats(sessionId: string): Promise<AttendanceStats> {
    return apiClient.get<AttendanceStats>(`${this.baseUrl}/session/${sessionId}/stats`)
  }

  // Get attendance report for a club
  async getClubAttendanceReport(clubId: string, period: { startDate: string, endDate: string }): Promise<any> {
    return apiClient.get(`${this.baseUrl}/club/${clubId}/report`, {
      params: {
        startDate: period.startDate,
        endDate: period.endDate
      }
    })
  }
}

export const attendanceService = new AttendanceService()
export default attendanceService