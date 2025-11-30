import { apiClient } from '../api'

// Types
export interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  address?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  medicalInfo?: {
    allergies?: string[]
    medications?: string[]
    conditions?: string[]
    notes?: string
  }
  clubId: string
  tenantId: string
  createdAt: string
  updatedAt: string
}

export interface CreateStudentData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  address?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  medicalInfo?: {
    allergies?: string[]
    medications?: string[]
    conditions?: string[]
    notes?: string
  }
  clubId: string
}

export interface UpdateStudentData {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  address?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  medicalInfo?: {
    allergies?: string[]
    medications?: string[]
    conditions?: string[]
    notes?: string
  }
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