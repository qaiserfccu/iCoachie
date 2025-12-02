"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Download, FileText, TrendingUp, TrendingDown, PieChart,
  BarChart3, Calendar, DollarSign, ArrowRight
} from "lucide-react"

const monthlyRevenue = [
  { month: "Jan", revenue: 45000, expenses: 32000 },
  { month: "Feb", revenue: 52000, expenses: 35000 },
  { month: "Mar", revenue: 48000, expenses: 33000 },
  { month: "Apr", revenue: 61000, expenses: 38000 },
  { month: "May", revenue: 55000, expenses: 36000 },
  { month: "Jun", revenue: 67000, expenses: 42000 },
]

const reportTypes = [
  { id: 1, name: "Financial Summary", description: "Complete overview of income, expenses, and net profit", icon: PieChart, color: "from-emerald-500 to-green-600", lastGenerated: "Today" },
  { id: 2, name: "Revenue Report", description: "Detailed breakdown of all revenue streams", icon: TrendingUp, color: "from-blue-500 to-blue-600", lastGenerated: "Yesterday" },
  { id: 3, name: "Expense Report", description: "Analysis of all operational expenses", icon: TrendingDown, color: "from-red-500 to-red-600", lastGenerated: "2 days ago" },
  { id: 4, name: "Tax Report", description: "Tax summary and deductions for the period", icon: FileText, color: "from-purple-500 to-indigo-500", lastGenerated: "1 week ago" },
  { id: 5, name: "Cash Flow Statement", description: "Cash inflows and outflows analysis", icon: BarChart3, color: "from-orange-500 to-orange-600", lastGenerated: "3 days ago" },
  { id: 6, name: "Accounts Receivable", description: "Outstanding invoices and aging report", icon: DollarSign, color: "from-cyan-500 to-cyan-600", lastGenerated: "Today" },
]

const recentReports = [
  { id: 1, name: "Q4 2023 Financial Summary", type: "Financial Summary", date: "2024-01-10", size: "2.4 MB", status: "ready" },
  { id: 2, name: "December Revenue Report", type: "Revenue Report", date: "2024-01-05", size: "1.8 MB", status: "ready" },
  { id: 3, name: "Annual Tax Report 2023", type: "Tax Report", date: "2024-01-02", size: "3.2 MB", status: "processing" },
  { id: 4, name: "November Expense Analysis", type: "Expense Report", date: "2023-12-15", size: "1.5 MB", status: "ready" },
]

export default function ReportsPage() {
  const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0)
  const totalExpenses = monthlyRevenue.reduce((sum, m) => sum + m.expenses, 0)
  const netProfit = totalRevenue - totalExpenses

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Financial Reports</h1>
          <p className="text-muted-foreground">Generate and view financial reports</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="glass-subtle border-white/20">
            <Calendar className="w-4 h-4 mr-2" />
            Custom Range
          </Button>
          <Button className="bg-gradient-to-r from-emerald-500 to-green-600 text-white">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue (YTD)</p>
                <p className="text-3xl font-bold text-green-500">${(totalRevenue / 1000).toFixed(0)}K</p>
                <p className="text-sm text-green-500 mt-1">+12.5% vs last year</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses (YTD)</p>
                <p className="text-3xl font-bold text-red-500">${(totalExpenses / 1000).toFixed(0)}K</p>
                <p className="text-sm text-red-500 mt-1">+8.2% vs last year</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center">
                <TrendingDown className="w-7 h-7 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Profit (YTD)</p>
                <p className="text-3xl font-bold text-emerald-500">${(netProfit / 1000).toFixed(0)}K</p>
                <p className="text-sm text-emerald-500 mt-1">+18.3% vs last year</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Types */}
      <Card className="glass-card border-white/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Generate Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${report.color} flex items-center justify-center mb-3`}>
                  <report.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-1">{report.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                <p className="text-xs text-muted-foreground">Last generated: {report.lastGenerated}</p>
                <Button size="sm" variant="ghost" className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500">
                  Generate <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Recent Reports</CardTitle>
          <Button variant="ghost" size="sm" className="text-emerald-500">
            View All
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentReports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="font-medium">{report.name}</p>
                  <p className="text-sm text-muted-foreground">{report.type} • {report.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{report.size}</span>
                <Badge className={report.status === "ready" ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500"}>
                  {report.status}
                </Badge>
                {report.status === "ready" && (
                  <Button size="sm" variant="ghost" className="text-emerald-500">
                    <Download className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
