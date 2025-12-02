"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Calendar, TrendingUp, Star, CheckCircle } from "lucide-react"

const reports = [
  { id: 1, title: "Weekly Quality Report", period: "Jan 8-15, 2024", type: "Quality", status: "completed", avgScore: 91 },
  { id: 2, title: "Monthly Cleaning Summary", period: "December 2023", type: "Summary", status: "completed", avgScore: 88 },
  { id: 3, title: "Supplies Usage Report", period: "Q4 2023", type: "Inventory", status: "completed", avgScore: null },
  { id: 4, title: "Staff Performance Report", period: "January 2024", type: "Performance", status: "in-progress", avgScore: null },
]

const metrics = [
  { label: "Average Quality Score", value: "89%", change: "+3%", trend: "up" },
  { label: "Tasks Completed", value: "456", change: "+12%", trend: "up" },
  { label: "Inspection Pass Rate", value: "94%", change: "+2%", trend: "up" },
  { label: "Staff Efficiency", value: "87%", change: "-1%", trend: "down" },
]

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quality Reports</h1>
          <p className="text-muted-foreground">View and generate cleaning quality reports</p>
        </div>
        <Button className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white">
          <FileText className="w-4 h-4 mr-2" />Generate Report
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="glass-card border-white/20">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <div className="flex items-end gap-2 mt-2">
                <p className="text-2xl font-bold">{metric.value}</p>
                <span className={`text-sm ${metric.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                  {metric.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="p-4 rounded-xl glass-subtle flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-sky-500/20">
                    <FileText className="w-5 h-5 text-sky-500" />
                  </div>
                  <div>
                    <p className="font-medium">{report.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {report.period}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {report.avgScore && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">{report.avgScore}%</span>
                    </div>
                  )}
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Quality Score Trend</span>
                  <span className="text-green-500">↑ Improving</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[89%] bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Task Completion Rate</span>
                  <span className="text-green-500">↑ 94%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[94%] bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Inspection Pass Rate</span>
                  <span className="text-green-500">↑ 92%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[92%] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h4 className="font-medium mb-3">Key Achievements</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Zero safety incidents this month</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>All areas passed inspection</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Staff training completed</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
