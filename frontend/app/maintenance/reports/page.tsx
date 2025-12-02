"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Download, Calendar, TrendingUp, TrendingDown, Clock, DollarSign } from "lucide-react"

const monthlyStats = [
  { month: "Oct", completed: 45, pending: 8 },
  { month: "Nov", completed: 52, pending: 5 },
  { month: "Dec", completed: 38, pending: 12 },
  { month: "Jan", completed: 28, pending: 6 },
]

const categoryBreakdown = [
  { category: "HVAC", count: 24, percentage: 28, cost: "$4,500" },
  { category: "Electrical", count: 18, percentage: 21, cost: "$3,200" },
  { category: "Plumbing", count: 15, percentage: 17, cost: "$2,800" },
  { category: "General", count: 20, percentage: 23, cost: "$1,900" },
  { category: "Safety", count: 10, percentage: 11, cost: "$1,100" },
]

const kpis = [
  { label: "Avg. Completion Time", value: "4.2 hrs", change: "-12%", positive: true },
  { label: "First-Time Fix Rate", value: "87%", change: "+5%", positive: true },
  { label: "Total Maintenance Cost", value: "$13,500", change: "+8%", positive: false },
  { label: "Equipment Uptime", value: "98.5%", change: "+2%", positive: true },
]

const recentReports = [
  { name: "Monthly Maintenance Summary", date: "Jan 2025", type: "summary" },
  { name: "Equipment Condition Report", date: "Jan 2025", type: "inspection" },
  { name: "Cost Analysis Q4 2024", date: "Dec 2024", type: "financial" },
  { name: "Preventive Maintenance Audit", date: "Dec 2024", type: "audit" },
]

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Maintenance performance insights and reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="glass-subtle border-white/20">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
          <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <Card key={idx} className="glass-card border-white/20">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
              <p className="text-2xl font-bold mt-1">{kpi.value}</p>
              <div className={`flex items-center gap-1 mt-1 text-sm ${kpi.positive ? 'text-green-500' : 'text-red-500'}`}>
                {kpi.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{kpi.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Work Orders - Last 4 Months</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyStats.map((month) => (
                <div key={month.month} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{month.month}</span>
                    <span className="text-muted-foreground">
                      {month.completed} completed / {month.pending} pending
                    </span>
                  </div>
                  <div className="flex h-3 rounded-full overflow-hidden bg-white/10">
                    <div 
                      className="bg-green-500" 
                      style={{ width: `${(month.completed / (month.completed + month.pending)) * 100}%` }}
                    />
                    <div 
                      className="bg-amber-500" 
                      style={{ width: `${(month.pending / (month.completed + month.pending)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-sm text-muted-foreground">Pending</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryBreakdown.map((cat) => (
              <div key={cat.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{cat.category}</span>
                    <Badge variant="outline" className="text-xs">{cat.count} orders</Badge>
                  </div>
                  <span className="text-sm text-amber-500">{cat.cost}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div 
                    className="h-full bg-amber-500 rounded-full" 
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold">Generated Reports</CardTitle>
          <Button variant="ghost" size="sm" className="text-amber-500">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentReports.map((report, idx) => (
              <div key={idx} className="p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center mb-3">
                  <BarChart3 className="w-5 h-5 text-amber-500" />
                </div>
                <p className="font-medium text-sm">{report.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{report.date}</p>
                <Badge variant="outline" className="mt-2 text-xs">{report.type}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
