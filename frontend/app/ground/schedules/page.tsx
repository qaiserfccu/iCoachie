"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Plus, Eye } from "lucide-react"

const schedules = [
  { id: 1, field: "Main Soccer Field", activity: "Training", team: "U-18 Boys", date: "Jan 16, 2024", time: "4:00 PM - 6:00 PM", status: "confirmed" },
  { id: 2, field: "Practice Field A", activity: "Match", team: "U-14 Girls", date: "Jan 16, 2024", time: "5:00 PM - 7:00 PM", status: "confirmed" },
  { id: 3, field: "Main Soccer Field", activity: "Training", team: "Senior Team", date: "Jan 17, 2024", time: "9:00 AM - 11:00 AM", status: "pending" },
  { id: 4, field: "Practice Field B", activity: "Maintenance", team: "-", date: "Jan 17, 2024", time: "2:00 PM - 4:00 PM", status: "scheduled" },
  { id: 5, field: "Stadium", activity: "Tournament", team: "Multiple", date: "Jan 20, 2024", time: "8:00 AM - 6:00 PM", status: "confirmed" },
]

export default function SchedulesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ground Schedules</h1>
          <p className="text-muted-foreground">Manage field and ground schedules</p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-500 to-green-600 text-white">
          <Plus className="w-4 h-4 mr-2" />Add Schedule
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Today's Sessions</p>
            <p className="text-2xl font-bold mt-1">8</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">This Week</p>
            <p className="text-2xl font-bold mt-1">32</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Maintenance Blocks</p>
            <p className="text-2xl font-bold mt-1">4</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Available Slots</p>
            <p className="text-2xl font-bold mt-1">12</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle>Upcoming Schedules</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">{schedule.field}</TableCell>
                  <TableCell>{schedule.activity}</TableCell>
                  <TableCell>{schedule.team}</TableCell>
                  <TableCell>{schedule.date}</TableCell>
                  <TableCell>{schedule.time}</TableCell>
                  <TableCell>
                    <Badge variant={
                      schedule.status === "confirmed" ? "default" :
                      schedule.status === "pending" ? "secondary" : "outline"
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
