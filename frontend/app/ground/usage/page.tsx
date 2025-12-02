"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Clock, Users } from "lucide-react"

const usageData = [
  { field: "Main Soccer Field", hours: 45, sessions: 28, teams: 8, utilization: 85 },
  { field: "Practice Field A", hours: 38, sessions: 22, teams: 6, utilization: 72 },
  { field: "Practice Field B", hours: 30, sessions: 18, teams: 5, utilization: 58 },
  { field: "Stadium", hours: 12, sessions: 4, teams: 3, utilization: 25 },
  { field: "Training Pitch", hours: 42, sessions: 26, teams: 7, utilization: 80 },
]

const weeklyTrend = [
  { week: "Week 1", hours: 150 },
  { week: "Week 2", hours: 165 },
  { week: "Week 3", hours: 142 },
  { week: "Week 4", hours: 178 },
]

export default function UsagePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Usage Reports</h1>
        <p className="text-muted-foreground">Track field usage and utilization</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/20">
                <Clock className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold">167</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <BarChart3 className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sessions</p>
                <p className="text-2xl font-bold">98</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Teams</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-yellow-500/20">
                <TrendingUp className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Utilization</p>
                <p className="text-2xl font-bold">64%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle>Field Usage This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {usageData.map((field) => (
              <div key={field.field} className="p-4 rounded-xl glass-subtle">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{field.field}</h3>
                  <span className="text-emerald-500 font-bold">{field.utilization}%</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-3">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all"
                    style={{ width: `${field.utilization}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Hours</p>
                    <p className="font-medium">{field.hours}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Sessions</p>
                    <p className="font-medium">{field.sessions}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Teams</p>
                    <p className="font-medium">{field.teams}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
