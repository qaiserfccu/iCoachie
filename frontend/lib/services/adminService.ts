import { apiClient } from '../api'

export interface AdminStat {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: string
  color: string
}

export interface PendingAction {
  type: string
  count: number
  icon: string
  color: string
}

export interface Activity {
  user: string
  action: string
  time: string
  avatar: string
  type: string
}

export interface TopClub {
  name: string
  members: number
  revenue: string
  growth: string
}

export interface SystemHealth {
  name: string
  value: string
  status: 'good' | 'warning' | 'poor'
}

export interface AdminStatsResponse {
  stats: AdminStat[]
}

export interface AdminPendingResponse {
  pendingActions: PendingAction[]
}

export interface AdminActivitiesResponse {
  activities: Activity[]
}

export interface AdminTopClubsResponse {
  topClubs: TopClub[]
}

export interface AdminHealthResponse {
  overallStatus: string
  systems: SystemHealth[]
}

class AdminService {
  async getStats(): Promise<AdminStat[]> {
    try {
      const response = await apiClient.get<AdminStatsResponse>('/admin/stats')
      return response.stats
    } catch (error) {
      console.error('Error fetching admin stats:', error)
      throw error
    }
  }

  async getPendingActions(): Promise<PendingAction[]> {
    try {
      const response = await apiClient.get<AdminPendingResponse>('/admin/pending')
      return response.pendingActions
    } catch (error) {
      console.error('Error fetching pending actions:', error)
      throw error
    }
  }

  async getRecentActivities(): Promise<Activity[]> {
    try {
      const response = await apiClient.get<AdminActivitiesResponse>('/admin/activities')
      return response.activities
    } catch (error) {
      console.error('Error fetching activities:', error)
      throw error
    }
  }

  async getTopClubs(): Promise<TopClub[]> {
    try {
      const response = await apiClient.get<AdminTopClubsResponse>('/admin/top-clubs')
      return response.topClubs
    } catch (error) {
      console.error('Error fetching top clubs:', error)
      throw error
    }
  }

  async getSystemHealth(): Promise<AdminHealthResponse> {
    try {
      const response = await apiClient.get<AdminHealthResponse>('/admin/health')
      return response
    } catch (error) {
      console.error('Error fetching system health:', error)
      throw error
    }
  }
}

export const adminService = new AdminService()
export default adminService
