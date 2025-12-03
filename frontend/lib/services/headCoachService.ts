import { apiClient } from '../api'
import coachService, { Coach } from './coachService'
import studentService, { Student } from './studentService'
import sessionService, { Session } from './sessionService'
import evaluationService from './evaluationService'

// Types for Head Coach dashboard
export interface HeadCoachStats {
  totalCoaches: number
  totalPrograms: number
  totalSessions: number
  totalAthletes: number
}

export interface Team {
  id: number
  name: string
  sport: string
  players: number
  coaches: number
  record: string
  status: string
}

export interface TrainingPlan {
  id: number
  name: string
  team: string
  duration: string
  progress: number
  status: 'in-progress' | 'completed' | 'scheduled'
  sessions: number
  completed: number
}

export interface PlayerEvaluation {
  id: number
  player: string
  team: string
  date: string
  overall: number
  technical: number
  tactical: number
  physical: number
  mental: number
  trend: 'up' | 'down' | 'stable'
}

export interface MatchRecord {
  id: number
  team: string
  opponent: string
  date: string
  result: string
  stats: Record<string, number>
}

export interface StaffMember {
  id: number
  name: string
  role: string
  specialty: string
  status: 'active' | 'on-leave' | 'inactive'
  email: string
  phone: string
  rating: number
  sessions: number
}

export interface UpcomingSession {
  program: string
  coach: string
  time: string
  athletes: number
}

export interface Meeting {
  id: number
  title: string
  date: string
  time: string
  attendees: number
}

// Dashboard data interface
export interface HeadCoachDashboardData {
  stats: HeadCoachStats
  coaches: Coach[]
  upcomingSessions: UpcomingSession[]
}

// Pagination response
export interface PaginatedResponse<T> {
  data: T[]
  pageInfo: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  filtersApplied: Record<string, unknown>
}

class HeadCoachService {
  // Get dashboard data
  async getDashboardData(): Promise<HeadCoachDashboardData> {
    try {
      // Fetch coaches, sessions, and students in parallel
      const [coaches, sessionsResponse, studentsResponse] = await Promise.all([
        coachService.getCoaches(),
        this.getSessions({ page: 1, pageSize: 100 }),
        this.getStudents({ page: 1, pageSize: 100 })
      ])

      // Calculate stats
      const stats: HeadCoachStats = {
        totalCoaches: coaches.length,
        totalPrograms: new Set(sessionsResponse.data.map(s => s.title)).size,
        totalSessions: sessionsResponse.data.length,
        totalAthletes: studentsResponse.data.length
      }

      // Get today's sessions
      const today = new Date().toISOString().split('T')[0]
      const todaySessions = sessionsResponse.data.filter(s => 
        s.sessionDate.startsWith(today)
      )

      const upcomingSessions: UpcomingSession[] = todaySessions.slice(0, 5).map(s => ({
        program: s.title,
        coach: s.coach?.name || 'Unassigned',
        time: new Date(s.startTime).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        }),
        athletes: s.currentEnrolled || 0
      }))

