import { apiClient } from '../api'

// Types
export interface Student {
  id: number
  name: string
  age?: number
  level?: string
  sport?: string
  createdAt: string
  user: {
    id: number
    email: string
    profile: {
      displayName: string
      phone?: string
    }
  }
  parent?: {
    id: number
    name: string
    profile: {
      displayName: string
      phone?: string
    }
  }
  coach?: {
    id: number
    name: string
    profile: {
      displayName: string
    }
  }
}

export interface CreateStudentData {
  userId: number
  parentId?: number
  coachId?: number
  name: string
  age?: number
  level?: string
  sport?: string
}

export interface UpdateStudentData {
  parentId?: number
  coachId?: number
  name?: string
  age?: number
  level?: string
  sport?: string
}

class StudentService {
  private readonly baseUrl = '/students'

  // Get all students for current tenant
  async getStudents(clubId?: string): Promise<Student[]> {
    const params = clubId ? { clubId } : {}
    return apiClient.get<Student[]>(this.baseUrl, { params })
  }

  // Get student by ID
  async getStudent(id: string): Promise<Student> {
    return apiClient.get<Student>(`${this.baseUrl}/${id}`)
  }

  // Create new student
  async createStudent(data: CreateStudentData): Promise<Student> {
    return apiClient.post<Student>(this.baseUrl, data)
  }

  // Update student
  async updateStudent(id: string, data: UpdateStudentData): Promise<Student> {
    return apiClient.put<Student>(`${this.baseUrl}/${id}`, data)
  }

  // Delete student
  async deleteStudent(id: string): Promise<void> {
    return apiClient.delete(`${this.baseUrl}/${id}`)
  }

  // Get student attendance history
  async getStudentAttendance(id: string): Promise<any[]> {
    return apiClient.get(`${this.baseUrl}/${id}/attendance`)
  }

  // Get student evaluations
  async getStudentEvaluations(id: string): Promise<any[]> {
    return apiClient.get(`${this.baseUrl}/${id}/evaluations`)
  }

  // Get student sessions
  async getStudentSessions(id: string): Promise<any[]> {
    return apiClient.get(`${this.baseUrl}/${id}/sessions`)
  }
}

export const studentService = new StudentService()
export default studentService