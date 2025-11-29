"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Filter,
  MoreVertical,
  UserPlus,
  Download,
  Mail,
  Shield,
  Ban,
  Eye,
  Edit,
  Trash2,
  Users,
  UserCog,
  Building2,
  Baby,
} from "lucide-react"

const users = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    role: "Coach",
    status: "Active",
    joined: "Jan 15, 2024",
    avatar: "JS",
  },
  {
    id: 2,
    name: "Champions FC",
    email: "admin@championsfc.com",
    role: "Club Admin",
    status: "Active",
    joined: "Dec 20, 2023",
    avatar: "CF",
  },
  {
    id: 3,
    name: "Sarah Wilson",
    email: "sarah.w@email.com",
    role: "Parent",
    status: "Active",
    joined: "Feb 1, 2024",
    avatar: "SW",
  },
  {
    id: 4,
    name: "Mike Johnson",
    email: "mike.j@email.com",
    role: "Freelancer",
    status: "Pending",
    joined: "Feb 10, 2024",
    avatar: "MJ",
  },
  {
    id: 5,
    name: "Elite Academy",
    email: "contact@eliteacademy.com",
    role: "Club Admin",
    status: "Suspended",
    joined: "Nov 5, 2023",
    avatar: "EA",
  },
  {
    id: 6,
    name: "Emma Davis",
    email: "emma.d@email.com",
    role: "Kid",
    status: "Active",
    joined: "Jan 28, 2024",
    avatar: "ED",
  },
]

const roleStats = [
  { role: "Club Admins", count: 284, icon: Building2, color: "from-blue-500 to-blue-600" },
  { role: "Coaches", count: 1456, icon: UserCog, color: "from-teal-500 to-teal-600" },
  { role: "Freelancers", count: 328, icon: Users, color: "from-yellow-500 to-orange-500" },
  { role: "Parents & Kids", count: 10779, icon: Baby, color: "from-green-500 to-green-600" },
]

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage all platform users</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="gradient-primary text-white">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Role Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {roleStats.map((stat) => (
          <Card key={stat.role} className="glass-card border-white/20 hover-lift cursor-pointer">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.count.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{stat.role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Users Table */}
      <Card className="glass-card border-white/20">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>All Users</CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 glass-input rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
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
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-white/10">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={`/.jpg?height=40&width=40&query=${user.name} avatar`}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-sm">
                            {user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.role === "Club Admin"
                            ? "border-blue-500/50 text-blue-500"
                            : user.role === "Coach"
                              ? "border-teal-500/50 text-teal-500"
                              : user.role === "Freelancer"
                                ? "border-yellow-500/50 text-yellow-600"
                                : user.role === "Parent"
                                  ? "border-green-500/50 text-green-500"
                                  : "border-purple-500/50 text-purple-500"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.status === "Active"
                            ? "bg-green-500/20 text-green-600"
                            : user.status === "Pending"
                              ? "bg-yellow-500/20 text-yellow-600"
                              : "bg-red-500/20 text-red-600"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.joined}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass-card border-white/20">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="w-4 h-4 mr-2" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-yellow-600">
                            <Ban className="w-4 h-4 mr-2" />
                            Suspend User
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
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
