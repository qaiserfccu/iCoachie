import { apiClient } from "@/lib/api/client"
import { paymentService } from "./paymentService"
import { sessionService } from "./sessionService"

export interface EarningsStats {
  totalEarnings: number
  thisMonth: number
  pendingPayout: number
  avgPerSession: number
  monthlyChange: string
  pendingChange: string
  avgChange: string
}

export interface Transaction {
  id: string
  client: string
  type: string
  amount: number
  date: string
  status: "completed" | "pending" | "processed"
}

export interface MonthlyEarnings {
  month: string
  sessions: number
  earnings: number
  payout: number
}

class FreelancerEarningsService {
  async getEarningsStats(): Promise<EarningsStats> {
    try {
      const payments = await paymentService.getPayments()
      const sessions = await sessionService.getSessions()

      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()

      // Calculate total earnings
      const totalEarnings = payments
        .filter(p => p.status === 'completed')
        .reduce((sum, payment) => sum + payment.amount, 0)

      // Calculate this month's earnings
      const thisMonthEarnings = payments
        .filter(p => {
          const paymentDate = new Date(p.createdAt)
          return paymentDate.getMonth() === currentMonth &&
                 paymentDate.getFullYear() === currentYear &&
                 p.status === 'completed'
        })
        .reduce((sum, payment) => sum + payment.amount, 0)

      // Calculate pending payout (assuming 10% platform fee)
      const pendingPayments = payments
        .filter(p => p.status === 'pending')
        .reduce((sum, payment) => sum + payment.amount, 0)
      const pendingPayout = pendingPayments * 0.9 // 90% after platform fee

      // Calculate average per session
      const completedSessions = sessions.filter(s => s.status === 'completed').length
      const avgPerSession = completedSessions > 0 ? totalEarnings / completedSessions : 0

      // Calculate monthly change (compare with last month)
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
      const lastMonthEarnings = payments
        .filter(p => {
          const paymentDate = new Date(p.createdAt)
          return paymentDate.getMonth() === lastMonth &&
                 paymentDate.getFullYear() === lastMonthYear &&
                 p.status === 'completed'
        })
        .reduce((sum, payment) => sum + payment.amount, 0)

      const monthlyChange = lastMonthEarnings > 0
        ? ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings * 100).toFixed(0) + '%'
        : '+0%'

      // Calculate average change (compare with last 3 months average)
      const threeMonthsAgo = new Date(now)
      threeMonthsAgo.setMonth(now.getMonth() - 3)
      const recentSessions = sessions.filter(s => new Date(s.startTime) >= threeMonthsAgo)
      const recentEarnings = payments
        .filter(p => new Date(p.createdAt) >= threeMonthsAgo && p.status === 'completed')
        .reduce((sum, payment) => sum + payment.amount, 0)
      const recentAvg = recentSessions.length > 0 ? recentEarnings / recentSessions.length : 0
      const avgChange = recentAvg > 0 ? `+$${Math.round(avgPerSession - recentAvg)}` : '+$0'

      return {
        totalEarnings,
        thisMonth: thisMonthEarnings,
        pendingPayout,
        avgPerSession: Math.round(avgPerSession),
        monthlyChange: monthlyChange.startsWith('-') ? monthlyChange : `+${monthlyChange}`,
        pendingChange: `Next: ${this.getNextPayoutDate()}`,
        avgChange
      }
    } catch (error) {
      console.error('Error fetching earnings stats:', error)
      throw error
    }
  }

  async getRecentTransactions(): Promise<Transaction[]> {
    try {
      const payments = await paymentService.getPayments()
      const sessions = await sessionService.getSessions()

      // Create a map of session IDs to session details for transaction types
      const sessionMap = new Map(sessions.map(s => [s.id, s]))

      const transactions: Transaction[] = payments
        .slice(0, 10) // Get last 10 transactions
        .map(payment => {
          const session = sessionMap.get(payment.sessionId)
          const isPayout = payment.amount < 0

          return {
            id: payment.id,
            client: isPayout ? "Platform Payout" : (session?.student?.name || "Unknown Client"),
            type: isPayout ? "Withdrawal" : (session?.type || "Session"),
            amount: payment.amount,
            date: this.formatDate(new Date(payment.createdAt)),
            status: payment.status as "completed" | "pending" | "processed"
          }
        })

      return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } catch (error) {
      console.error('Error fetching recent transactions:', error)
      throw error
    }
  }

  async getMonthlyEarnings(): Promise<MonthlyEarnings[]> {
    try {
      const payments = await paymentService.getPayments()
      const sessions = await sessionService.getSessions()

      const monthlyData = new Map<string, { sessions: number, earnings: number }>()

      // Process payments by month
      payments
        .filter(p => p.status === 'completed')
        .forEach(payment => {
          const date = new Date(payment.createdAt)
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })

          if (!monthlyData.has(monthKey)) {
            monthlyData.set(monthKey, { sessions: 0, earnings: 0 })
          }
          const data = monthlyData.get(monthKey)!
          data.earnings += payment.amount
        })

      // Process sessions by month
      sessions
        .filter(s => s.status === 'completed')
        .forEach(session => {
          const date = new Date(session.startTime)
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })

          if (!monthlyData.has(monthKey)) {
            monthlyData.set(monthKey, { sessions: 0, earnings: 0 })
          }
          const data = monthlyData.get(monthKey)!
          data.sessions += 1
        })

      // Convert to array and calculate payouts (90% after platform fee)
      const result: MonthlyEarnings[] = Array.from(monthlyData.entries())
        .map(([monthKey, data]) => ({
          month: new Date(monthKey + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
          sessions: data.sessions,
          earnings: data.earnings,
          payout: Math.round(data.earnings * 0.9) // 90% payout
        }))
        .sort((a, b) => new Date(b.month + ' 1, 2000').getTime() - new Date(a.month + ' 1, 2000').getTime())
        .slice(0, 4) // Last 4 months

      return result
    } catch (error) {
      console.error('Error fetching monthly earnings:', error)
      throw error
    }
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  private getNextPayoutDate(): string {
    const now = new Date()
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    return nextMonth.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}

export const freelancerEarningsService = new FreelancerEarningsService()