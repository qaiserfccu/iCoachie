import { evaluationService, Evaluation } from './evaluationService'
import { studentService, Student } from './studentService'
import { sessionService } from './sessionService'

// Types
export interface StudentSkill {
  name: string
  level: number
}

export interface StudentProgress {
  id: string
  name: string
  avatar: string
  overallProgress: number
  trend: 'up' | 'down'
  skills: StudentSkill[]
  recentAchievement: string
  lastEvaluation: string
}

export interface SkillOverview {
  name: string
  avgScore: number
  students: number
}

class CoachProgressService {
  // Get student progress data
  async getStudentProgress(): Promise<StudentProgress[]> {
    try {
      // Get all students
      const students = await studentService.getStudents()

      // Get all evaluations for the coach
      const evaluations = await evaluationService.getEvaluations()

      // Process each student's progress
      const studentProgress: StudentProgress[] = await Promise.all(
        students.slice(0, 4).map(async (student) => {
          // Get student's evaluations
          const studentEvaluations = evaluations.filter(e => e.studentId === student.id)

          // Calculate overall progress (average of recent evaluations)
          const recentEvaluations = studentEvaluations
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 3) // Last 3 evaluations

          const overallProgress = recentEvaluations.length > 0
            ? Math.round(recentEvaluations.reduce((sum, evaluation) => sum + (evaluation.rating || 0), 0) / recentEvaluations.length * 20) // Convert 1-5 scale to percentage
            : 0

          // Calculate trend (compare with previous period)
          const trend = this.calculateTrend(studentEvaluations)

          // Extract skills from evaluations
          const skills = this.extractSkillsFromEvaluations(studentEvaluations)

          // Get recent achievement (latest evaluation title or default)
          const recentAchievement = recentEvaluations.length > 0
            ? this.getAchievementBadge(recentEvaluations[0])
            : 'No recent evaluations'

          // Get last evaluation date
          const lastEvaluation = recentEvaluations.length > 0
            ? new Date(recentEvaluations[0].createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })
            : 'No evaluations'

          return {
            id: student.id,
            name: `${student.firstName} ${student.lastName}`,
            avatar: `${student.firstName[0]}${student.lastName[0]}`,
            overallProgress,
            trend,
            skills,
            recentAchievement,
            lastEvaluation
          }
        })
      )

      return studentProgress
    } catch (error) {
      console.error('Error fetching student progress:', error)
      throw error
    }
  }

  // Get skill overview statistics
  async getSkillOverview(): Promise<SkillOverview[]> {
    try {
      // Get all evaluations
      const evaluations = await evaluationService.getEvaluations()

      // Get all students
      const students = await studentService.getStudents()

      // Define skill categories
      const skillCategories = ['technique', 'fitness', 'attitude', 'teamwork']
      const skillNames = ['Technique', 'Endurance', 'Speed', 'Form']

      const skillOverview: SkillOverview[] = skillCategories.map((skillKey, index) => {
        // Get all evaluations with this skill
        const evaluationsWithSkill = evaluations.filter(e => e.skills && e.skills[skillKey as keyof typeof e.skills])

        if (evaluationsWithSkill.length === 0) {
          return {
            name: skillNames[index],
            avgScore: 0,
            students: students.length
          }
        }

        // Calculate average score for this skill
        const totalScore = evaluationsWithSkill.reduce((sum, evaluation) => {
          const skillScore = evaluation.skills![skillKey as keyof typeof evaluation.skills] as number
          return sum + skillScore
        }, 0)

        const avgScore = Math.round(totalScore / evaluationsWithSkill.length)

        return {
          name: skillNames[index],
          avgScore,
          students: students.length
        }
      })

      return skillOverview
    } catch (error) {
      console.error('Error fetching skill overview:', error)
      // Return default stats on error
      return [
        { name: 'Technique', avgScore: 0, students: 0 },
        { name: 'Endurance', avgScore: 0, students: 0 },
        { name: 'Speed', avgScore: 0, students: 0 },
        { name: 'Form', avgScore: 0, students: 0 }
      ]
    }
  }

  // Helper method to calculate trend
  private calculateTrend(evaluations: Evaluation[]): 'up' | 'down' {
    if (evaluations.length < 2) return 'up'

    // Sort by date (newest first)
    const sortedEvals = evaluations.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    // Compare recent vs older evaluations
    const recent = sortedEvals.slice(0, 2) // Last 2 evaluations
    const older = sortedEvals.slice(2, 4) // Previous 2 evaluations

    const recentAvg = recent.reduce((sum, evaluation) => sum + (evaluation.rating || 0), 0) / recent.length
    const olderAvg = older.length > 0
      ? older.reduce((sum, evaluation) => sum + (evaluation.rating || 0), 0) / older.length
      : recentAvg

    return recentAvg >= olderAvg ? 'up' : 'down'
  }

  // Helper method to extract skills from evaluations
  private extractSkillsFromEvaluations(evaluations: Evaluation[]): StudentSkill[] {
    if (evaluations.length === 0) {
      return [
        { name: 'Freestyle', level: 0 },
        { name: 'Backstroke', level: 0 },
        { name: 'Breaststroke', level: 0 },
        { name: 'Butterfly', level: 0 }
      ]
    }

    // Get the most recent evaluation with skills
    const recentEval = evaluations
      .filter(e => e.skills)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

    if (!recentEval || !recentEval.skills) {
      return [
        { name: 'Freestyle', level: 0 },
        { name: 'Backstroke', level: 0 },
        { name: 'Breaststroke', level: 0 },
        { name: 'Butterfly', level: 0 }
      ]
    }

    // Map evaluation skills to display skills
    const skillMapping = {
      technique: 'Freestyle',
      fitness: 'Backstroke',
      attitude: 'Breaststroke',
      teamwork: 'Butterfly'
    }

    return Object.entries(recentEval.skills).map(([key, value]) => ({
      name: skillMapping[key as keyof typeof skillMapping] || key,
      level: value as number
    }))
  }

  // Helper method to get achievement badge based on evaluation
  private getAchievementBadge(evaluation: Evaluation): string {
    const rating = evaluation.rating || 0

    if (rating >= 5) return 'Gold Badge - Excellence'
    if (rating >= 4) return 'Silver Badge - Achievement'
    if (rating >= 3) return 'Bronze Badge - Progress'
    return 'Participation Award'
  }
}

export const coachProgressService = new CoachProgressService()
export default coachProgressService