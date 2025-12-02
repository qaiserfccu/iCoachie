"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, UserPlus, MoreVertical, Download, Users, UserCheck, Clock, AlertCircle } from "lucide-react"

const members = [
  {
    id: 1,
    name: "Emma Davis",
    avatar: "ED",
    age: 12,
    sport: "Swimming",
    coach: "John Smith",
    membership: "Premium",
    status: "Active",
    joined: "Jan 15, 2024",
    parent: "Robert Davis",
  },
  {
    id: 2,
    name: "Jack Wilson",
    avatar: "JW",
    age: 14,
    sport: "Basketball",
    coach: "Mike Johnson",
    membership: "Standard",
    status: "Active",
    joined: "Dec 20, 2023",
    parent: "Sarah Wilson",
  },
  {
    id: 3,
    name: "Sophie Miller",
    avatar: "SM",
    age: 10,
    sport: "Soccer",
    coach: "Sarah Wilson",
    membership: "Premium",
    status: "Active",
    joined: "Feb 1, 2024",
    parent: "Tom Miller",
  },
  {
    id: 4,
    name: "Lucas Brown",
    avatar: "LB",
    age: 13,
    sport: "Tennis",
    coach: "David Lee",
    membership: "Standard",
    status: "Inactive",
    joined: "Nov 5, 2023",
    parent: "Mike Brown",
  },
]

const memberStats = [
  { label: "Total Members", value: "450", icon: Users, color: "from-blue-500 to-blue-600" },
  { label: "Active", value: "420", icon: UserCheck, color: "from-green-500 to-green-600" },
  { label: "New This Month", value: "28", icon: Clock, color: "from-teal-500 to-teal-600" },
  { label: "Expiring Soon", value: "15", icon: AlertCircle, color: "from-yellow-500 to-orange-500" },
]

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Members</h1>
          <p className="text-muted-foreground">Manage club members and their details</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {memberStats.map((stat) => (
          <Card key={stat.label} className="glass-card border-white/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Members Table */}
      <Card className="glass-card border-white/20">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>All Members</CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 glass-input rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent focus-visible:ring-0 p-0 h-auto w-48"
                />
              </div>
              <Button variant="outline" size="icon" className="glass-subtle border-white/20 bg-transparent">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl overflow-hidden border border-white/20">
            <Table>
              <TableHeader>
                <TableRow className="bg-white/10 hover:bg-white/10">
                  <TableHead>Member</TableHead>
                  <TableHead>Sport</TableHead>
                  <TableHead>Coach</TableHead>
                  <TableHead>Membership</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Parent/Guardian</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id} className="hover:bg-white/10">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={`/.jpg?height=40&width=40&query=${member.name} child`}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white text-sm">
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">Age: {member.age}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.sport}</TableCell>
                    <TableCell>{member.coach}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          member.membership === "Premium"
                            ? "border-yellow-500/50 text-yellow-600"
                            : "border-blue-500/50 text-blue-500"
                        }
                      >
                        {member.membership}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          member.status === "Active" ? "bg-green-500/20 text-green-600" : "bg-red-500/20 text-red-600"
                        }
                      >
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{member.parent}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass-card border-white/20">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>View Progress</DropdownMenuItem>
                          <DropdownMenuItem>Edit Details</DropdownMenuItem>
                          <DropdownMenuItem>Contact Parent</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Remove Member</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
