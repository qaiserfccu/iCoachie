"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Leaf, Plus, CheckCircle, AlertTriangle, Calendar } from "lucide-react"

const turfAreas = [
  { id: 1, name: "Main Soccer Field", type: "Bermuda Grass", lastMow: "Today", nextMow: "Thu", grassHeight: 2.5, health: "excellent" },
  { id: 2, name: "Practice Field A", type: "Kentucky Bluegrass", lastMow: "Yesterday", nextMow: "Wed", grassHeight: 2.8, health: "good" },
  { id: 3, name: "Practice Field B", type: "Bermuda Grass", lastMow: "2 days ago", nextMow: "Today", grassHeight: 3.2, health: "needs-attention" },
  { id: 4, name: "Stadium", type: "Hybrid Grass", lastMow: "Today", nextMow: "Fri", grassHeight: 2.3, health: "excellent" },
]

const turfTasks = [
  { id: 1, task: "Overseeding Practice Field B", scheduled: "Jan 25", status: "scheduled" },
  { id: 2, task: "Aeration Main Soccer Field", scheduled: "Feb 1", status: "scheduled" },
  { id: 3, task: "Fertilization all fields", scheduled: "Feb 10", status: "planned" },
]

export default function TurfPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Turf Management</h1>
          <p className="text-muted-foreground">Monitor and maintain turf health</p>
        </div>
        <Button className="bg-gradient-to-r from-lime-500 to-green-600 text-white">
          <Plus className="w-4 h-4 mr-2" />Log Treatment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {turfAreas.map((area) => (
          <Card key={area.id} className="glass-card border-white/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{area.name}</CardTitle>
                <Badge className={
                  area.health === "excellent" ? "bg-green-500/20 text-green-500" :
                  area.health === "good" ? "bg-blue-500/20 text-blue-500" :
                  "bg-yellow-500/20 text-yellow-500"
                }>
                  {area.health}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{area.type}</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg glass-subtle text-center">
                  <Leaf className="w-5 h-5 mx-auto mb-1 text-green-500" />
                  <p className="text-lg font-bold">{area.grassHeight}"</p>
                  <p className="text-xs text-muted-foreground">Height</p>
                </div>
                <div className="p-3 rounded-lg glass-subtle text-center">
                  <Calendar className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                  <p className="text-sm font-medium">{area.lastMow}</p>
                  <p className="text-xs text-muted-foreground">Last Mow</p>
                </div>
                <div className="p-3 rounded-lg glass-subtle text-center">
                  <Calendar className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                  <p className="text-sm font-medium">{area.nextMow}</p>
                  <p className="text-xs text-muted-foreground">Next Mow</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle>Upcoming Turf Tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {turfTasks.map((task) => (
            <div key={task.id} className="p-4 rounded-xl glass-subtle flex items-center justify-between">
              <div>
                <p className="font-medium">{task.task}</p>
                <p className="text-sm text-muted-foreground">Scheduled: {task.scheduled}</p>
              </div>
              <Badge variant={task.status === "scheduled" ? "default" : "secondary"}>
                {task.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
