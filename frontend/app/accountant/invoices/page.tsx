"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search, Filter, Plus, Download, Receipt, Clock,
  AlertTriangle, CheckCircle, ArrowRight, DollarSign
} from "lucide-react"
import { useState } from "react"

const invoices = [
  { id: "INV-2024-001", client: "John Smith", email: "john@email.com", amount: 250.00, status: "paid", dueDate: "2024-01-10", paidDate: "2024-01-08", items: 2 },
  { id: "INV-2024-002", client: "Elite Sports Academy", email: "billing@elite.com", amount: 1500.00, status: "pending", dueDate: "2024-01-20", paidDate: null, items: 5 },
  { id: "INV-2024-003", client: "Sarah Wilson", email: "sarah@email.com", amount: 175.00, status: "overdue", dueDate: "2024-01-05", paidDate: null, items: 1 },
  { id: "INV-2024-004", client: "Mike Johnson", email: "mike@email.com", amount: 350.00, status: "paid", dueDate: "2024-01-15", paidDate: "2024-01-14", items: 3 },
  { id: "INV-2024-005", client: "Lisa Garcia", email: "lisa@email.com", amount: 450.00, status: "pending", dueDate: "2024-01-25", paidDate: null, items: 2 },
  { id: "INV-2024-006", client: "David Brown", email: "david@email.com", amount: 125.00, status: "draft", dueDate: "2024-01-30", paidDate: null, items: 1 },
  { id: "INV-2024-007", client: "Emma Davis", email: "emma@email.com", amount: 275.00, status: "paid", dueDate: "2024-01-12", paidDate: "2024-01-11", items: 2 },
  { id: "INV-2024-008", client: "James Miller", email: "james@email.com", amount: 500.00, status: "overdue", dueDate: "2024-01-02", paidDate: null, items: 4 },
]

const statusConfig = {
  paid: { color: "bg-green-500/20 text-green-500", icon: CheckCircle },
  pending: { color: "bg-yellow-500/20 text-yellow-500", icon: Clock },
  overdue: { color: "bg-red-500/20 text-red-500", icon: AlertTriangle },
  draft: { color: "bg-gray-500/20 text-gray-500", icon: Receipt },
}

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !selectedStatus || inv.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const totalPending = invoices.filter(i => i.status === "pending").reduce((sum, i) => sum + i.amount, 0)
  const totalOverdue = invoices.filter(i => i.status === "overdue").reduce((sum, i) => sum + i.amount, 0)
  const totalPaid = invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Invoices</h1>
          <p className="text-muted-foreground">Manage and track all invoices</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="glass-subtle border-white/20">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-emerald-500 to-green-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Invoices</p>
            <p className="text-2xl font-bold">{invoices.length}</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending Amount</p>
            <p className="text-2xl font-bold text-yellow-500">${totalPending.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Overdue Amount</p>
            <p className="text-2xl font-bold text-red-500">${totalOverdue.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Paid This Month</p>
            <p className="text-2xl font-bold text-green-500">${totalPaid.toFixed(2)}</p>
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
                placeholder="Search invoices..."
                className="pl-10 glass-subtle border-white/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {["all", "paid", "pending", "overdue", "draft"].map(status => (
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

      {/* Invoices List */}
      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">All Invoices ({filteredInvoices.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredInvoices.map((invoice) => {
            const config = statusConfig[invoice.status as keyof typeof statusConfig]
            const StatusIcon = config.icon
            return (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Receipt className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{invoice.id}</p>
                      <Badge className={config.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {invoice.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{invoice.client}</p>
                    <p className="text-xs text-muted-foreground">Due: {invoice.dueDate} • {invoice.items} items</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold">${invoice.amount.toFixed(2)}</p>
                    {invoice.paidDate && (
                      <p className="text-xs text-green-500">Paid: {invoice.paidDate}</p>
                    )}
                  </div>
                  <Button size="sm" variant="ghost" className="text-emerald-500">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
