"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Plus, Search, CheckCircle, Clock, UserCheck, XCircle } from "lucide-react"

const visitors = [
  { id: 1, name: "Robert Johnson", company: "ABC Supplies", purpose: "Delivery", host: "Tom Anderson", checkIn: "09:15 AM", checkOut: "-", badge: "V-001", status: "checked-in" },
  { id: 2, name: "Emily Brown", company: "XYZ Consulting", purpose: "Meeting", host: "Sarah Smith", checkIn: "10:00 AM", checkOut: "-", badge: "V-002", status: "checked-in" },
  { id: 3, name: "Michael Davis", company: "Parent", purpose: "Pick up child", host: "Front Desk", checkIn: "14:30 PM", checkOut: "15:00 PM", badge: "V-003", status: "checked-out" },
  { id: 4, name: "Jennifer Wilson", company: "Media Inc", purpose: "Interview", host: "HR Department", checkIn: "11:00 AM", checkOut: "12:30 PM", badge: "V-004", status: "checked-out" },
  { id: 5, name: "David Lee", company: "Tech Services", purpose: "Maintenance", host: "Facility Team", checkIn: "-", checkOut: "-", badge: "-", status: "scheduled" },
]

const pendingApprovals = [
  { id: 1, name: "Alex Turner", company: "Sports Equipment Co", purpose: "Sales Demo", requestedDate: "Tomorrow", host: "Equipment Manager" },
  { id: 2, name: "Lisa Chen", company: "Catering Services", purpose: "Event Setup", requestedDate: "Jan 20", host: "Event Coordinator" },
]

export default function VisitorScreeningPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Visitor Screening</h1>
          <p className="text-muted-foreground">Manage visitor registration and access</p>
        </div>
        <Button className="bg-gradient-to-r from-slate-600 to-slate-800 text-white">
          <Plus className="w-4 h-4 mr-2" />Pre-Register Visitor
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/20">
                <UserCheck className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Currently On-Site</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Today</p>
                <p className="text-2xl font-bold">12</p>
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
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-orange-500/20">
                <XCircle className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Visitor Log</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search visitors..." className="pl-10 glass-subtle" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Host</TableHead>
                  <TableHead>Badge</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visitors.map((visitor) => (
                  <TableRow key={visitor.id}>
                    <TableCell className="font-medium">{visitor.name}</TableCell>
                    <TableCell>{visitor.company}</TableCell>
                    <TableCell>{visitor.purpose}</TableCell>
                    <TableCell>{visitor.host}</TableCell>
                    <TableCell>{visitor.badge}</TableCell>
                    <TableCell>
                      <Badge variant={
                        visitor.status === "checked-in" ? "default" :
                        visitor.status === "checked-out" ? "secondary" : "outline"
                      }>
                        {visitor.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {visitor.status === "checked-in" && (
                        <Button size="sm" variant="outline">Check Out</Button>
                      )}
                      {visitor.status === "scheduled" && (
                        <Button size="sm">Check In</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="p-4 rounded-xl glass-subtle">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{approval.name}</span>
                </div>
                <div className="text-sm text-muted-foreground mb-3">
                  <p>{approval.company}</p>
                  <p>Purpose: {approval.purpose}</p>
                  <p>Date: {approval.requestedDate}</p>
                  <p>Host: {approval.host}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">Approve</Button>
                  <Button size="sm" variant="outline" className="flex-1">Deny</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
