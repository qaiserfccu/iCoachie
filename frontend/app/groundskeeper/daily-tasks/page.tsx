"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ClipboardList, Plus, CheckCircle, Clock, AlertTriangle } from "lucide-react"

const tasks = [
  { id: 1, task: "Mow Main Soccer Field", priority: "high", time: "6:00 AM", duration: "2 hours", completed: true },
  { id: 2, task: "Water Practice Field A", priority: "medium", time: "8:00 AM", duration: "1 hour", completed: true },
  { id: 3, task: "Repair divots on Training Pitch", priority: "high", time: "9:00 AM", duration: "1.5 hours", completed: false },
  { id: 4, task: "Check irrigation system", priority: "medium", time: "10:30 AM", duration: "45 min", completed: false },
  { id: 5, task: "Apply fertilizer to Stadium", priority: "low", time: "11:30 AM", duration: "1 hour", completed: false },
  { id: 6, task: "Mark lines on Practice Field B", priority: "high", time: "1:00 PM", duration: "2 hours", completed: false },
  { id: 7, task: "Equipment maintenance", priority: "medium", time: "3:00 PM", duration: "1 hour", completed: false },
]

export default function DailyTasksPage() {
  const completedCount = tasks.filter(t => t.completed).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Daily Tasks</h1>
          <p className="text-muted-foreground">Today's groundskeeping tasks</p>
        </div>
        <Button className="bg-gradient-to-r from-lime-500 to-green-600 text-white">
          <Plus className="w-4 h-4 mr-2" />Add Task
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
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-yellow-500/20">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{tasks.length - completedCount}</p>
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
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold">{tasks.filter(t => t.priority === 'high').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <ClipboardList className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{tasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle>Task List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className={`p-4 rounded-xl glass-subtle flex items-center gap-4 ${task.completed ? 'opacity-60' : ''}`}>
              <Checkbox checked={task.completed} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${task.completed ? 'line-through' : ''}`}>{task.task}</span>
                  <Badge variant={
                    task.priority === "high" ? "destructive" :
                    task.priority === "medium" ? "default" : "secondary"
                  }>
                    {task.priority}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {task.time} • {task.duration}
                </div>
              </div>
              {task.completed && <CheckCircle className="w-5 h-5 text-green-500" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
