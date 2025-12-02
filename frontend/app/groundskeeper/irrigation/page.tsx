"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Droplets, Settings, CheckCircle, AlertTriangle, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const zones = [
  { id: 1, name: "Zone A - Main Field", status: "active", lastRun: "6:00 AM", duration: "45 min", nextRun: "Tomorrow 6:00 AM", moisture: 65 },
  { id: 2, name: "Zone B - Practice Field A", status: "scheduled", lastRun: "Yesterday", duration: "30 min", nextRun: "Today 7:00 PM", moisture: 55 },
  { id: 3, name: "Zone C - Practice Field B", status: "needs-attention", lastRun: "2 days ago", duration: "30 min", nextRun: "Manual required", moisture: 38 },
  { id: 4, name: "Zone D - Stadium", status: "active", lastRun: "5:30 AM", duration: "60 min", nextRun: "Tomorrow 5:30 AM", moisture: 62 },
]

const systemStats = [
  { label: "Water Used Today", value: "2,450 gal", icon: Droplets },
  { label: "Active Zones", value: "3/4", icon: CheckCircle },
  { label: "Next Cycle", value: "7:00 PM", icon: Clock },
]

export default function IrrigationPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Irrigation</h1>
          <p className="text-muted-foreground">Monitor and control irrigation systems</p>
        </div>
        <Button className="bg-gradient-to-r from-lime-500 to-green-600 text-white">
          <Settings className="w-4 h-4 mr-2" />Configure Schedule
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {systemStats.map((stat, index) => (
          <Card key={index} className="glass-card border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <stat.icon className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle>Irrigation Zones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {zones.map((zone) => (
            <div key={zone.id} className="p-4 rounded-xl glass-subtle">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">{zone.name}</h3>
                  <Badge variant={
                    zone.status === "active" ? "default" :
                    zone.status === "scheduled" ? "secondary" : "destructive"
                  }>
                    {zone.status}
                  </Badge>
                </div>
                <Button variant="outline" size="sm">Run Now</Button>
              </div>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Last Run</p>
                  <p className="font-medium">{zone.lastRun}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">{zone.duration}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Next Run</p>
                  <p className="font-medium">{zone.nextRun}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Moisture</p>
                  <div className="flex items-center gap-2">
                    <Progress value={zone.moisture} className="h-2 flex-1" />
                    <span className="font-medium">{zone.moisture}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
