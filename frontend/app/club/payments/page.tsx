"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  ArrowDownLeft,
  Search,
  Filter,
  Download,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { clubAdminService, type ClubPaymentStats, type ClubTransaction } from "@/lib/services"

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<ClubPaymentStats | null>(null)
  const [transactions, setTransactions] = useState<ClubTransaction[]>([])

  useEffect(() => {
    loadPaymentsData()
  }, [])

  async function loadPaymentsData() {
    try {
      setLoading(true)
      setError(null)
      
      const [statsData, transactionsData] = await Promise.all([
        clubAdminService.getPaymentStats(),
        clubAdminService.getTransactions({ pageSize: 50 })
      ])
      
      setStats(statsData)
      setTransactions(transactionsData.data)
    } catch (err) {
      console.error('Error loading payments data:', err)
      setError('Failed to load payments data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(amount))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const filteredTransactions = transactions.filter(txn => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return txn.studentName.toLowerCase().includes(query) || 
           txn.type.toLowerCase().includes(query) ||
           txn.id.toString().includes(query)
  })

  const paymentStats = stats ? [
    { title: "Total Revenue", value: formatCurrency(stats.totalRevenue), change: stats.revenueChange, icon: DollarSign, color: "from-green-500 to-green-600" },
    { title: "This Month", value: formatCurrency(stats.monthlyRevenue), change: stats.monthlyChange, icon: TrendingUp, color: "from-blue-500 to-blue-600" },
    { title: "Pending", value: formatCurrency(stats.pendingAmount), change: `${stats.pendingCount} invoices`, icon: Clock, color: "from-yellow-500 to-orange-500" },
    { title: "Refunds", value: formatCurrency(stats.refundAmount), change: `${stats.refundCount} requests`, icon: ArrowDownLeft, color: "from-red-500 to-red-600" },
  ] : []

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={loadPaymentsData}>Try Again</Button>
      </div>
    )
  }

import clubPaymentsService, { PaymentTransaction, PaymentStats } from "@/lib/services/clubPaymentsService"

// Stats configuration for rendering
const statsConfig = [
  { key: 'totalRevenue', title: 'Total Revenue', changeKey: 'totalRevenueChange', icon: DollarSign, color: 'from-green-500 to-green-600' },
  { key: 'thisMonthRevenue', title: 'This Month', changeKey: 'thisMonthChange', icon: TrendingUp, color: 'from-blue-500 to-blue-600' },
  { key: 'pendingAmount', title: 'Pending', changeKey: 'pendingCount', icon: Clock, color: 'from-yellow-500 to-orange-500' },
  { key: 'refundAmount', title: 'Refunds', changeKey: 'refundCount', icon: ArrowDownLeft, color: 'from-red-500 to-red-600' },
]

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
  const [stats, setStats] = useState<PaymentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPaymentsData() {
      try {
        setLoading(true)
        setError(null)

        const [transactionsData, statsData] = await Promise.all([
          clubPaymentsService.getPaymentTransactions(),
          clubPaymentsService.getPaymentStats(),
        ])

        setTransactions(transactionsData)
        setStats(statsData)
      } catch (err) {
        console.error('Failed to fetch payments data:', err)
        setError('Failed to load payments data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentsData()
  }, [])

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter(txn =>
    txn.member.toLowerCase().includes(searchQuery.toLowerCase()) ||
    txn.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    txn.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Format stat values
  const formatStatValue = (key: string, value: number | undefined): string => {
    if (value === undefined) return '$0'
    return `$${value.toLocaleString()}`
  }

  // Get stat change display
  const getStatChange = (changeKey: string): string => {
    if (!stats) return ''
    const value = stats[changeKey as keyof PaymentStats]
    if (typeof value === 'number') {
      if (changeKey.includes('Count')) {
        return `${value} ${changeKey.replace('Count', '').toLowerCase()}s`
      }
      return value.toString()
    }
    return value?.toString() || ''
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading payments data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground">Track revenue and manage transactions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Link href="/club/payments/invoices">
            <Button className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {paymentStats.map((stat) => (
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
        {statsConfig.map((statConfig) => {
          const value = stats ? stats[statConfig.key as keyof PaymentStats] : 0
          const change = getStatChange(statConfig.changeKey)
          
          return (
            <Card key={statConfig.title} className="glass-card border-white/20 hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{statConfig.title}</p>
                    <p className="text-2xl font-bold mt-1">{formatStatValue(statConfig.key, typeof value === 'number' ? value : 0)}</p>
                    {change && <p className="text-sm text-green-500 mt-1">{change}</p>}
                  </div>
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${statConfig.color} flex items-center justify-center`}
                  >
                    <statConfig.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Transactions Table */}
      <Card className="glass-card border-white/20">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Recent Transactions ({filteredTransactions.length})</CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 glass-input rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent focus-visible:ring-0 p-0 h-auto w-48"
                />
              </div>
              <Button variant="outline" size="icon" className="glass-subtle border-white/20 bg-transparent">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl overflow-hidden border border-white/20">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'No transactions found matching your search.' : 'No transactions found.'}
              </div>
            ) : (
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No transactions found</p>
              <p className="text-sm mt-1">
                {searchQuery ? 'Try adjusting your search query' : 'Transactions will appear here once payments are processed'}
              </p>
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden border border-white/20">
              <Table>
                <TableHeader>
                  <TableRow className="bg-white/10 hover:bg-white/10">
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((txn) => (
                    <TableRow key={txn.id} className="hover:bg-white/10">
                      <TableCell className="font-mono text-sm">TXN{txn.id.toString().padStart(3, '0')}</TableCell>
                      <TableCell>{txn.studentName}</TableCell>
                      <TableCell>{txn.type}</TableCell>
                      <TableCell
                        className={txn.status === 'refunded' ? "text-red-500 font-medium" : "text-green-500 font-medium"}
                      >
                        {txn.status === 'refunded' ? '-' : ''}{formatCurrency(txn.amount)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(txn.date)}</TableCell>
                      <TableCell className="font-mono text-sm">{txn.id}</TableCell>
                      <TableCell>{txn.member}</TableCell>
                      <TableCell>{txn.type}</TableCell>
                      <TableCell
                        className={txn.amount.startsWith("-") ? "text-red-500 font-medium" : "text-green-500 font-medium"}
                      >
                        {txn.amount}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{txn.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-muted-foreground" />
                          {txn.method}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            txn.status === "completed"
                              ? "bg-green-500/20 text-green-600"
                              : txn.status === "pending"
                                ? "bg-yellow-500/20 text-yellow-600"
                                : "bg-red-500/20 text-red-600"
                          }
                        >
                          {txn.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {txn.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                          {txn.status === "refunded" && <XCircle className="w-3 h-3 mr-1" />}
                          {txn.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
