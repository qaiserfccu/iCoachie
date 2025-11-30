import { apiClient } from '../api'

export interface Coach {
  id: number
  userId: number
  name: string
  email: string
  avatar?: string
  phone?: string
  specialty: string[]
  rating: number
  students: number
  sessions: number
  status: string
  experienceYears?: number
  certification?: string
  hourlyRate?: number
}

class CoachService {
  // Get all coaches in the club
  async getCoaches(): Promise<Coach[]> {
    try {
      const response = await apiClient.get<Coach[]>('/coaches')
      return response
    } catch (error) {
      throw new Error('Failed to fetch coaches')
    }
  }

  // Get coach by ID
  async getCoach(coachId: number): Promise<Coach> {
    try {
      const response = await apiClient.get<Coach>(`/coaches/${coachId}`)
      return response
    } catch (error) {
      throw new Error('Failed to fetch coach')
    }
  }

  // Create a new coach
  async createCoach(coachData: {
    email: string
    password: string
    name: string
    specializations: string[]
    experienceYears?: number
    certification?: string
    hourlyRate?: number
  }): Promise<Coach> {
    try {
      const response = await apiClient.post<Coach>('/coaches', coachData)
      return response
    } catch (error) {
      throw new Error('Failed to create coach')
    }
  }

  // Update coach
  async updateCoach(coachId: number, coachData: Partial<Coach>): Promise<Coach> {
    try {
      const response = await apiClient.put<Coach>(`/coaches/${coachId}`, coachData)
      return response
    } catch (error) {
      throw new Error('Failed to update coach')
    }
  }

  // Delete coach
  async deleteCoach(coachId: number): Promise<void> {
    try {
      await apiClient.delete(`/coaches/${coachId}`)
    } catch (error) {
      throw new Error('Failed to delete coach')
    }
  }
}

// Export singleton instance
const coachService = new CoachService()
export default coachService