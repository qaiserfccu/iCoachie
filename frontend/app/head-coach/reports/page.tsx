"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  FileText, Download, TrendingUp, TrendingDown, 
  Users, Calendar, Target, BarChart3, 
  ArrowRight, Filter, AlertCircle
} from "lucide-react"
import { headCoachService } from "@/lib/services/headCoachService"

interface ReportSummary {
  title: string
  value: string
  change: number
  trend: 'up' | 'down' | 'stable'
  color: string
}

interface Report {
  id: number
  title: string
  type: string
  date: string
  status: 'completed' | 'pending' | 'in-progress'
  metrics: {
    label: string
    value: number
    target: number
  }[]
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [summaries, setSummaries] = useState<ReportSummary[]>([])
  const [reports, setReports] = useState<Report[]>([])

  const fallbackSummaries: ReportSummary[] = [
    { title: "Overall Performance", value: "87%", change: 5, trend: "up", color: "text-green-500" },
    { title: "Attendance Rate", value: "92%", change: 3, trend: "up", color: "text-blue-500" },
    { title: "Session Completion", value: "78%", change: -2, trend: "down", color: "text-yellow-500" },
    { title: "Player Progress", value: "85%", change: 8, trend: "up", color: "text-purple-500" },
  ]

  const fallbackReports: Report[] = [
    { 
      id: 1, 
      title: "Weekly Performance Summary", 
      type: "Performance", 
      date: "Jan 15, 2024", 
      status: "completed",
      metrics: [
        { label: "Sessions Completed", value: 24, target: 28 },
        { label: "Avg. Attendance", value: 92, target: 90 },
        { label: "Player Evaluations", value: 18, target: 20 },
      ]
    },
    { 
      id: 2, 
      title: "Monthly Training Report", 
      type: "Training", 
      date: "Jan 1, 2024", 
      status: "completed",
      metrics: [
        { label: "Programs Active", value: 12, target: 10 },
        { label: "New Athletes", value: 15, target: 12 },
        { label: "Coach Hours", value: 180, target: 160 },
      ]
    },
    { 
      id: 3, 
      title: "Quarterly Assessment", 
      type: "Assessment", 
      date: "Dec 31, 2023", 
      status: "completed",
      metrics: [
        { label: "Skill Improvement", value: 85, target: 80 },
        { label: "Goal Achievement", value: 78, target: 75 },
        { label: "Parent Satisfaction", value: 94, target: 90 },
      ]
    },
    { 
      id: 4, 
      title: "Team Progress Report", 
      type: "Progress", 
      date: "In Progress", 
      status: "in-progress",
      metrics: [
        { label: "Teams Evaluated", value: 3, target: 5 },
        { label: "Match Analysis", value: 8, target: 12 },
        { label: "Coach Reviews", value: 4, target: 6 },
      ]
    },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch dashboard data to generate report summaries
        const dashboardData = await headCoachService.getDashboardData()
        
        // Generate summaries from real data
        const realSummaries: ReportSummary[] = [
          { 
            title: "Total Coaches", 
            value: dashboardData.stats.totalCoaches.toString(), 
            change: 2, 
            trend: "up", 
            color: "text-green-500" 
          },
          { 
            title: "Total Athletes", 
            value: dashboardData.stats.totalAthletes.toString(), 
            change: 5, 
            trend: "up", 
            color: "text-blue-500" 
          },
          { 
            title: "Active Sessions", 
            value: dashboardData.stats.totalSessions.toString(), 
            change: 3, 
            trend: "up", 
            color: "text-purple-500" 
          },
          { 
            title: "Programs", 
            value: dashboardData.stats.totalPrograms.toString(), 
            change: 1, 
            trend: "stable", 
            color: "text-orange-500" 
          },
        ]
        
        setSummaries(realSummaries.length > 0 ? realSummaries : fallbackSummaries)
        setReports(fallbackReports) // Reports are static for now
      } catch (err) {
        console.error('Failed to fetch report data:', err)
        setError('Failed to load reports. Using fallback data.')
        setSummaries(fallbackSummaries)
        setReports(fallbackReports)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const statusConfig = {
    "completed": { color: "bg-green-500/20 text-green-500" },
    "pending": { color: "bg-yellow-500/20 text-yellow-500" },
    "in-progress": { color: "bg-blue-500/20 text-blue-500" },
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Performance Reports</h1>
            <p className="text-muted-foreground">Track and analyze team performance metrics</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="glass-card border-white/20">
              <CardContent className="p-4">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Performance Reports</h1>
          <p className="text-muted-foreground">Track and analyze team performance metrics</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="glass-subtle border-white/20">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {summaries.map((summary, idx) => (
          <Card key={idx} className="glass-card border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{summary.title}</p>
                  <p className={`text-2xl font-bold mt-1 ${summary.color}`}>{summary.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {summary.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : summary.trend === "down" ? (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    ) : null}
                    <span className={`text-xs ${summary.trend === "up" ? "text-green-500" : summary.trend === "down" ? "text-red-500" : "text-muted-foreground"}`}>
                      {summary.change > 0 ? "+" : ""}{summary.change}% from last period
                    </span>
                  </div>
                </div>
                <BarChart3 className={`w-8 h-8 ${summary.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reports List */}
      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Recent Reports</CardTitle>
          <Button variant="ghost" size="sm" className="text-orange-500">
            View All
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="p-4 rounded-xl glass-subtle">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{report.title}</p>
                      <Badge className={statusConfig[report.status].color}>
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{report.type} • {report.date}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="glass-subtle border-white/20">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-orange-500">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {report.metrics.map((metric, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{metric.label}</span>
                      <span className="font-medium">{metric.value}/{metric.target}</span>
                    </div>
                    <Progress value={(metric.value / metric.target) * 100} className="h-1.5" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
