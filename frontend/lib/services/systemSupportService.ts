/**
 * System Support Service
 * Handles API calls for system support dashboard functionality
 */

import { apiClient } from '../api';

// Types
export interface DashboardStat {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
  color: string;
}

export interface Ticket {
  id: string;
  user: string;
  email: string;
  issue: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  time: string;
  avatar: string;
  category: string;
  responses: number;
  createdAt: string;
}

export interface TicketDetail extends Ticket {
  subject: string;
  content: string;
  assignee: string | null;
}

export interface SystemStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  latency: string;
}

export interface DiagnosticsResponse {
  overallStatus: string;
  systemStatus: SystemStatus[];
  infrastructure: {
    servers: { total: number; healthy: number; status: string };
    databases: { total: number; healthy: number; status: string };
    cdnNodes: { total: number; healthy: number; status: string };
  };
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  service: string;
  message: string;
}

export interface PerformanceMetrics {
  cpu: { current: number; average: number; peak: number; status: string };
  memory: { used: number; available: number; total: number; status: string };
  disk: { used: number; available: number; total: number; status: string };
  network: { inbound: string; outbound: string; latency: string; status: string };
  requests: { perSecond: number; averageResponseTime: string; errorRate: string; status: string };
}

export interface SupportUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string;
  createdAt: string;
  lastActive: string;
}

export interface SupportUserDetail extends SupportUser {
  club: string | null;
  phone: string | null;
  bio: string | null;
  activity: {
    messagesLast30Days: number;
    paymentsLast30Days: number;
    sessionsLast30Days: number;
  };
}

export interface AccessRole {
  id: number;
  code: string;
  name: string;
  description: string | null;
  scope: string | null;
  userCount: number;
}

export interface Report {
  id: number;
  name: string;
  description: string;
  type: string;
  lastGenerated: string;
  frequency: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: number | null;
  userName: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
}

export interface KnowledgeBaseArticle {
  id: number;
  title: string;
  category: string;
  content: string;
  views: number;
  helpful: number;
  lastUpdated: string;
}

export interface PageInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Service class
class SystemSupportService {
  private readonly BASE_PATH = '/system-support';

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<{ stats: DashboardStat[] }> {
    return apiClient.get(`${this.BASE_PATH}/dashboard`);
  }

  /**
   * Get tickets list
   */
  async getTickets(params: {
    status?: string;
    priority?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  } = {}): Promise<{
    tickets: Ticket[];
    stats: { open: number; inProgress: number; urgent: number };
    pageInfo: PageInfo;
  }> {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.priority) queryParams.append('priority', params.priority);
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    return apiClient.get(`${this.BASE_PATH}/tickets?${queryParams.toString()}`);
  }

  /**
   * Get ticket details
   */
  async getTicket(id: string): Promise<TicketDetail> {
    return apiClient.get(`${this.BASE_PATH}/tickets/${id}`);
  }

  /**
   * Resolve a ticket
   */
  async resolveTicket(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.patch(`${this.BASE_PATH}/tickets/${id}/resolve`);
  }

  /**
   * Get system diagnostics
   */
  async getDiagnostics(): Promise<DiagnosticsResponse> {
    return apiClient.get(`${this.BASE_PATH}/diagnostics`);
  }

  /**
   * Get system logs
   */
  async getLogs(params: {
    level?: string;
    limit?: number;
  } = {}): Promise<{ logs: LogEntry[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params.level) queryParams.append('level', params.level);
    if (params.limit) queryParams.append('limit', params.limit.toString());

    return apiClient.get(`${this.BASE_PATH}/diagnostics/logs?${queryParams.toString()}`);
  }

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics(): Promise<{
    metrics: PerformanceMetrics;
    history: Array<{ hour: number; cpu: number; memory: number; requests: number }>;
    lastUpdated: string;
  }> {
    return apiClient.get(`${this.BASE_PATH}/diagnostics/performance`);
  }

  /**
   * Search users
   */
  async searchUsers(params: {
    search?: string;
    page?: number;
    pageSize?: number;
  } = {}): Promise<{
    users: SupportUser[];
    pageInfo: PageInfo;
  }> {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    return apiClient.get(`${this.BASE_PATH}/users?${queryParams.toString()}`);
  }

  /**
   * Get user details
   */
  async getUserDetails(id: number): Promise<SupportUserDetail> {
    return apiClient.get(`${this.BASE_PATH}/users/${id}`);
  }

  /**
   * Reset user password
   */
  async resetUserPassword(id: number): Promise<{ success: boolean; message: string }> {
    return apiClient.post(`${this.BASE_PATH}/users/${id}/reset-password`);
  }

  /**
   * Get users with account issues
   */
  async getUsersWithIssues(): Promise<{
    users: Array<SupportUser & { issue: string }>;
  }> {
    return apiClient.get(`${this.BASE_PATH}/users/issues`);
  }

  /**
   * Get access management data
   */
  async getAccessManagement(): Promise<{
    summary: { totalUsers: number; activeToday: number; roles: number };
    roles: AccessRole[];
  }> {
    return apiClient.get(`${this.BASE_PATH}/access`);
  }

  /**
   * Get available reports
   */
  async getReports(): Promise<{ reports: Report[] }> {
    return apiClient.get(`${this.BASE_PATH}/reports`);
  }

  /**
   * Get audit logs
   */
  async getAuditLogs(params: {
    action?: string;
    userId?: number;
    limit?: number;
  } = {}): Promise<{ logs: AuditLog[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params.action) queryParams.append('action', params.action);
    if (params.userId) queryParams.append('userId', params.userId.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    return apiClient.get(`${this.BASE_PATH}/audit-logs?${queryParams.toString()}`);
  }

  /**
   * Get knowledge base articles
   */
  async getKnowledgeBase(params: {
    category?: string;
    search?: string;
  } = {}): Promise<{
    articles: KnowledgeBaseArticle[];
    categories: Array<{ name: string; count: number }>;
    total: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params.category) queryParams.append('category', params.category);
    if (params.search) queryParams.append('search', params.search);

    return apiClient.get(`${this.BASE_PATH}/knowledge-base?${queryParams.toString()}`);
  }
}

// Export singleton instance
export const systemSupportService = new SystemSupportService();
export default systemSupportService;
