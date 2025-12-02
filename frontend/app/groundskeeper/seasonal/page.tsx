"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Sun, Snowflake, Leaf, Flower } from "lucide-react"

const seasons = [
  { id: "spring", name: "Spring", icon: Flower, months: "Mar - May", active: false },
  { id: "summer", name: "Summer", icon: Sun, months: "Jun - Aug", active: false },
  { id: "fall", name: "Fall", icon: Leaf, months: "Sep - Nov", active: false },
  { id: "winter", name: "Winter", icon: Snowflake, months: "Dec - Feb", active: true },
]

const winterTasks = [
  { id: 1, task: "Winterize irrigation system", status: "completed", dueDate: "Dec 1" },
  { id: 2, task: "Apply winter fertilizer", status: "completed", dueDate: "Dec 15" },
  { id: 3, task: "Overseed cool-season grass", status: "completed", dueDate: "Nov 15" },
  { id: 4, task: "Equipment winterization", status: "in-progress", dueDate: "Jan 15" },
  { id: 5, task: "Plan spring renovation", status: "scheduled", dueDate: "Feb 1" },
]

const upcomingSeasonTasks = [
  { task: "Pre-emergent herbicide application", season: "Spring", timing: "Early March" },
  { task: "Aeration and overseeding", season: "Spring", timing: "Mid March" },
  { task: "First mowing of season", season: "Spring", timing: "Late March" },
  { task: "Irrigation system startup", season: "Spring", timing: "Early April" },
]

export default function SeasonalPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Seasonal Maintenance</h1>
          <p className="text-muted-foreground">Plan and track seasonal groundskeeping activities</p>
        </div>
        <Button className="bg-gradient-to-r from-lime-500 to-green-600 text-white">
          <Calendar className="w-4 h-4 mr-2" />Plan Season
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {seasons.map((season) => (
          <Card key={season.id} className={`glass-card border-white/20 ${season.active ? 'ring-2 ring-lime-500' : ''}`}>
            <CardContent className="p-6 text-center">
              <season.icon className={`w-12 h-12 mx-auto mb-3 ${season.active ? 'text-lime-500' : 'text-muted-foreground'}`} />
              <h3 className="font-semibold">{season.name}</h3>
              <p className="text-sm text-muted-foreground">{season.months}</p>
              {season.active && <Badge className="mt-2">Current</Badge>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle>Current Season Tasks (Winter)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {winterTasks.map((task) => (
              <div key={task.id} className="p-4 rounded-xl glass-subtle flex items-center justify-between">
                <div>
                  <p className="font-medium">{task.task}</p>
                  <p className="text-sm text-muted-foreground">Due: {task.dueDate}</p>
                </div>
                <Badge variant={
                  task.status === "completed" ? "default" :
                  task.status === "in-progress" ? "secondary" : "outline"
                }>
                  {task.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle>Upcoming Season Preview (Spring)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSeasonTasks.map((task, index) => (
              <div key={index} className="p-4 rounded-xl glass-subtle">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">{task.task}</p>
                  <Badge variant="outline">{task.timing}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
