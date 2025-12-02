"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Activity, AlertTriangle, Plus, ArrowRight, Calendar, Clock } from "lucide-react"

const injuries = [
  { id: 1, student: "Alex Thompson", type: "Ankle Sprain", severity: "moderate", date: "Jan 12, 2024", status: "recovering", followUp: "Jan 19" },
  { id: 2, student: "Jordan Lee", type: "Minor Cut", severity: "minor", date: "Jan 10, 2024", status: "recovered", followUp: null },
  { id: 3, student: "Casey Rivera", type: "Muscle Strain", severity: "moderate", date: "Jan 8, 2024", status: "treatment", followUp: "Jan 15" },
  { id: 4, student: "Taylor Morgan", type: "Bruise", severity: "minor", date: "Jan 5, 2024", status: "recovered", followUp: null },
  { id: 5, student: "Sam Wilson", type: "Concussion Protocol", severity: "severe", date: "Jan 3, 2024", status: "treatment", followUp: "Jan 17" },
]

const severityColors = { minor: "bg-green-500/20 text-green-500", moderate: "bg-yellow-500/20 text-yellow-500", severe: "bg-red-500/20 text-red-500" }
const statusColors = { recovered: "bg-green-500/20 text-green-500", recovering: "bg-blue-500/20 text-blue-500", treatment: "bg-orange-500/20 text-orange-500" }

export default function InjuriesPage() {
  const activeInjuries = injuries.filter(i => i.status !== "recovered").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Injury Tracking</h1>
          <p className="text-muted-foreground">Monitor and track student injuries</p>
        </div>
        <Button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Report Injury
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Reported</p>
              <p className="text-2xl font-bold">{injuries.length}</p>
            </div>
            <Activity className="w-8 h-8 text-pink-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Cases</p>
              <p className="text-2xl font-bold text-orange-500">{activeInjuries}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Recovered</p>
              <p className="text-2xl font-bold text-green-500">{injuries.filter(i => i.status === "recovered").length}</p>
            </div>
            <Activity className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Follow-ups Due</p>
              <p className="text-2xl font-bold text-blue-500">{injuries.filter(i => i.followUp).length}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Injury Records</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {injuries.map((injury) => (
            <div key={injury.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-500 text-white">
                    {injury.student.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{injury.student}</p>
                  <p className="text-sm text-muted-foreground">{injury.type}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Reported: {injury.date}</span>
                    {injury.followUp && (
                      <>
                        <span>•</span>
                        <Calendar className="w-3 h-3" />
                        <span>Follow-up: {injury.followUp}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={severityColors[injury.severity as keyof typeof severityColors]}>{injury.severity}</Badge>
                <Badge className={statusColors[injury.status as keyof typeof statusColors]}>{injury.status}</Badge>
                <Button size="sm" variant="ghost" className="text-pink-500">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
