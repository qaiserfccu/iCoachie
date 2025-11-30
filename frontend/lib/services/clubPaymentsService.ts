import { paymentService, studentService, clubDashboardService } from './index'

export interface PaymentTransaction {
  id: string
  member: string
  type: string
  amount: string
  date: string
  method: string
  status: 'completed' | 'pending' | 'failed' | 'refunded'
}

export interface PaymentStats {
  totalRevenue: number
  thisMonthRevenue: number
  pendingAmount: number
  refundAmount: number
  totalRevenueChange: string
  thisMonthChange: string
  pendingCount: number
  refundCount: number
}

class ClubPaymentsService {
  // Get all payment transactions with member names
  async getPaymentTransactions(): Promise<PaymentTransaction[]> {
    try {
      // Get all payments
      const payments = await paymentService.getPayments()

      // Get all students for name lookup
      const students = await studentService.getStudents()

      // Create student map for quick lookup
      const studentMap = new Map(students.map(student => [student.id, `${student.firstName} ${student.lastName}`]))

      // Convert payments to transaction format
      const transactions = await Promise.all(
        payments.map(async (payment) => {
          const memberName = studentMap.get(payment.studentId) || 'Unknown Student'

          return {
            id: payment.id,
            member: memberName,
            type: this.getPaymentType(payment),
            amount: payment.amount < 0 ? `-$${Math.abs(payment.amount)}` : `$${payment.amount}`,
            date: this.formatDate(payment.createdAt),
            method: this.formatPaymentMethod(payment.paymentMethod),
            status: payment.status
          }
        })
      )

      // Sort by date (newest first)
      return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } catch (error) {
      console.error('Error fetching payment transactions:', error)
      return []
    }
  }

  // Get payment statistics
  async getPaymentStats(): Promise<PaymentStats> {
    try {
      const now = new Date()

      // Get current month stats
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

      const thisMonthStats = await paymentService.getPaymentStats({
        startDate: startOfMonth.toISOString(),
        endDate: endOfMonth.toISOString()
      })

      // Get previous month stats for comparison
      const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

      const prevMonthStats = await paymentService.getPaymentStats({
        startDate: prevMonthStart.toISOString(),
        endDate: prevMonthEnd.toISOString()
      })

      // Get all-time stats
      const allTimeStats = await paymentService.getPaymentStats()

      // Calculate changes
      const thisMonthChange = prevMonthStats.totalRevenue > 0
        ? `${Math.round(((thisMonthStats.totalRevenue - prevMonthStats.totalRevenue) / prevMonthStats.totalRevenue) * 100)}%`
        : '+0%'

      // For total revenue change, compare with last month
      const totalRevenueChange = prevMonthStats.totalRevenue > 0
        ? `${Math.round(((allTimeStats.totalRevenue - prevMonthStats.totalRevenue) / prevMonthStats.totalRevenue) * 100)}%`
        : '+0%'

      // Get pending payments
      const pendingPayments = await paymentService.getOutstandingPayments()
      const pendingAmount = pendingPayments.reduce((sum, payment) => sum + payment.amount, 0)

      // Get refunded payments for this month
      const refundedPayments = await paymentService.getPayments(undefined, 'refunded')
      const thisMonthRefunds = refundedPayments.filter(payment => {
        const paymentDate = new Date(payment.createdAt)
        return paymentDate >= startOfMonth && paymentDate <= endOfMonth
      })
      const refundAmount = thisMonthRefunds.reduce((sum, payment) => sum + Math.abs(payment.amount), 0)

      return {
        totalRevenue: allTimeStats.totalRevenue,
        thisMonthRevenue: thisMonthStats.totalRevenue,
        pendingAmount,
        refundAmount,
        totalRevenueChange: totalRevenueChange.startsWith('-') ? totalRevenueChange : `+${totalRevenueChange}`,
        thisMonthChange: thisMonthChange.startsWith('-') ? thisMonthChange : `+${thisMonthChange}`,
        pendingCount: pendingPayments.length,
        refundCount: thisMonthRefunds.length
      }
    } catch (error) {
      console.error('Error fetching payment stats:', error)
      return {
        totalRevenue: 0,
        thisMonthRevenue: 0,
        pendingAmount: 0,
        refundAmount: 0,
        totalRevenueChange: '+0%',
        thisMonthChange: '+0%',
        pendingCount: 0,
        refundCount: 0
      }
    }
  }

  private getPaymentType(payment: any): string {
    if (payment.description) {
      const desc = payment.description.toLowerCase()
      if (desc.includes('membership')) return 'Membership'
      if (desc.includes('session')) return 'Session Fee'
      if (desc.includes('equipment')) return 'Equipment'
      if (desc.includes('refund')) return 'Refund'
      return payment.description
    }
    return payment.sessionId ? 'Session Fee' : 'Payment'
  }

  private formatPaymentMethod(method: string): string {
    switch (method) {
      case 'card': return 'Credit Card'
      case 'bank_transfer': return 'Bank Transfer'
      case 'cash': return 'Cash'
      case 'other': return 'Other'
      default: return method.charAt(0).toUpperCase() + method.slice(1)
    }
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
}

export const clubPaymentsService = new ClubPaymentsService()
export default clubPaymentsService