"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search, Filter, Download, CreditCard, DollarSign,
  ArrowUpRight, ArrowDownRight, RefreshCw, CheckCircle, Clock, XCircle
} from "lucide-react"
import { useState } from "react"

const payments = [
  { id: "PAY-001", user: "John Smith", amount: 250.00, method: "credit_card", status: "completed", date: "2024-01-15 14:32", invoice: "INV-2024-001" },
  { id: "PAY-002", user: "Elite Sports Academy", amount: 1500.00, method: "bank_transfer", status: "completed", date: "2024-01-14 10:15", invoice: "INV-2024-002" },
  { id: "PAY-003", user: "Sarah Wilson", amount: 175.00, method: "debit_card", status: "pending", date: "2024-01-14 09:45", invoice: "INV-2024-003" },
  { id: "PAY-004", user: "Mike Johnson", amount: 350.00, method: "credit_card", status: "completed", date: "2024-01-13 16:20", invoice: "INV-2024-004" },
  { id: "PAY-005", user: "Lisa Garcia", amount: 450.00, method: "credit_card", status: "failed", date: "2024-01-13 11:30", invoice: "INV-2024-005" },
  { id: "PAY-006", user: "David Brown", amount: 125.00, method: "cash", status: "completed", date: "2024-01-12 15:00", invoice: null },
  { id: "PAY-007", user: "Emma Davis", amount: 275.00, method: "credit_card", status: "refunded", date: "2024-01-12 09:10", invoice: "INV-2024-006" },
  { id: "PAY-008", user: "James Miller", amount: 500.00, method: "bank_transfer", status: "completed", date: "2024-01-11 14:45", invoice: "INV-2024-007" },
]

const statusConfig = {
  completed: { color: "bg-green-500/20 text-green-500", icon: CheckCircle },
  pending: { color: "bg-yellow-500/20 text-yellow-500", icon: Clock },
  failed: { color: "bg-red-500/20 text-red-500", icon: XCircle },
  refunded: { color: "bg-purple-500/20 text-purple-500", icon: RefreshCw },
}

const methodLabels = {
  credit_card: "Credit Card",
  debit_card: "Debit Card",
  bank_transfer: "Bank Transfer",
  cash: "Cash",
  check: "Check",
}

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const filteredPayments = payments.filter(pay => {
    const matchesSearch = pay.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pay.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !selectedStatus || pay.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const totalCompleted = payments.filter(p => p.status === "completed").reduce((sum, p) => sum + p.amount, 0)
  const totalPending = payments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0)
  const totalRefunded = payments.filter(p => p.status === "refunded").reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground">Track and manage all payment transactions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="glass-subtle border-white/20">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-emerald-500 to-green-600 text-white">
            <DollarSign className="w-4 h-4 mr-2" />
            Record Payment
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Received</p>
              <p className="text-2xl font-bold text-green-500">${totalCompleted.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <ArrowDownRight className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-yellow-500">${totalPending.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Refunded</p>
              <p className="text-2xl font-bold text-purple-500">${totalRefunded.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Transactions</p>
              <p className="text-2xl font-bold">{payments.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-card border-white/20">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
                className="pl-10 glass-subtle border-white/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {["all", "completed", "pending", "failed", "refunded"].map(status => (
                <Button
                  key={status}
                  variant={selectedStatus === (status === "all" ? null : status) ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(status === "all" ? null : status)}
                  className={selectedStatus === (status === "all" ? null : status) ? "bg-emerald-500" : "glass-subtle border-white/20"}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments List */}
      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Recent Payments ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredPayments.map((payment) => {
            const config = statusConfig[payment.status as keyof typeof statusConfig]
            const StatusIcon = config.icon
            return (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{payment.id}</p>
                      <Badge className={config.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {payment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{payment.user}</p>
                    <p className="text-xs text-muted-foreground">
                      {methodLabels[payment.method as keyof typeof methodLabels]} • {payment.date}
                      {payment.invoice && ` • ${payment.invoice}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${payment.status === "refunded" ? "text-purple-500" : payment.status === "failed" ? "text-red-500" : "text-foreground"}`}>
                    {payment.status === "refunded" && "-"}${payment.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
