"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Download, CreditCard, TrendingUp, DollarSign, Eye, Loader2, AlertTriangle } from "lucide-react"
import { adminService, type AdminTransaction, type TransactionStats } from "@/lib/services/adminService"

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [transactions, setTransactions] = useState<AdminTransaction[]>([])
  const [stats, setStats] = useState<TransactionStats>({ totalRevenue: '$0', transactionCount: '0', avgTransaction: '$0' })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTransactions()
  }, [searchQuery])

  async function fetchTransactions() {
    setIsLoading(true)
    setError(null)
    try {
      const response = await adminService.getTransactions({ search: searchQuery || undefined })
      setTransactions(response.transactions)
      setStats(response.stats)
    } catch (err) {
      console.error('Error fetching transactions:', err)
      setError('Failed to load transactions. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-destructive" />
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => fetchTransactions()}>Retry</Button>
        </div>
      </div>
    )
  }

  const displayStats = [
    { label: "Total Revenue", value: stats.totalRevenue, change: "+12.5%", icon: DollarSign },
    { label: "Transactions", value: stats.transactionCount, change: "+8.2%", icon: CreditCard },
    { label: "Avg. Transaction", value: stats.avgTransaction, change: "+3.1%", icon: TrendingUp },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments & Transactions</h1>
          <p className="text-muted-foreground">View and manage all platform transactions</p>
        </div>
        <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="glass-card border-white/20">
              <CardContent className="p-4 flex items-center justify-center min-h-[80px]">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ))
        ) : (
          displayStats.map((stat) => (
            <Card key={stat.label} className="glass-card border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <span className="text-green-500 text-sm">{stat.change}</span>
                  </div>
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 glass-input rounded-xl px-4 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0 p-0 h-auto"
          />
        </div>
        <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden border border-white/20">
              <Table>
                <TableHeader>
                  <TableRow className="bg-white/10 hover:bg-white/10">
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((txn) => (
                      <TableRow key={txn.id} className="hover:bg-white/10">
                        <TableCell className="font-mono text-sm">{txn.id}</TableCell>
                        <TableCell>{txn.user}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{txn.type}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{txn.amount}</TableCell>
                        <TableCell>
                          <Badge className={
                            txn.status === "Completed" ? "bg-green-500/20 text-green-600" :
                            txn.status === "Pending" ? "bg-yellow-500/20 text-yellow-600" :
                            "bg-red-500/20 text-red-600"
                          }>
                            {txn.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{txn.date}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
