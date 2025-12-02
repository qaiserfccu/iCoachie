"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Search, Filter, Users, UserCheck, UserX, Key, 
  Mail, Shield, MoreVertical, ArrowRight, RefreshCw
} from "lucide-react"
import { useState } from "react"

const users = [
  { id: "USR-001", name: "John Smith", email: "john.smith@email.com", role: "Parent", status: "active", lastLogin: "2 hours ago", avatar: "JS" },
  { id: "USR-002", name: "Sarah Wilson", email: "sarah.w@email.com", role: "Coach", status: "active", lastLogin: "1 hour ago", avatar: "SW" },
  { id: "USR-003", name: "Mike Johnson", email: "mike.j@email.com", role: "Student", status: "locked", lastLogin: "5 days ago", avatar: "MJ" },
  { id: "USR-004", name: "Elite Sports Academy", email: "admin@elitesports.com", role: "Academy Owner", status: "active", lastLogin: "30 min ago", avatar: "ES" },
  { id: "USR-005", name: "Lisa Garcia", email: "lisa.garcia@email.com", role: "Parent", status: "inactive", lastLogin: "2 weeks ago", avatar: "LG" },
  { id: "USR-006", name: "David Brown", email: "david.b@email.com", role: "Coach", status: "active", lastLogin: "3 hours ago", avatar: "DB" },
  { id: "USR-007", name: "Emma Davis", email: "emma.d@email.com", role: "Accountant", status: "active", lastLogin: "4 hours ago", avatar: "ED" },
  { id: "USR-008", name: "James Miller", email: "james.m@email.com", role: "Front Desk", status: "suspended", lastLogin: "1 month ago", avatar: "JM" },
]

const statusColors = {
  active: "bg-green-500/20 text-green-500",
  inactive: "bg-gray-500/20 text-gray-500",
  locked: "bg-red-500/20 text-red-500",
  suspended: "bg-orange-500/20 text-orange-500",
}

const roleColors = {
  "Parent": "bg-blue-500/20 text-blue-500",
  "Coach": "bg-purple-500/20 text-purple-500",
  "Student": "bg-green-500/20 text-green-500",
  "Academy Owner": "bg-orange-500/20 text-orange-500",
  "Accountant": "bg-emerald-500/20 text-emerald-500",
  "Front Desk": "bg-cyan-500/20 text-cyan-500",
}

export default function UserSupportPage() {
  const [searchQuery, setSearchQuery] = useState("")
  
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeCount = users.filter(u => u.status === "active").length
  const lockedCount = users.filter(u => u.status === "locked").length
  const suspendedCount = users.filter(u => u.status === "suspended").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Support</h1>
          <p className="text-muted-foreground">Search and manage user accounts</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="glass-subtle border-white/20">
            <Shield className="w-4 h-4 mr-2" />
            Bulk Actions
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">{activeCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Locked</p>
              <p className="text-2xl font-bold">{lockedCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <Key className="w-6 h-6 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Suspended</p>
              <p className="text-2xl font-bold">{suspendedCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <UserX className="w-6 h-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="glass-card border-white/20">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or user ID..."
                className="pl-10 glass-subtle border-white/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="glass-subtle border-white/20">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">User Accounts ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{user.name}</p>
                    <Badge className={roleColors[user.role as keyof typeof roleColors] || "bg-gray-500/20 text-gray-500"}>
                      {user.role}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground">ID: {user.id} • Last login: {user.lastLogin}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={statusColors[user.status as keyof typeof statusColors]}>
                  {user.status}
                </Badge>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="text-purple-500" title="Reset Password">
                    <Key className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-blue-500" title="Send Email">
                    <Mail className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-muted-foreground">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="glass-card border-white/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Reset Password", icon: Key, color: "from-blue-500 to-blue-600" },
              { label: "Unlock Account", icon: RefreshCw, color: "from-green-500 to-emerald-500" },
              { label: "Send Verification", icon: Mail, color: "from-purple-500 to-indigo-500" },
              { label: "View Permissions", icon: Shield, color: "from-orange-500 to-red-500" },
            ].map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto p-4 flex-col gap-2 glass-subtle border-white/20 hover:bg-white/20"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
