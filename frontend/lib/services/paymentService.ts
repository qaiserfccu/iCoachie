import { apiClient } from '../api'

// Types
export interface Payment {
  id: string
  studentId: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod: 'card' | 'bank_transfer' | 'cash' | 'other'
  description?: string
  reference?: string
  sessionId?: string
  tenantId: string
  createdAt: string
  updatedAt: string
}

export interface CreatePaymentData {
  studentId: string
  amount: number
  currency?: string
  paymentMethod: 'card' | 'bank_transfer' | 'cash' | 'other'
  description?: string
  sessionId?: string
}

export interface PaymentStats {
  period: string
  totalPayments: number
  totalAmount: number
  completedAmount: number
  pendingAmount: number
  completionRate: number
  typeBreakdown: Record<string, number>
  statusBreakdown: Record<string, number>
}

class PaymentService {
  private readonly baseUrl = '/payments'

  // Get all payments for current tenant
  async getPayments(studentId?: string, status?: string): Promise<Payment[]> {
    const params: any = {}
    if (studentId) params.studentId = studentId
    if (status) params.status = status
    return apiClient.get<Payment[]>(this.baseUrl, { params })
  }

  // Get payment by ID
  async getPayment(id: string): Promise<Payment> {
    return apiClient.get<Payment>(`${this.baseUrl}/${id}`)
  }

  // Create new payment
  async createPayment(data: CreatePaymentData): Promise<Payment> {
    return apiClient.post<Payment>(this.baseUrl, data)
  }

  // Update payment status
  async updatePaymentStatus(id: string, status: 'pending' | 'completed' | 'failed' | 'refunded'): Promise<Payment> {
    return apiClient.patch<Payment>(`${this.baseUrl}/${id}/status`, { status })
  }

  // Process refund
  async refundPayment(id: string, amount?: number): Promise<Payment> {
    return apiClient.post<Payment>(`${this.baseUrl}/${id}/refund`, { amount })
  }

  // Get payments for a student
  async getStudentPayments(studentId: string): Promise<Payment[]> {
    return apiClient.get<Payment[]>(`${this.baseUrl}/student/${studentId}`)
  }

  // Get payment statistics
  async getPaymentStats(period?: { startDate: string, endDate: string }): Promise<PaymentStats> {
    const params: any = {}
    if (period) {
      params.startDate = period.startDate
      params.endDate = period.endDate
    }
    return apiClient.get<PaymentStats>(`${this.baseUrl}/stats/overview`, { params })
  }

  // Get revenue by club
  async getClubRevenue(clubId: string, period?: { startDate: string, endDate: string }): Promise<any> {
    const params: any = { clubId }
    if (period) {
      params.startDate = period.startDate
      params.endDate = period.endDate
    }
    return apiClient.get(`${this.baseUrl}/revenue/club`, { params })
  }

  // Get outstanding payments (pending)
  async getOutstandingPayments(): Promise<Payment[]> {
    return apiClient.get<Payment[]>(`${this.baseUrl}/outstanding`)
  }

  // Send payment reminder
  async sendPaymentReminder(paymentId: string): Promise<void> {
    return apiClient.post(`${this.baseUrl}/${paymentId}/reminder`)
  }

  // Create Stripe payment intent
  async createPaymentIntent(data: {
    amount: number
    currency?: string
    description?: string
    metadata?: Record<string, any>
  }): Promise<{
    paymentIntent: {
      id: string
      client_secret: string
      amount: number
      currency: string
      status: string
    }
    payment: Payment
  }> {
    return apiClient.post(`${this.baseUrl}/create-payment-intent`, data)
  }
}

export const paymentService = new PaymentService()
export default paymentService