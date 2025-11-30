"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"
import { clubPaymentsService, PaymentTransaction, PaymentStats } from "@/lib/services"
import { useLoading } from "@/lib/contexts/LoadingContext"
import { useError } from "@/lib/contexts/ErrorContext"

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<PaymentTransaction[]>([])
  const [stats, setStats] = useState<PaymentStats | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { showLoading, hideLoading } = useLoading()
  const { showError } = useError()

  useEffect(() => {
    const fetchData = async () => {
      try {
        showLoading("Loading payment data...")

        // Fetch transactions and stats in parallel
        const [transactionsData, statsData] = await Promise.all([
          clubPaymentsService.getPaymentTransactions(),
          clubPaymentsService.getPaymentStats()
        ])

        setTransactions(transactionsData)
        setFilteredTransactions(transactionsData)
        setStats(statsData)
      } catch (error) {
        console.error("Error fetching payment data:", error)
        showError("Failed to load payment data. Please try again.")
      } finally {
        hideLoading()
      }
    }

    fetchData()
  }, [showLoading, hideLoading, showError])

  // Filter transactions based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTransactions(transactions)
    } else {
      const filtered = transactions.filter(
        (txn) =>
          txn.member.toLowerCase().includes(searchTerm.toLowerCase()) ||
          txn.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          txn.method.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredTransactions(filtered)
    }
  }, [searchTerm, transactions])

  const getDisplayStats = () => {
    if (!stats) return []

    return [
      {
        title: "Total Revenue",
        value: `$${stats.totalRevenue.toLocaleString()}`,
        change: stats.totalRevenueChange,
        icon: DollarSign,
        color: "from-green-500 to-green-600"
      },
      {
        title: "This Month",
        value: `$${stats.thisMonthRevenue.toLocaleString()}`,
        change: stats.thisMonthChange,
        icon: TrendingUp,
        color: "from-blue-500 to-blue-600"
      },
      {
        title: "Pending",
        value: `$${stats.pendingAmount.toLocaleString()}`,
        change: `${stats.pendingCount} invoices`,
        icon: Clock,
        color: "from-yellow-500 to-orange-500"
      },
      {
        title: "Refunds",
        value: `$${stats.refundAmount.toLocaleString()}`,
        change: `${stats.refundCount} requests`,
        icon: ArrowDownLeft,
        color: "from-red-500 to-red-600"
      },
    ]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-3 h-3 mr-1" />
      case "pending":
        return <Clock className="w-3 h-3 mr-1" />
      case "refunded":
        return <XCircle className="w-3 h-3 mr-1" />
      default:
        return null
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-600"
      case "pending":
        return "bg-yellow-500/20 text-yellow-600"
      case "refunded":
        return "bg-red-500/20 text-red-600"
      default:
        return "bg-gray-500/20 text-gray-600"
    }
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
          <Button className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {getDisplayStats().map((stat) => (
          <Card key={stat.title} className="glass-card border-white/20 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-500' : stat.change.startsWith('-') ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {stat.change}
                  </p>
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

      {/* Transactions Table */}
      <Card className="glass-card border-white/20">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Recent Transactions</CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 glass-input rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="border-0 bg-transparent focus-visible:ring-0 p-0 h-auto w-48"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No transactions found matching your search." : "No transactions found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((txn) => (
                    <TableRow key={txn.id} className="hover:bg-white/10">
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
                        <Badge className={getStatusBadgeClass(txn.status)}>
                          {getStatusIcon(txn.status)}
                          {txn.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