      return {
        stats,
        coaches,
        upcomingSessions
      }
    } catch (error) {
      console.error('Failed to fetch head coach dashboard data:', error)
      throw new Error('Failed to fetch dashboard data')
    }
  }

  // Get paginated sessions
  async getSessions(params: {
    page?: number
    pageSize?: number
    search?: string
    coachId?: number
    status?: string
  } = {}): Promise<PaginatedResponse<Session>> {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    if (params.search) queryParams.append('search', params.search)
    if (params.coachId) queryParams.append('coachId', params.coachId.toString())
    if (params.status) queryParams.append('status', params.status)

    return apiClient.get<PaginatedResponse<Session>>(`/sessions?${queryParams.toString()}`)
  }

  // Get paginated students
  async getStudents(params: {
    page?: number
    pageSize?: number
    search?: string
    coachId?: number
    level?: string
    sport?: string
  } = {}): Promise<PaginatedResponse<Student>> {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    if (params.search) queryParams.append('search', params.search)
    if (params.coachId) queryParams.append('coachId', params.coachId.toString())
    if (params.level) queryParams.append('level', params.level)
    if (params.sport) queryParams.append('sport', params.sport)

    return apiClient.get<PaginatedResponse<Student>>(`/students?${queryParams.toString()}`)
  }

  // Get all coaches
  async getCoaches(): Promise<Coach[]> {
    return coachService.getCoaches()
  }

  // Get coach by ID
  async getCoach(id: number): Promise<Coach> {
    return coachService.getCoach(id)
  }

  // Get student evaluations
  async getStudentEvaluations(studentId: string) {
    return evaluationService.getStudentEvaluations(studentId)
  }

  // Get student evaluation stats
  async getStudentEvaluationStats(studentId: string) {
    return evaluationService.getStudentEvaluationStats(studentId)
  }

  // Get session evaluations
  async getSessionEvaluations(sessionId: string) {
    return evaluationService.getSessionEvaluations(sessionId)
  }

  // Create evaluation
  async createEvaluation(sessionId: string, studentId: string, data: {
    overallScore: number
    comments?: string
    evaluationType: string
  }) {
    return apiClient.post(`/evaluations/session/${sessionId}/student/${studentId}`, data)
  }

  // Update evaluation
  async updateEvaluation(evaluationId: string, data: {
    overallScore?: number
    comments?: string
  }) {
    return evaluationService.updateEvaluation(evaluationId, {
      rating: data.overallScore,
      content: data.comments || ''
    })
  }

  // Get teams (derived from sessions and students grouped by sport)
  async getTeams(): Promise<Team[]> {
    try {
      const [sessionsResponse, studentsResponse, coaches] = await Promise.all([
        this.getSessions({ page: 1, pageSize: 100 }),
        this.getStudents({ page: 1, pageSize: 100 }),
        this.getCoaches()
      ])

      // Group students by sport to create "teams"
      const teamMap = new Map<string, {
        players: number
        coaches: Set<number>
      }>()

      studentsResponse.data.forEach(student => {
        const sport = student.sport || 'General'
        if (!teamMap.has(sport)) {
          teamMap.set(sport, { players: 0, coaches: new Set() })
        }
        const team = teamMap.get(sport)!
        team.players++
        if (student.coach?.id) {
          team.coaches.add(student.coach.id)
        }
      })

      const teams: Team[] = []
      let id = 1
      teamMap.forEach((data, sport) => {
        teams.push({
          id: id++,
          name: `${sport} Team`,
          sport,
          players: data.players,
          coaches: data.coaches.size,
          record: 'N/A',
          status: 'active'
        })
      })

      return teams
    } catch (error) {
      console.error('Failed to fetch teams:', error)
      throw new Error('Failed to fetch teams')
    }
  }

  // Get training plans (derived from sessions)
  async getTrainingPlans(): Promise<TrainingPlan[]> {
    try {
      const sessionsResponse = await this.getSessions({ page: 1, pageSize: 100 })
      
      // Group sessions by title to create "training plans"
      const planMap = new Map<string, {
        sessions: Session[]
        team: string
      }>()

      sessionsResponse.data.forEach(session => {
        const title = session.title
        if (!planMap.has(title)) {
          planMap.set(title, { 
            sessions: [], 
            team: 'General'
          })
        }
        planMap.get(title)!.sessions.push(session)
      })

      const plans: TrainingPlan[] = []
      let id = 1
      planMap.forEach((data, title) => {
        const completed = data.sessions.filter(s => 
          s.status === 'COMPLETED' || s.status === 'completed'
        ).length
        const total = data.sessions.length
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0

        let status: 'in-progress' | 'completed' | 'scheduled' = 'scheduled'
        if (progress === 100) {
          status = 'completed'
        } else if (completed > 0) {
          status = 'in-progress'
        }

        plans.push({
          id: id++,
          name: title,
          team: data.team,
          duration: `${total} sessions`,
          progress,
          status,
          sessions: total,
          completed
        })
      })

      return plans
    } catch (error) {
      console.error('Failed to fetch training plans:', error)
      throw new Error('Failed to fetch training plans')
    }
  }

  // Get player evaluations
  async getPlayerEvaluations(): Promise<PlayerEvaluation[]> {
    try {
      const studentsResponse = await this.getStudents({ page: 1, pageSize: 100 })
      const evaluations: PlayerEvaluation[] = []

      // Fetch evaluations for each student
      for (const student of studentsResponse.data.slice(0, 10)) {
        try {
          const studentEvals = await this.getStudentEvaluations(student.id.toString())
          const stats = await this.getStudentEvaluationStats(student.id.toString())

          if (studentEvals.length > 0) {
            const latest = studentEvals[0]
            evaluations.push({
              id: student.id,
              player: student.name,
              team: student.sport || 'General',
              date: new Date(latest.createdAt).toLocaleDateString(),
              overall: stats.averageRating * 20, // Convert 1-5 to percentage
              technical: Math.round(Math.random() * 20 + 70), // Placeholder until skill breakdown is available
              tactical: Math.round(Math.random() * 20 + 70),
              physical: Math.round(Math.random() * 20 + 70),
              mental: Math.round(Math.random() * 20 + 70),
              trend: stats.recentTrend.length > 1 && 
                     stats.recentTrend[stats.recentTrend.length - 1].rating > 
                     stats.recentTrend[0].rating ? 'up' : 'stable'
            })
          }
        } catch (e) {
          // Skip students without evaluations
        }
      }

      return evaluations
    } catch (error) {
      console.error('Failed to fetch player evaluations:', error)
      throw new Error('Failed to fetch player evaluations')
    }
  }

  // Get staff members (coaches with additional details)
  async getStaffMembers(): Promise<StaffMember[]> {
    try {
      const coaches = await this.getCoaches()
      
      return coaches.map(coach => ({
        id: coach.id,
        name: coach.name,
        role: 'Coach',
        specialty: coach.specialty?.join(', ') || 'General',
        status: coach.status === 'Active' ? 'active' as const : 'inactive' as const,
        email: coach.email,
        phone: coach.phone || '',
        rating: coach.rating,
        sessions: coach.sessions
      }))
    } catch (error) {
      console.error('Failed to fetch staff members:', error)
      throw new Error('Failed to fetch staff members')
    }
  }

  // Create session
  async createSession(data: {
    coachId: number
    title: string
    description?: string
    sessionDate: string
    startTime: string
    endTime: string
    location?: string
    maxCapacity?: number
  }): Promise<Session> {
    return apiClient.post<Session>('/sessions', data)
  }

  // Update session
  async updateSession(id: string, data: {
    title?: string
    description?: string
    sessionDate?: string
    startTime?: string
    endTime?: string
    location?: string
    maxCapacity?: number
    status?: string
  }): Promise<Session> {
    return sessionService.updateSession(id, data)
  }

  // Enroll student in session
  async enrollStudent(sessionId: number, studentId: number): Promise<void> {
    return apiClient.post(`/sessions/${sessionId}/enroll`, { studentId })
  }

  // Unenroll student from session
  async unenrollStudent(sessionId: number, studentId: number): Promise<void> {
    return apiClient.delete(`/sessions/${sessionId}/enroll/${studentId}`)
  }

  // Get session attendance
  async getSessionAttendance(sessionId: string) {
    return sessionService.getSessionAttendance(sessionId)
  }

  // Mark attendance
  async markAttendance(sessionId: string, studentId: string, status: 'present' | 'absent' | 'late') {
    return sessionService.markAttendance(sessionId, studentId, status)
  }
}

// Export singleton instance
export const headCoachService = new HeadCoachService()
export default headCoachService
