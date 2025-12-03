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

  // Settings Management
  async getSettings(category?: string): Promise<SettingsResponse> {
    try {
      const url = category ? `/admin/settings?category=${category}` : '/admin/settings'
      return await apiClient.get<SettingsResponse>(url)
    } catch (error) {
      console.error('Error fetching settings:', error)
      throw error
    }
  }

  async updateSettings(settings: Record<string, Record<string, string>>): Promise<{ success: boolean; message: string }> {
    try {
      return await apiClient.put<{ success: boolean; message: string }>('/admin/settings', { settings })
    } catch (error) {
      console.error('Error updating settings:', error)
      throw error
    }
  }

  async testEmailConfiguration(testEmail: string): Promise<{ success: boolean; message: string }> {
    try {
      return await apiClient.post<{ success: boolean; message: string }>('/admin/settings/test-email', { testEmail })
    } catch (error) {
      console.error('Error testing email:', error)
      throw error
    }
  }

  // Email Templates Management
  async getEmailTemplates(): Promise<EmailTemplatesResponse> {
    try {
      return await apiClient.get<EmailTemplatesResponse>('/admin/email-templates')
    } catch (error) {
      console.error('Error fetching email templates:', error)
      throw error
    }
  }

  async getEmailTemplate(id: number): Promise<EmailTemplate> {
    try {
      return await apiClient.get<EmailTemplate>(`/admin/email-templates/${id}`)
    } catch (error) {
      console.error('Error fetching email template:', error)
      throw error
    }
  }

  async createEmailTemplate(template: CreateEmailTemplateInput): Promise<EmailTemplate & { message: string }> {
    try {
      return await apiClient.post<EmailTemplate & { message: string }>('/admin/email-templates', template)
    } catch (error) {
      console.error('Error creating email template:', error)
      throw error
    }
  }

  async updateEmailTemplate(id: number, template: Partial<CreateEmailTemplateInput>): Promise<EmailTemplate & { message: string }> {
    try {
      return await apiClient.put<EmailTemplate & { message: string }>(`/admin/email-templates/${id}`, template)
    } catch (error) {
      console.error('Error updating email template:', error)
      throw error
    }
  }

  async deleteEmailTemplate(id: number): Promise<{ success: boolean; message: string }> {
    try {
      return await apiClient.delete<{ success: boolean; message: string }>(`/admin/email-templates/${id}`)
    } catch (error) {
      console.error('Error deleting email template:', error)
      throw error
    }
  }

  async duplicateEmailTemplate(id: number): Promise<EmailTemplate & { message: string }> {
    try {
      return await apiClient.post<EmailTemplate & { message: string }>(`/admin/email-templates/${id}/duplicate`, {})
    } catch (error) {
      console.error('Error duplicating email template:', error)
      throw error
    }
  }

  async sendTestEmail(id: number, testEmail: string, testData?: Record<string, string>): Promise<{ success: boolean; message: string }> {
    try {
      return await apiClient.post<{ success: boolean; message: string }>(`/admin/email-templates/${id}/test`, { testEmail, testData })
    } catch (error) {
      console.error('Error sending test email:', error)
      throw error
    }
  }
}

// Settings types
export interface SettingsResponse {
  settings: Record<string, Record<string, string>>
  raw: Array<{
    id: number
    key: string
    value: string
    category: string
    isEncrypted: boolean
    createdAt: string
    updatedAt: string
  }>
}

// Email Template types
export interface EmailTemplate {
  id: number
  name: string
  subject: string
  body: string
  variables: string[]
  status: 'Active' | 'Inactive'
  lastModified: string
  createdAt: string
  updatedAt: string
}

export interface EmailTemplatesResponse {
  templates: EmailTemplate[]
}

export interface CreateEmailTemplateInput {
  name: string
  subject: string
  body: string
  variables?: string[]
  isActive?: boolean
}

export const adminService = new AdminService()
export default adminService
