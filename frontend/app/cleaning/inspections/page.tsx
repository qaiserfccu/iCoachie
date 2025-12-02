"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ClipboardCheck, Plus, CheckCircle, XCircle, Eye, Star } from "lucide-react"

const inspections = [
  { id: 1, area: "Main Lobby", inspector: "Tom Anderson", date: "Jan 15, 2024", time: "10:00 AM", score: 95, items: 12, passed: 11, status: "passed" },
  { id: 2, area: "Gym Area", inspector: "Tom Anderson", date: "Jan 15, 2024", time: "11:30 AM", score: 88, items: 15, passed: 13, status: "passed" },
  { id: 3, area: "Pool Area", inspector: "Sarah Smith", date: "Jan 14, 2024", time: "09:00 AM", score: 72, items: 10, passed: 7, status: "failed" },
  { id: 4, area: "Locker Rooms", inspector: "Tom Anderson", date: "Jan 14, 2024", time: "02:00 PM", score: 90, items: 14, passed: 13, status: "passed" },
  { id: 5, area: "Staff Offices", inspector: "Sarah Smith", date: "Jan 13, 2024", time: "03:30 PM", score: 98, items: 8, passed: 8, status: "passed" },
]

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-green-500"
  if (score >= 75) return "text-yellow-500"
  return "text-red-500"
}

export default function InspectionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inspections</h1>
          <p className="text-muted-foreground">Quality control and inspection records</p>
        </div>
        <Button className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white">
          <Plus className="w-4 h-4 mr-2" />New Inspection
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
                <p className="text-sm text-muted-foreground">Passed</p>
                <p className="text-2xl font-bold">18</p>
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
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-yellow-500/20">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Score</p>
                <p className="text-2xl font-bold">89%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <ClipboardCheck className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle>Recent Inspections</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Area</TableHead>
                <TableHead>Inspector</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items Checked</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inspections.map((inspection) => (
                <TableRow key={inspection.id}>
                  <TableCell className="font-medium">{inspection.area}</TableCell>
                  <TableCell>{inspection.inspector}</TableCell>
                  <TableCell>{inspection.date} {inspection.time}</TableCell>
                  <TableCell>{inspection.passed}/{inspection.items}</TableCell>
                  <TableCell className={`font-bold ${getScoreColor(inspection.score)}`}>{inspection.score}%</TableCell>
                  <TableCell>
                    <Badge variant={inspection.status === "passed" ? "default" : "destructive"}>
                      {inspection.status}
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
