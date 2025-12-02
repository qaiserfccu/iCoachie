"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Wrench, Plus, CheckCircle, Clock, AlertTriangle } from "lucide-react"

const maintenanceTasks = [
  { id: 1, field: "Main Soccer Field", task: "Line marking", priority: "high", scheduled: "Jan 17", status: "pending" },
  { id: 2, field: "Practice Field A", task: "Divot repair", priority: "medium", scheduled: "Jan 18", status: "scheduled" },
  { id: 3, field: "Practice Field B", task: "Mowing", priority: "high", scheduled: "Jan 16", status: "in-progress" },
  { id: 4, field: "Stadium", task: "Fertilization", priority: "low", scheduled: "Jan 20", status: "scheduled" },
  { id: 5, field: "Training Pitch", task: "Aeration", priority: "medium", scheduled: "Jan 22", status: "scheduled" },
]

export default function MaintenancePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Maintenance</h1>
          <p className="text-muted-foreground">Manage field maintenance tasks</p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-500 to-green-600 text-white">
          <Plus className="w-4 h-4 mr-2" />Schedule Task
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-yellow-500/20">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <Wrench className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/20">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">12</p>
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

      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle>Scheduled Maintenance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenanceTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.field}</TableCell>
                  <TableCell>{task.task}</TableCell>
                  <TableCell>
                    <Badge variant={
                      task.priority === "high" ? "destructive" :
                      task.priority === "medium" ? "default" : "secondary"
                    }>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{task.scheduled}</TableCell>
                  <TableCell>
                    <Badge variant={
                      task.status === "in-progress" ? "default" :
                      task.status === "pending" ? "secondary" : "outline"
                    }>
                      {task.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
