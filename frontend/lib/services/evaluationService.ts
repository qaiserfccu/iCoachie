import { apiClient } from '../api'

// Types
export interface Evaluation {
  id: string
  studentId: string
  coachId: string
  sessionId?: string
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
  isPrivate: boolean
  tenantId: string
  createdAt: string
  updatedAt: string
}

export interface CreateEvaluationData {
  studentId: string
  sessionId?: string
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

export interface UpdateEvaluationData {
  title?: string
  content?: string
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

class EvaluationService {
  private readonly baseUrl = '/evaluations'

  // Get all evaluations for current tenant
  async getEvaluations(studentId?: string, coachId?: string): Promise<Evaluation[]> {
    const params: any = {}
    if (studentId) params.studentId = studentId
    if (coachId) params.coachId = coachId
    return apiClient.get<Evaluation[]>(this.baseUrl, { params })
  }

  // Get evaluation by ID
  async getEvaluation(id: string): Promise<Evaluation> {
    return apiClient.get<Evaluation>(`${this.baseUrl}/${id}`)
  }

  // Create new evaluation
  async createEvaluation(data: CreateEvaluationData): Promise<Evaluation> {
    return apiClient.post<Evaluation>(this.baseUrl, data)
  }

  // Update evaluation
  async updateEvaluation(id: string, data: UpdateEvaluationData): Promise<Evaluation> {
    return apiClient.put<Evaluation>(`${this.baseUrl}/${id}`, data)
  }

  // Delete evaluation
  async deleteEvaluation(id: string): Promise<void> {
    return apiClient.delete(`${this.baseUrl}/${id}`)
  }

  // Get evaluations for a student
  async getStudentEvaluations(studentId: string): Promise<Evaluation[]> {
    return apiClient.get<Evaluation[]>(`${this.baseUrl}/student/${studentId}`)
  }

  // Get evaluations by a coach
  async getCoachEvaluations(coachId: string): Promise<Evaluation[]> {
    return apiClient.get<Evaluation[]>(`${this.baseUrl}/coach/${coachId}`)
  }

  // Get evaluations for a session
  async getSessionEvaluations(sessionId: string): Promise<Evaluation[]> {
    return apiClient.get<Evaluation[]>(`${this.baseUrl}/session/${sessionId}`)
  }

  // Get public evaluations (visible to students)
  async getPublicEvaluations(studentId?: string): Promise<Evaluation[]> {
    const params = studentId ? { studentId } : {}
    return apiClient.get<Evaluation[]>(`${this.baseUrl}/public`, { params })
  }

  // Get evaluation statistics for a student
  async getStudentEvaluationStats(studentId: string): Promise<any> {
    return apiClient.get(`${this.baseUrl}/student/${studentId}/stats`)
  }

  // Share evaluation with student (make it visible)
  async shareEvaluation(id: string): Promise<Evaluation> {
    return apiClient.patch<Evaluation>(`${this.baseUrl}/${id}/share`)
  }

  // Unshare evaluation from student (make it private)
  async unshareEvaluation(id: string): Promise<Evaluation> {
    return apiClient.patch<Evaluation>(`${this.baseUrl}/${id}/unshare`)
  }
}

export const evaluationService = new EvaluationService()
export default evaluationService