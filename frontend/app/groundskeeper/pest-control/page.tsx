"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bug, Plus, CheckCircle, AlertTriangle, Calendar } from "lucide-react"

const treatments = [
  { id: 1, area: "Main Soccer Field", type: "Fungicide", date: "Jan 10, 2024", nextDue: "Feb 10, 2024", status: "completed" },
  { id: 2, area: "Practice Field A", type: "Insecticide", date: "Jan 8, 2024", nextDue: "Feb 8, 2024", status: "completed" },
  { id: 3, area: "Practice Field B", type: "Herbicide", date: "Jan 5, 2024", nextDue: "Jan 19, 2024", status: "due-soon" },
  { id: 4, area: "Stadium", type: "Fungicide", date: "Jan 12, 2024", nextDue: "Feb 12, 2024", status: "completed" },
]

const issues = [
  { id: 1, area: "Practice Field B", issue: "Grub activity detected", severity: "medium", reportedDate: "Jan 14" },
  { id: 2, area: "Training Pitch", issue: "Dollar spot fungus", severity: "low", reportedDate: "Jan 13" },
]

export default function PestControlPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pest Control</h1>
          <p className="text-muted-foreground">Track pest management activities</p>
        </div>
        <Button className="bg-gradient-to-r from-lime-500 to-green-600 text-white">
          <Plus className="w-4 h-4 mr-2" />Log Treatment
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/20">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Up to Date</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-yellow-500/20">
                <Calendar className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Soon</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-orange-500/20">
                <Bug className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Issues</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-red-500/20">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle>Treatment Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {treatments.map((treatment) => (
              <div key={treatment.id} className="p-4 rounded-xl glass-subtle">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{treatment.area}</h3>
                  <Badge variant={treatment.status === "completed" ? "default" : "secondary"}>
                    {treatment.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium">{treatment.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Applied</p>
                    <p className="font-medium">{treatment.date}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Next Due</p>
                    <p className="font-medium">{treatment.nextDue}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle>Active Issues</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {issues.map((issue) => (
              <div key={issue.id} className="p-4 rounded-xl glass-subtle">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{issue.area}</h3>
                  <Badge variant={issue.severity === "high" ? "destructive" : issue.severity === "medium" ? "default" : "secondary"}>
                    {issue.severity}
                  </Badge>
                </div>
                <p className="text-sm">{issue.issue}</p>
                <p className="text-xs text-muted-foreground mt-2">Reported: {issue.reportedDate}</p>
              </div>
            ))}
            {issues.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No active issues</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
