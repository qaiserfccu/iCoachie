"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, CreditCard, ArrowDownLeft, ArrowUpRight, Download } from "lucide-react"
import { useState, useEffect } from "react"
import { freelancerEarningsService, EarningsStats, Transaction, MonthlyEarnings } from "@/lib/services/freelancerEarningsService"
import { useLoading } from "@/lib/contexts/LoadingContext"
import { useError } from "@/lib/contexts/ErrorContext"

export default function EarningsPage() {
  const [earningsStats, setEarningsStats] = useState<EarningsStats | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [monthlyEarnings, setMonthlyEarnings] = useState<MonthlyEarnings[]>([])
  const { setLoading } = useLoading()
  const { setError } = useError()

  useEffect(() => {
    const loadEarningsData = async () => {
      try {
        setLoading(true)
        const [statsData, transactionsData, monthlyData] = await Promise.all([
          freelancerEarningsService.getEarningsStats(),
          freelancerEarningsService.getRecentTransactions(),
          freelancerEarningsService.getMonthlyEarnings()
        ])
        setEarningsStats(statsData)
        setTransactions(transactionsData)
        setMonthlyEarnings(monthlyData)
      } catch (error) {
        console.error('Error loading earnings data:', error)
        setError('Failed to load earnings data')
      } finally {
        setLoading(false)
      }
    }

    loadEarningsData()
  }, [setLoading, setError])

  const statsCards = earningsStats ? [
    {
      title: "Total Earnings",
      value: `$${earningsStats.totalEarnings.toLocaleString()}`,
      change: `+${earningsStats.monthlyChange}`,
      icon: DollarSign,
      color: "from-green-500 to-green-600"
    },
    {
      title: "This Month",
      value: `$${earningsStats.thisMonth.toLocaleString()}`,
      change: `+${earningsStats.monthlyChange}`,
      icon: TrendingUp,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Pending Payout",
      value: `$${earningsStats.pendingPayout.toLocaleString()}`,
      change: earningsStats.pendingChange,
      icon: CreditCard,
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Avg. Per Session",
      value: `$${earningsStats.avgPerSession}`,
      change: earningsStats.avgChange,
      icon: ArrowUpRight,
      color: "from-purple-500 to-purple-600",
    },
  ] : []

  if (!earningsStats) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Earnings</h1>
            <p className="text-muted-foreground">Track your income and payouts</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading earnings data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Earnings</h1>
          <p className="text-muted-foreground">Track your income and payouts</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <CreditCard className="w-4 h-4 mr-2" />
            Request Payout
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="glass-card border-white/20 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-sm text-green-500 mt-1">{stat.change}</p>
                </div>
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm" className="text-yellow-600">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No transactions yet</p>
              </div>
            ) : (
              transactions.map((txn) => (
                <div
                  key={txn.id}
                  className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        txn.amount < 0 ? "bg-red-500/20" : "bg-green-500/20"
                      }`}
                    >
                      {txn.amount < 0 ? (
                        <ArrowDownLeft className="w-5 h-5 text-red-500" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{txn.client}</p>
                      <p className="text-sm text-muted-foreground">{txn.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${txn.amount < 0 ? "text-red-500" : "text-green-500"}`}>
                      {txn.amount < 0 ? `-$${Math.abs(txn.amount)}` : `$${txn.amount}`}
                    </p>
                    <p className="text-xs text-muted-foreground">{txn.date}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Monthly Summary */}
        <Card className="glass-card border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {monthlyEarnings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No earnings data yet</p>
              </div>
            ) : (
              monthlyEarnings.map((month) => (
                <div key={month.month} className="p-4 rounded-xl glass-subtle">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{month.month}</span>
                    <Badge variant="outline" className="border-green-500/50 text-green-500">
                      {month.sessions} sessions
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Earnings</p>
                      <p className="font-medium text-green-500">${month.earnings.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Payout</p>
                      <p className="font-medium">${month.payout.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
