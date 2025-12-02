import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  FileText,
  CheckCircle,
  Clock,
  Receipt,
  CreditCard,
  AlertTriangle,
} from "lucide-react"
import { accountantPageStats, accountantPageRecentTransactions, accountantPagePendingInvoices } from "@/lib/services/mockDataService"

const statusColors: Record<string, string> = {
  completed: "bg-green-500/20 text-green-500",
  pending: "bg-yellow-500/20 text-yellow-600",
  failed: "bg-red-500/20 text-red-500",
}

export default function AccountantDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Financial Dashboard</h1>
          <p className="text-muted-foreground">Manage payments, invoices, and financial reports</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button className="bg-gradient-to-r from-emerald-500 to-green-600 text-white">
            <Receipt className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {accountantPageStats.map((stat) => (
          <Card key={stat.title} className="glass-card border-white/20 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === "up" && <TrendingUp className="w-4 h-4 text-green-500" />}
                    {stat.trend === "down" && <TrendingDown className="w-4 h-4 text-red-500" />}
                    <span className={`text-sm ${stat.trend === "up" ? "text-green-500" : stat.trend === "down" ? "text-red-500" : "text-muted-foreground"}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
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
            <Button variant="ghost" size="sm" className="text-emerald-500">View All</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {accountantPageRecentTransactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${txn.type === "refund" ? "bg-red-500/20" : "bg-emerald-500/20"} flex items-center justify-center`}>
                    {txn.type === "refund" ? (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    ) : (
                      <CreditCard className="w-5 h-5 text-emerald-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{txn.member}</p>
                    <p className="text-sm text-muted-foreground">{txn.id} • {txn.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`font-semibold ${txn.amount.startsWith("-") ? "text-red-500" : ""}`}>{txn.amount}</p>
                    <p className="text-xs text-muted-foreground">{txn.date}</p>
                  </div>
                  <Badge className={statusColors[txn.status as keyof typeof statusColors]}>{txn.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending Invoices */}
        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Pending Invoices</CardTitle>
            <Badge className="bg-yellow-500/20 text-yellow-600">{accountantPagePendingInvoices.length} Due</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {accountantPagePendingInvoices.map((invoice) => (
              <div key={invoice.id} className="p-4 rounded-xl glass-subtle">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{invoice.id}</span>
                  <span className="font-bold text-emerald-500">{invoice.amount}</span>
                </div>
                <p className="text-sm text-muted-foreground">{invoice.client}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Due: {invoice.dueDate}</span>
                  </div>
                  <Badge variant="outline" className={invoice.daysLeft <= 3 ? "border-red-500/50 text-red-500" : "border-yellow-500/50 text-yellow-600"}>
                    {invoice.daysLeft} days
                  </Badge>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full glass-subtle border-white/20 bg-transparent">
              View All Invoices
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Monthly Collection Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Target: $150,000</span>
                  <span className="font-semibold">$128,450 (85.6%)</span>
                </div>
                <Progress value={85.6} className="h-3" />
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center p-3 rounded-xl glass-subtle">
                  <CheckCircle className="w-6 h-6 mx-auto text-green-500 mb-2" />
                  <p className="font-bold">$128,450</p>
                  <p className="text-xs text-muted-foreground">Collected</p>
                </div>
                <div className="text-center p-3 rounded-xl glass-subtle">
                  <Clock className="w-6 h-6 mx-auto text-yellow-500 mb-2" />
                  <p className="font-bold">$24,680</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
                <div className="text-center p-3 rounded-xl glass-subtle">
                  <AlertTriangle className="w-6 h-6 mx-auto text-red-500 mb-2" />
                  <p className="font-bold">$5,280</p>
                  <p className="text-xs text-muted-foreground">Overdue</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "Create New Invoice", icon: Receipt, color: "text-emerald-500" },
              { label: "Process Refund", icon: TrendingDown, color: "text-red-500" },
              { label: "Generate Statement", icon: FileText, color: "text-blue-500" },
              { label: "View Tax Reports", icon: FileText, color: "text-purple-500" },
            ].map((action) => (
              <Button key={action.label} variant="ghost" className="w-full justify-between glass-subtle hover:bg-white/20">
                <span className="flex items-center gap-3">
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                  {action.label}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
