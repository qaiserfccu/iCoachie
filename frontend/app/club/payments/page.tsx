"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
  Download,
  DollarSign,
  CreditCard,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  MoreVertical,
  Loader2,
  AlertCircle,
  FileText,
  RefreshCw,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import clubPaymentsService, { PaymentTransaction, PaymentStats } from "@/lib/services/clubPaymentsService"
import { useToast } from "@/components/ui/use-toast"

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
  const [stats, setStats] = useState<PaymentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchPaymentsData()
  }, [])

  async function fetchPaymentsData() {
    try {
      setLoading(true)
      setError(null)
      const [transactionsData, statsData] = await Promise.all([
        clubPaymentsService.getTransactions(),
        clubPaymentsService.getPaymentStats(),
      ])
      setTransactions(transactionsData)
      setStats(statsData)
    } catch (err) {
      console.error('Failed to fetch payments data:', err)
      setError('Failed to load payments. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading payments...</p>
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
          <Button onClick={fetchPaymentsData}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground">Track revenue and transactions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <DollarSign className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold mt-1">${stats?.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold mt-1">${stats?.thisMonthRevenue.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold mt-1 text-yellow-500">${stats?.pendingAmount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">{stats?.pendingCount} invoices</p>
              </div>
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Refunds</p>
                <p className="text-2xl font-bold mt-1 text-red-500">${stats?.refundAmount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">{stats?.refundCount} processed</p>
              </div>
              <div className="p-2 bg-red-500/10 rounded-lg">
                <RefreshCw className="w-5 h-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search transactions..." 
            className="pl-9 glass-subtle border-white/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className={`glass-subtle border-white/20 ${statusFilter === 'all' ? 'bg-white/10' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          <Button 
            variant="outline" 
            className={`glass-subtle border-white/20 ${statusFilter === 'completed' ? 'bg-white/10' : ''}`}
            onClick={() => setStatusFilter('completed')}
          >
            Completed
          </Button>
          <Button 
            variant="outline" 
            className={`glass-subtle border-white/20 ${statusFilter === 'pending' ? 'bg-white/10' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <Card className="glass-card border-white/20">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead>Transaction ID</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {transaction.id.slice(0, 8)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.memberName}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="font-bold">
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      transaction.status === 'completed' ? "text-green-500 border-green-500/30 bg-green-500/10" :
                      transaction.status === 'pending' ? "text-yellow-500 border-yellow-500/30 bg-yellow-500/10" :
                      "text-red-500 border-red-500/30 bg-red-500/10"
                    }>
                      {transaction.status === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {transaction.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                      {transaction.status === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-card border-white/20">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <FileText className="w-4 h-4 mr-2" />
                          View Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download Receipt
                        </DropdownMenuItem>
                        {transaction.status === 'pending' && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <CreditCard className="w-4 h-4 mr-2" />
                              Process Payment
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
