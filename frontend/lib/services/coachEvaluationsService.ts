import { evaluationService, Evaluation } from './evaluationService'
import { studentService, Student } from './studentService'
import { sessionService } from './sessionService'

// Types
export interface PendingEvaluation {
  id: string
  studentId: string
  studentName: string
  studentAvatar: string
  type: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
}

export interface EvaluationStats {
  name: string
  count: number
}

export interface QuickEvaluationData {
  studentId: string
  title: string
  content: string
  rating?: number
  skills?: {
    technique: number
    fitness: number
    attitude: number
    teamwork: number
  }
  recommendations?: string
  isPrivate?: boolean
}

class CoachEvaluationsService {
  // Get pending evaluations for the coach
  async getPendingEvaluations(): Promise<PendingEvaluation[]> {
    try {
      // Get all students
      const students = await studentService.getStudents()

      // Get recent evaluations (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      // For now, we'll simulate pending evaluations based on students
      // In a real implementation, this would check evaluation schedules or criteria
      const pendingEvaluations: PendingEvaluation[] = students.slice(0, 4).map((student, index) => {
        const evaluationTypes = ['Monthly Progress', 'Skill Assessment', 'Performance Review', 'Level Upgrade']
        const priorities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'medium', 'low']

        const dueDate = new Date()
        dueDate.setDate(dueDate.getDate() + (index + 1) * 2) // Due in 2, 4, 6, 8 days

        return {
          id: `pending-${student.id}`,
          studentId: student.id,
          studentName: `${student.firstName} ${student.lastName}`,
          studentAvatar: `${student.firstName[0]}${student.lastName[0]}`,
          type: evaluationTypes[index % evaluationTypes.length],
          dueDate: dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          priority: priorities[index % priorities.length]
        }
      })

      return pendingEvaluations
    } catch (error) {
      console.error('Error fetching pending evaluations:', error)
      throw error
    }
  }

  // Get evaluation statistics
  async getEvaluationStats(): Promise<EvaluationStats[]> {
    try {
      // Get all evaluations for the coach
      const evaluations = await evaluationService.getEvaluations()

      // Count by type (using title as type for now)
      const typeCounts: { [key: string]: number } = {}

      evaluations.forEach(evaluation => {
        const type = evaluation.title
        typeCounts[type] = (typeCounts[type] || 0) + 1
      })

      // Convert to array format
      const stats: EvaluationStats[] = Object.entries(typeCounts).map(([name, count]) => ({
        name,
        count
      }))

      // If no evaluations, return default types with 0 count
      if (stats.length === 0) {
        return [
          { name: 'Monthly Progress', count: 0 },
          { name: 'Skill Assessment', count: 0 },
          { name: 'Performance Review', count: 0 },
          { name: 'Level Upgrade', count: 0 }
        ]
      }

      return stats
    } catch (error) {
      console.error('Error fetching evaluation stats:', error)
      // Return default stats on error
      return [
        { name: 'Monthly Progress', count: 0 },
        { name: 'Skill Assessment', count: 0 },
        { name: 'Performance Review', count: 0 },
        { name: 'Level Upgrade', count: 0 }
      ]
    }
  }

  // Get students for quick evaluation form
  async getStudentsForEvaluation(): Promise<Student[]> {
    try {
      return await studentService.getStudents()
    } catch (error) {
      console.error('Error fetching students for evaluation:', error)
      throw error
    }
  }

  // Create a quick evaluation
  async createQuickEvaluation(data: QuickEvaluationData): Promise<Evaluation> {
    try {
      const evaluationData = {
        studentId: data.studentId,
        title: data.title,
        content: data.content,
        rating: data.rating,
        skills: data.skills,
        recommendations: data.recommendations,
        isPrivate: data.isPrivate ?? false
      }

      return await evaluationService.createEvaluation(evaluationData)
    } catch (error) {
      console.error('Error creating quick evaluation:', error)
      throw error
    }
  }

  // Get evaluation types (for dropdown)
  getEvaluationTypes(): string[] {
    return [
      'Monthly Progress',
      'Skill Assessment',
      'Performance Review',
      'Level Upgrade'
    ]
  }
}

export const coachEvaluationsService = new CoachEvaluationsService()
export default coachEvaluationsService