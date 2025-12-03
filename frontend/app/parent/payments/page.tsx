/**
 * Parent Payments Page
 * 
 * Backend Integration:
 * - Payments data: GET /api/payments (backend/src/controllers/paymentController.ts)
 * - Payment stats: GET /api/payments/stats/overview (backend/src/controllers/paymentController.ts)
 */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreditCard, DollarSign, Calendar, Download, ArrowUpRight, ArrowDownLeft, FileText, Loader2, AlertCircle } from "lucide-react"
import { parentService, type ParentPayment } from "@/lib/services/parentService"

// Helper to format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

// Helper to format date
function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  } catch {
    return dateStr
  }
}

// Get status badge class
function getStatusClass(statusCode: string | undefined): string {
  switch (statusCode?.toUpperCase()) {
    case 'COMPLETED':
      return 'bg-green-500/20 text-green-600'
    case 'PENDING':
      return 'bg-yellow-500/20 text-yellow-600'
    case 'FAILED':
      return 'bg-red-500/20 text-red-600'
    case 'REFUNDED':
      return 'bg-blue-500/20 text-blue-600'
    default:
      return 'bg-gray-500/20 text-gray-600'
  }
}

export default function PaymentsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [payments, setPayments] = useState<ParentPayment[]>([])
  const [stats, setStats] = useState({
    totalSpent: 0,
    thisMonth: 0,
    transactionCount: 0,
    pendingAmount: 0
  })

  // Fetch payments from backend
  useEffect(() => {
    const loadPayments = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Fetch payments - Backend source: GET /api/payments (backend/src/controllers/paymentController.ts)
        const [paymentsData, statsData] = await Promise.all([
          parentService.getPayments({ limit: 50 }),
          parentService.getPaymentStats('month')
        ])
        
        setPayments(paymentsData || [])
        
        // Set stats from backend
        setStats({
          totalSpent: statsData.completedAmount || 0,
          thisMonth: statsData.totalAmount || 0,
          transactionCount: statsData.totalPayments || 0,
          pendingAmount: statsData.pendingAmount || 0
        })
      } catch (err) {
        console.error('Error loading payments:', err)
        setError('Unable to load payments data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    loadPayments()
  }, [])

  const paymentStats = [
    {
      title: "Total Spent",
      value: formatCurrency(stats.totalSpent),
      subtitle: "All time",
      icon: DollarSign,
      color: "from-green-500 to-green-600",
    },
    {
      title: "This Month",
      value: formatCurrency(stats.thisMonth),
      subtitle: `${stats.transactionCount} transactions`,
      icon: Calendar,
      color: "from-blue-500 to-blue-600",
    },
    { 
      title: "Transactions", 
      value: stats.transactionCount.toString(), 
      subtitle: "Total", 
      icon: CreditCard, 
      color: "from-pink-500 to-rose-500" 
    },
    { 
      title: "Pending", 
      value: formatCurrency(stats.pendingAmount), 
      subtitle: stats.pendingAmount > 0 ? "Due" : "No dues", 
      icon: FileText, 
      color: "from-yellow-500 to-orange-500" 
    },
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Payments</h1>
            <p className="text-muted-foreground">Manage payments, subscriptions, and invoices</p>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-pink-500 mb-4" />
            <p className="text-muted-foreground">Loading payments...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Payments</h1>
            <p className="text-muted-foreground">Manage payments, subscriptions, and invoices</p>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto text-red-500 mb-4" />
            <p className="text-red-500">{error}</p>
            <Button 
              className="mt-4" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground">Manage payments, subscriptions, and invoices</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
            <CreditCard className="w-4 h-4 mr-2" />
            Add Payment Method
          </Button>
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
                  <p className="text-sm text-pink-500 mt-1">{stat.subtitle}</p>
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
        {/* Transactions */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
            <Link href="/parent/payments">
              <Button variant="ghost" size="sm" className="text-pink-500">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">No Transactions Yet</h3>
                <p className="text-muted-foreground">Your payment history will appear here.</p>
              </div>
            ) : (
              <div className="rounded-xl overflow-hidden border border-white/20">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-white/10 hover:bg-white/10">
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.slice(0, 10).map((payment) => (
                      <TableRow key={payment.id} className="hover:bg-white/10">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                payment.status?.code === 'REFUNDED' ? "bg-green-500/20" : "bg-pink-500/20"
                              }`}
                            >
                              {payment.status?.code === 'REFUNDED' ? (
                                <ArrowDownLeft className="w-4 h-4 text-green-500" />
                              ) : (
                                <ArrowUpRight className="w-4 h-4 text-pink-500" />
                              )}
                            </div>
                            <span className="font-medium">
                              {payment.description || `Payment #${payment.id}`}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-white/20">
                            {payment.paymentType || 'Payment'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(payment.createdAt)}
                        </TableCell>
                        <TableCell className={`font-medium ${payment.status?.code === 'REFUNDED' ? "text-green-500" : ""}`}>
                          {payment.status?.code === 'REFUNDED' ? '-' : ''}
                          {formatCurrency(payment.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusClass(payment.status?.code)}>
                            {payment.status?.name || payment.status?.code || 'Pending'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscriptions/Quick Info */}
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl glass-subtle">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Total Spent</span>
                <Badge className="bg-green-500/20 text-green-600">All Time</Badge>
              </div>
              <p className="text-2xl font-bold text-pink-500">{formatCurrency(stats.totalSpent)}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {payments.length} total transactions
              </p>
            </div>

            <div className="p-4 rounded-xl glass-subtle">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">This Month</span>
                <Badge className="bg-blue-500/20 text-blue-600">Current</Badge>
              </div>
              <p className="text-2xl font-bold">{formatCurrency(stats.thisMonth)}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {stats.transactionCount} transactions
              </p>
            </div>

            {stats.pendingAmount > 0 && (
              <div className="p-4 rounded-xl glass-subtle border border-yellow-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Pending Payments</span>
                  <Badge className="bg-yellow-500/20 text-yellow-600">Due</Badge>
                </div>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.pendingAmount)}</p>
                <Link href="/parent/payments">
                  <Button variant="outline" size="sm" className="w-full mt-3 glass-subtle border-white/20 bg-transparent">
                    View Pending
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
