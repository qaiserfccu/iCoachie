"use client"

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

const stats = [
  { title: "Total Revenue", value: "$48,250", change: "+12%", icon: DollarSign, color: "from-green-500 to-green-600" },
  { title: "This Month", value: "$12,400", change: "+8%", icon: TrendingUp, color: "from-blue-500 to-blue-600" },
  { title: "Pending", value: "$2,150", change: "8 invoices", icon: Clock, color: "from-yellow-500 to-orange-500" },
  { title: "Refunds", value: "$450", change: "3 requests", icon: ArrowDownLeft, color: "from-red-500 to-red-600" },
]

const transactions = [
  {
    id: "TXN001",
    member: "Emma Davis",
    type: "Membership",
    amount: "$200",
    date: "Nov 28, 2024",
    method: "Credit Card",
    status: "completed",
  },
  {
    id: "TXN002",
    member: "Jack Wilson",
    type: "Session Fee",
    amount: "$50",
    date: "Nov 28, 2024",
    method: "PayPal",
    status: "completed",
  },
  {
    id: "TXN003",
    member: "Sophie Miller",
    type: "Membership",
    amount: "$150",
    date: "Nov 27, 2024",
    method: "Bank Transfer",
    status: "pending",
  },
  {
    id: "TXN004",
    member: "Lucas Brown",
    type: "Equipment",
    amount: "$75",
    date: "Nov 26, 2024",
    method: "Credit Card",
    status: "completed",
  },
  {
    id: "TXN005",
    member: "Olivia Johnson",
    type: "Refund",
    amount: "-$100",
    date: "Nov 25, 2024",
    method: "Credit Card",
    status: "refunded",
  },
]

export default function PaymentsPage() {
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
        {stats.map((stat) => (
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
                {transactions.map((txn) => (
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
