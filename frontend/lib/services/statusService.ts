import { apiClient } from '../api'

export interface Status {
  id: number
  code: string
  name: string
  description?: string
  isActive: boolean
  sortOrder: number
}

export interface UserStatus extends Status {}
export interface SessionStatus extends Status {}
export interface AttendanceStatus extends Status {}
export interface PaymentStatus extends Status {}
export interface BookingStatus extends Status {}

class StatusService {
  // Get all user statuses
  async getUserStatuses(): Promise<UserStatus[]> {
    try {
      const response = await apiClient.get<UserStatus[]>('/statuses/user')
      return response
    } catch (error) {
      throw new Error('Failed to fetch user statuses')
    }
  }

  // Get all session statuses
  async getSessionStatuses(): Promise<SessionStatus[]> {
    try {
      const response = await apiClient.get<SessionStatus[]>('/statuses/session')
      return response
    } catch (error) {
      throw new Error('Failed to fetch session statuses')
    }
  }

  // Get all attendance statuses
  async getAttendanceStatuses(): Promise<AttendanceStatus[]> {
    try {
      const response = await apiClient.get<AttendanceStatus[]>('/statuses/attendance')
      return response
    } catch (error) {
      throw new Error('Failed to fetch attendance statuses')
    }
  }

  // Get all payment statuses
  async getPaymentStatuses(): Promise<PaymentStatus[]> {
    try {
      const response = await apiClient.get<PaymentStatus[]>('/statuses/payment')
      return response
    } catch (error) {
      throw new Error('Failed to fetch payment statuses')
    }
  }

  // Get all booking statuses
  async getBookingStatuses(): Promise<BookingStatus[]> {
    try {
      const response = await apiClient.get<BookingStatus[]>('/statuses/booking')
      return response
    } catch (error) {
      throw new Error('Failed to fetch booking statuses')
    }
  }
}

// Export singleton instance
const statusService = new StatusService()
export default statusService
