"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Plus, Search, Eye, Edit, FileText } from "lucide-react"

const incidents = [
  { id: "INC-001", type: "Security", title: "Unauthorized access attempt", location: "Staff Room", date: "2024-01-15", time: "14:30", reportedBy: "John Guard", status: "investigating", severity: "high" },
  { id: "INC-002", type: "Safety", title: "Wet floor slip hazard", location: "Pool Area", date: "2024-01-15", time: "10:15", reportedBy: "Sarah Smith", status: "resolved", severity: "medium" },
  { id: "INC-003", type: "Theft", title: "Missing equipment report", location: "Equipment Room", date: "2024-01-14", time: "16:45", reportedBy: "Mike Thompson", status: "investigating", severity: "high" },
  { id: "INC-004", type: "Vandalism", title: "Graffiti on wall", location: "Parking Lot", date: "2024-01-14", time: "08:00", reportedBy: "David Wilson", status: "closed", severity: "low" },
  { id: "INC-005", type: "Other", title: "Suspicious behavior", location: "Main Entrance", date: "2024-01-13", time: "19:30", reportedBy: "James Rodriguez", status: "reported", severity: "medium" },
]

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical": return "bg-red-500"
    case "high": return "bg-orange-500"
    case "medium": return "bg-yellow-500"
    case "low": return "bg-green-500"
    default: return "bg-gray-500"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "reported": return "secondary"
    case "investigating": return "default"
    case "resolved": return "outline"
    case "closed": return "secondary"
    default: return "secondary"
  }
}

export default function IncidentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Incident Reports</h1>
          <p className="text-muted-foreground">Track and manage security incidents</p>
        </div>
        <Button className="bg-gradient-to-r from-slate-600 to-slate-800 text-white">
          <Plus className="w-4 h-4 mr-2" />Report Incident
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-red-500/20">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-orange-500/20">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">High</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-yellow-500/20">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Medium</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/20">
                <AlertTriangle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Low</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Incidents</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search incidents..." className="pl-10 glass-subtle" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date/Time</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell className="font-medium">{incident.id}</TableCell>
                  <TableCell>{incident.type}</TableCell>
                  <TableCell>{incident.title}</TableCell>
                  <TableCell>{incident.location}</TableCell>
                  <TableCell>{incident.date} {incident.time}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${getSeverityColor(incident.severity)}`} />
                      {incident.severity}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(incident.status) as any}>{incident.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm"><FileText className="w-4 h-4" /></Button>
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
