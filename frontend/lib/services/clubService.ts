import { apiClient } from '../api'

// Types
export interface Club {
  id: string
  name: string
  description?: string
  logo?: string
  contactEmail?: string
  contactPhone?: string
  address?: string
  tenantId: string
  createdAt: string
  updatedAt: string
}

export interface CreateClubData {
  name: string
  description?: string
  contactEmail?: string
  contactPhone?: string
  address?: string
}

export interface UpdateClubData {
  name?: string
  description?: string
  contactEmail?: string
  contactPhone?: string
  address?: string
}

class ClubService {
  private readonly baseUrl = '/clubs'

  // Get all clubs for current tenant
  async getClubs(): Promise<Club[]> {
    return apiClient.get<Club[]>(this.baseUrl)
  }

  // Get club by ID
  async getClub(id: string): Promise<Club> {
    return apiClient.get<Club>(`${this.baseUrl}/${id}`)
  }

  // Create new club
  async createClub(data: CreateClubData): Promise<Club> {
    return apiClient.post<Club>(this.baseUrl, data)
  }

  // Update club
  async updateClub(id: string, data: UpdateClubData): Promise<Club> {
    return apiClient.put<Club>(`${this.baseUrl}/${id}`, data)
  }

  // Delete club
  async deleteClub(id: string): Promise<void> {
    return apiClient.delete(`${this.baseUrl}/${id}`)
  }

  // Get club statistics
  async getClubStats(id: string): Promise<any> {
    return apiClient.get(`${this.baseUrl}/${id}/stats`)
  }
}

export const clubService = new ClubService()
export default clubService