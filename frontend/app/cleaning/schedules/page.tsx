"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Plus, CheckCircle, Clock, XCircle, Eye } from "lucide-react"

const schedules = [
  { id: 1, area: "Main Lobby", assignee: "Maria Lopez", date: "Today", time: "08:00 AM", frequency: "Daily", tasks: 5, status: "completed" },
  { id: 2, area: "Gym Area", assignee: "Carlos Santos", date: "Today", time: "10:00 AM", frequency: "Daily", tasks: 8, status: "in-progress" },
  { id: 3, area: "Pool Area", assignee: "Ana Garcia", date: "Today", time: "02:00 PM", frequency: "Daily", tasks: 6, status: "pending" },
  { id: 4, area: "Locker Rooms", assignee: "Juan Martinez", date: "Today", time: "04:00 PM", frequency: "Daily", tasks: 7, status: "pending" },
  { id: 5, area: "Staff Offices", assignee: "Maria Lopez", date: "Tomorrow", time: "09:00 AM", frequency: "Weekly", tasks: 4, status: "scheduled" },
]

export default function SchedulesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cleaning Schedules</h1>
          <p className="text-muted-foreground">Manage cleaning schedules and assignments</p>
        </div>
        <Button className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white">
          <Plus className="w-4 h-4 mr-2" />Create Schedule
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
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
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
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-red-500/20">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Missed</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Area</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Tasks</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">{schedule.area}</TableCell>
                  <TableCell>{schedule.assignee}</TableCell>
                  <TableCell>{schedule.date} {schedule.time}</TableCell>
                  <TableCell>{schedule.frequency}</TableCell>
                  <TableCell>{schedule.tasks} tasks</TableCell>
                  <TableCell>
                    <Badge variant={
                      schedule.status === "completed" ? "default" :
                      schedule.status === "in-progress" ? "secondary" : "outline"
                    }>
                      {schedule.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
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
