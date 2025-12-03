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

export interface PageInfo {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

// User Management Types
export interface AdminUser {
  id: number
  name: string
  email: string
  role: string
  status: string
  joined: string
  avatar: string
}

export interface RoleStat {
  role: string
  count: number
  icon: string
  color: string
}

export interface AdminUsersResponse {
  users: AdminUser[]
  roleStats: RoleStat[]
  pageInfo: PageInfo
}

// Club Management Types
export interface AdminClub {
  id: number
  name: string
  logo: string
  location: string
  members: number
  coaches: number
  rating: number
  status: string
  revenue: string
  plan: string
}

export interface ClubStats {
  total: number
  verified: number
  pending: number
  totalRevenue: string
}

export interface AdminClubsResponse {
  clubs: AdminClub[]
  stats: ClubStats
  pageInfo: PageInfo
}

// Roles & Permissions Types
export interface AdminRole {
  id: number
  name: string
  code: string
  icon: string
  color: string
  description: string
  users: number
  permissions: string[]
}

export interface PermissionMatrixRow {
  permission: string
  [roleCode: string]: boolean | string
}

export interface AdminRolesResponse {
  roles: AdminRole[]
  permissionsMatrix: PermissionMatrixRow[]
}

// Coach Types
export interface AdminCoach {
  id: number
  name: string
  email: string
  avatar: string
  specialty: string
  rating: number
  students: number
  sessions: number
  status: string
}

export interface AdminCoachesResponse {
  coaches: AdminCoach[]
  pageInfo: PageInfo
}

// Freelancer Types
export interface AdminFreelancer {
  id: number
  name: string
  email: string
  avatar: string
  specialty: string
  rating: number
  bookings: number
  earnings: string
  status: string
}

export interface AdminFreelancersResponse {
  freelancers: AdminFreelancer[]
  pageInfo: PageInfo
}

// Families Types
export interface AdminFamily {
  id: number
  parentName: string
  email: string
  avatar: string
  kids: number
  activeSessions: number
  totalSpent: string
  joined: string
}

export interface AdminFamiliesResponse {
  families: AdminFamily[]
  pageInfo: PageInfo
}

// Transactions Types
export interface AdminTransaction {
  id: string
  user: string
  type: string
  amount: string
  status: string
  date: string
}

export interface TransactionStats {
  totalRevenue: string
  transactionCount: string
  avgTransaction: string
}

export interface AdminTransactionsResponse {
  transactions: AdminTransaction[]
  stats: TransactionStats
  pageInfo: PageInfo
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

  // User Management
  async getUsers(params?: { page?: number; pageSize?: number; search?: string }): Promise<AdminUsersResponse> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
      if (params?.search) queryParams.append('search', params.search)
      
      const url = queryParams.toString() ? `/admin/users?${queryParams}` : '/admin/users'
      return await apiClient.get<AdminUsersResponse>(url)
    } catch (error) {
      console.error('Error fetching admin users:', error)
      throw error
    }
  }

  // Club Management
  async getClubs(params?: { page?: number; pageSize?: number; search?: string }): Promise<AdminClubsResponse> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
      if (params?.search) queryParams.append('search', params.search)
      
      const url = queryParams.toString() ? `/admin/clubs?${queryParams}` : '/admin/clubs'
      return await apiClient.get<AdminClubsResponse>(url)
    } catch (error) {
      console.error('Error fetching admin clubs:', error)
      throw error
    }
  }

  // Roles & Permissions
  async getRoles(): Promise<AdminRolesResponse> {
    try {
      return await apiClient.get<AdminRolesResponse>('/admin/roles')
    } catch (error) {
      console.error('Error fetching admin roles:', error)
      throw error
    }
  }

  // Coaches
  async getCoaches(params?: { page?: number; pageSize?: number; search?: string }): Promise<AdminCoachesResponse> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
      if (params?.search) queryParams.append('search', params.search)
      
      const url = queryParams.toString() ? `/admin/coaches?${queryParams}` : '/admin/coaches'
      return await apiClient.get<AdminCoachesResponse>(url)
    } catch (error) {
      console.error('Error fetching admin coaches:', error)
      throw error
    }
  }

  // Freelancers
  async getFreelancers(params?: { page?: number; pageSize?: number; search?: string }): Promise<AdminFreelancersResponse> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
      if (params?.search) queryParams.append('search', params.search)
      
      const url = queryParams.toString() ? `/admin/freelancers?${queryParams}` : '/admin/freelancers'
      return await apiClient.get<AdminFreelancersResponse>(url)
    } catch (error) {
      console.error('Error fetching admin freelancers:', error)
      throw error
    }
  }

  // Families
  async getFamilies(params?: { page?: number; pageSize?: number; search?: string }): Promise<AdminFamiliesResponse> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
      if (params?.search) queryParams.append('search', params.search)
      
      const url = queryParams.toString() ? `/admin/families?${queryParams}` : '/admin/families'
      return await apiClient.get<AdminFamiliesResponse>(url)
    } catch (error) {
      console.error('Error fetching admin families:', error)
      throw error
    }
  }

  // Transactions
  async getTransactions(params?: { page?: number; pageSize?: number; search?: string }): Promise<AdminTransactionsResponse> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
      if (params?.search) queryParams.append('search', params.search)
      
      const url = queryParams.toString() ? `/admin/transactions?${queryParams}` : '/admin/transactions'
      return await apiClient.get<AdminTransactionsResponse>(url)
    } catch (error) {
      console.error('Error fetching admin transactions:', error)
      throw error
    }
  }
}

export const adminService = new AdminService()
export default adminService
