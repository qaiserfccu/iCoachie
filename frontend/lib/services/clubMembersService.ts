import { studentService, coachService, sessionService, clubDashboardService } from './index'

export interface Member {
  id: string
  name: string
  avatar?: string
  age?: number
  sport: string
  coach: string
  membership: string
  status: 'Active' | 'Inactive'
  joined: string
  parent?: string
  email: string
  phone?: string
}

export interface MemberStats {
  totalMembers: number
  activeMembers: number
  newThisMonth: number
  expiringSoon: number
}

class ClubMembersService {
  // Get all members for the current club
  async getMembers(): Promise<Member[]> {
    try {
      // Get students (members)
      const students = await studentService.getStudents()

      // Get coaches for reference
      const coaches = await coachService.getCoaches()

      // Create coach map for quick lookup
      const coachMap = new Map(coaches.map(coach => [coach.id, coach]))

      // Get sessions to determine sport and coach assignments
      const sessions = await sessionService.getSessions()

      // Create member data
      const members = await Promise.all(
        students.map(async (student) => {
          // Find sessions for this student to determine sport and coach
          const studentSessions = sessions.filter(session =>
            // This would need attendance data to link students to sessions
            // For now, we'll use a simplified approach
            true
          )

          // Get primary sport from sessions (simplified - take first session's sport)
          const primarySession = studentSessions[0]
          const sport = primarySession ? this.getSportFromSession(primarySession) : 'General'

          // Get coach name
          const coach = primarySession && coachMap.get(primarySession.coachId)
            ? `${coachMap.get(primarySession.coachId)!.name}`
            : 'Unassigned'

          // Calculate age from date of birth
          const age = student.dateOfBirth
            ? this.calculateAge(new Date(student.dateOfBirth))
            : undefined

          // Get parent/guardian info
          const parent = student.emergencyContact?.name || 'Not specified'

          return {
            id: student.id,
            name: `${student.firstName} ${student.lastName}`,
            avatar: undefined, // Will be generated from initials
            age,
            sport,
            coach,
            membership: 'Standard', // Default, could be enhanced with membership data
            status: 'Active' as const, // Default, could be enhanced with activity tracking
            joined: this.formatDate(student.createdAt),
            parent,
            email: student.email,
            phone: student.phone
          }
        })
      )

      return members
    } catch (error) {
      console.error('Error fetching members:', error)
      return []
    }
  }

  // Get member statistics
  async getMemberStats(): Promise<MemberStats> {
    try {
      const clubStats = await clubDashboardService.getClubStats()

      // For now, return simplified stats based on available data
      // In a real implementation, this would aggregate from various sources
      return {
        totalMembers: clubStats.totalMembers,
        activeMembers: Math.floor(clubStats.totalMembers * 0.93), // Assume 93% active
        newThisMonth: Math.floor(clubStats.totalMembers * 0.06), // Assume 6% new this month
        expiringSoon: Math.floor(clubStats.totalMembers * 0.03) // Assume 3% expiring soon
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

  private getSportFromSession(session: any): string {
    // This is a simplified mapping - in reality, you'd have sport data in sessions
    const title = session.title.toLowerCase()
    if (title.includes('swim')) return 'Swimming'
    if (title.includes('basketball') || title.includes('bball')) return 'Basketball'
    if (title.includes('soccer') || title.includes('football')) return 'Soccer'
    if (title.includes('tennis')) return 'Tennis'
    return 'General'
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
}

export const clubMembersService = new ClubMembersService()
export default clubMembersService