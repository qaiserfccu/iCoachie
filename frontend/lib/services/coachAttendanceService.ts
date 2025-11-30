import { sessionService, studentService, attendanceService, coachService } from './index'

export interface AttendanceStudent {
  id: string
  name: string
  avatar: string
  status: 'present' | 'absent' | 'late' | 'not_marked'
  studentId: string
}

export interface SessionAttendance {
  sessionId: string
  sessionName: string
  sessionTime: string
  sessionDate: string
  location?: string
  students: AttendanceStudent[]
  stats: {
    present: number
    absent: number
    late: number
    notMarked: number
    total: number
  }
}

export interface CoachAttendanceStats {
  totalSessions: number
  completedSessions: number
  averageAttendance: number
  totalStudents: number
}

class CoachAttendanceService {
  // Get current coach's sessions that are in progress or scheduled for today
  async getTodaySessions(): Promise<SessionAttendance[]> {
    try {
      // Get current coach info (assuming we have coach context or can get from auth)
      // For now, we'll get all coaches and assume the first one, but in real app this should come from auth context
      const coaches = await coachService.getCoaches()
      const currentCoach = coaches[0] // This should be replaced with actual current coach from auth

      if (!currentCoach) {
        return []
      }

      // Get sessions for this coach that are scheduled for today or in progress
      const today = new Date()
      const todayStr = today.toISOString().split('T')[0]

      const allSessions = await sessionService.getSessions(undefined, currentCoach.id.toString())
      const todaySessions = allSessions.filter(session => {
        const sessionDate = new Date(session.startTime).toISOString().split('T')[0]
        return sessionDate === todayStr && (session.status === 'scheduled' || session.status === 'in_progress')
      })

      // For each session, get students and their attendance
      const sessionAttendances: SessionAttendance[] = []

      for (const session of todaySessions) {
        try {
          // Get students enrolled in this session (from session attendance or student service)
          const sessionAttendance = await attendanceService.getSessionAttendance(session.id)
          const enrolledStudentIds = sessionAttendance.map(att => att.studentId)

          // Get student details
          const students = await studentService.getStudents()
          const sessionStudents = students.filter(student => enrolledStudentIds.includes(student.id))

          // Create attendance students list
          const attendanceStudents: AttendanceStudent[] = sessionStudents.map(student => {
            const attendanceRecord = sessionAttendance.find(att => att.studentId === student.id)
            return {
              id: student.id,
              name: `${student.firstName} ${student.lastName}`,
              avatar: `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`,
              status: attendanceRecord ? attendanceRecord.status : 'not_marked',
              studentId: student.id
            }
          })

          // Calculate stats
          const stats = {
            present: attendanceStudents.filter(s => s.status === 'present').length,
            absent: attendanceStudents.filter(s => s.status === 'absent').length,
            late: attendanceStudents.filter(s => s.status === 'late').length,
            notMarked: attendanceStudents.filter(s => s.status === 'not_marked').length,
            total: attendanceStudents.length
          }

          sessionAttendances.push({
            sessionId: session.id,
            sessionName: session.title,
            sessionTime: `${new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            sessionDate: new Date(session.startTime).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            location: session.location,
            students: attendanceStudents,
            stats
          })
        } catch (error) {
          console.error(`Error fetching attendance for session ${session.id}:`, error)
          // Continue with other sessions
        }
      }

      return sessionAttendances
    } catch (error) {
      console.error('Error fetching today sessions:', error)
      return []
    }
  }

  // Mark attendance for a student in a session
  async markAttendance(sessionId: string, studentId: string, status: 'present' | 'absent' | 'late'): Promise<void> {
    try {
      await attendanceService.markAttendance(sessionId, {
        studentId,
        status
      })
    } catch (error) {
      console.error('Error marking attendance:', error)
      throw error
    }
  }

  // Bulk mark attendance for multiple students in a session
  async bulkMarkAttendance(sessionId: string, attendanceData: { studentId: string, status: 'present' | 'absent' | 'late' }[]): Promise<void> {
    try {
      await attendanceService.bulkMarkAttendance(sessionId, attendanceData)
    } catch (error) {
      console.error('Error bulk marking attendance:', error)
      throw error
    }
  }

  // Get attendance statistics for the coach
  async getCoachAttendanceStats(): Promise<CoachAttendanceStats> {
    try {
      const coaches = await coachService.getCoaches()
      const currentCoach = coaches[0] // This should be replaced with actual current coach from auth

      if (!currentCoach) {
        return {
          totalSessions: 0,
          completedSessions: 0,
          averageAttendance: 0,
          totalStudents: 0
        }
      }

      // Get all sessions for this coach
      const sessions = await sessionService.getSessions(undefined, currentCoach.id.toString())

      let totalSessions = 0
      let completedSessions = 0
      let totalAttendanceRate = 0
      let totalStudents = 0

      for (const session of sessions) {
        if (session.status === 'completed') {
          completedSessions++
          try {
            const stats = await attendanceService.getSessionAttendanceStats(session.id)
            totalAttendanceRate += stats.attendanceRate
            totalStudents += stats.totalSessions // This represents total enrolled students
          } catch (error) {
            // Continue if stats not available
          }
        }
        totalSessions++
      }

      const averageAttendance = completedSessions > 0 ? totalAttendanceRate / completedSessions : 0

      return {
        totalSessions,
        completedSessions,
        averageAttendance: Math.round(averageAttendance * 100) / 100, // Round to 2 decimal places
        totalStudents
      }
    } catch (error) {
      console.error('Error fetching coach attendance stats:', error)
      return {
        totalSessions: 0,
        completedSessions: 0,
        averageAttendance: 0,
        totalStudents: 0
      }
    }
  }

  // Get students for a specific session (enrolled students)
  async getSessionStudents(sessionId: string): Promise<AttendanceStudent[]> {
    try {
      // Get session attendance to find enrolled students
      const sessionAttendance = await attendanceService.getSessionAttendance(sessionId)
      const enrolledStudentIds = sessionAttendance.map(att => att.studentId)

      // Get student details
      const students = await studentService.getStudents()
      const sessionStudents = students.filter(student => enrolledStudentIds.includes(student.id))

      // Create attendance students list
      const attendanceStudents: AttendanceStudent[] = sessionStudents.map(student => {
        const attendanceRecord = sessionAttendance.find(att => att.studentId === student.id)
        return {
          id: student.id,
          name: `${student.firstName} ${student.lastName}`,
          avatar: `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`,
          status: attendanceRecord ? attendanceRecord.status : 'not_marked',
          studentId: student.id
        }
      })

      return attendanceStudents
    } catch (error) {
      console.error('Error fetching session students:', error)
      return []
    }
  }
}

export const coachAttendanceService = new CoachAttendanceService()
export default coachAttendanceService