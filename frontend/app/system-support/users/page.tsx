"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Search, Filter, Users, UserCheck, UserX, Key, 
  Mail, Shield, ArrowRight, RefreshCw, Loader2
} from "lucide-react"
import { useState, useEffect } from "react"
import { systemSupportService, type SupportUser } from "@/lib/services"
import Link from "next/link"

const statusColors = {
  Active: "bg-green-500/20 text-green-500",
  active: "bg-green-500/20 text-green-500",
  inactive: "bg-gray-500/20 text-gray-500",
  locked: "bg-red-500/20 text-red-500",
  suspended: "bg-orange-500/20 text-orange-500",
  Pending: "bg-yellow-500/20 text-yellow-500",
}

const roleColors: Record<string, string> = {
  "Parent": "bg-blue-500/20 text-blue-500",
  "Coach": "bg-purple-500/20 text-purple-500",
  "Student": "bg-green-500/20 text-green-500",
  "Club Admin": "bg-orange-500/20 text-orange-500",
  "Accountant": "bg-emerald-500/20 text-emerald-500",
  "Front Desk": "bg-cyan-500/20 text-cyan-500",
  "Super Admin": "bg-red-500/20 text-red-500",
  "System Support": "bg-purple-500/20 text-purple-500",
}

export default function UserSupportPage() {
  const [users, setUsers] = useState<SupportUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [totalUsers, setTotalUsers] = useState(0)
  const [resettingPassword, setResettingPassword] = useState<number | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await systemSupportService.searchUsers({
          search: searchQuery || undefined,
          pageSize: 50
        })
        setUsers(data.users)
        setTotalUsers(data.pageInfo.total)
      } catch (err) {
        console.error('Error fetching users:', err)
        setError('Failed to load users')
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchUsers, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  const handleResetPassword = async (userId: number) => {
    try {
      setResettingPassword(userId)
      const result = await systemSupportService.resetUserPassword(userId)
      alert(result.message)
    } catch (err) {
      console.error('Error resetting password:', err)
      alert('Failed to reset password')
    } finally {
      setResettingPassword(null)
    }
  }

  const activeCount = users.filter(u => u.status === "Active" || u.status === "active").length
  const lockedCount = users.filter(u => u.status === "locked").length
  const suspendedCount = users.filter(u => u.status === "suspended").length

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Support</h1>
          <p className="text-muted-foreground">Search and manage user accounts</p>
        </div>
        <div className="flex gap-3">
          <Link href="/system-support/access">
            <Button variant="outline" className="glass-subtle border-white/20">
              <Shield className="w-4 h-4 mr-2" />
              Access Management
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/20 text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{totalUsers}</p>
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
          <CardTitle className="text-lg font-semibold">User Accounts ({users.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users found matching your criteria
            </div>
          ) : (
            users.map((user) => (
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
                      <Badge className={roleColors[user.role] || "bg-gray-500/20 text-gray-500"}>
                        {user.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">ID: {user.id} • Last active: {user.lastActive}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={statusColors[user.status as keyof typeof statusColors] || "bg-gray-500/20 text-gray-500"}>
                    {user.status}
                  </Badge>
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-purple-500" 
                      title="Reset Password"
                      onClick={() => handleResetPassword(user.id)}
                      disabled={resettingPassword === user.id}
                    >
                      {resettingPassword === user.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Key className="w-4 h-4" />
                      )}
                    </Button>
                    <Button size="sm" variant="ghost" className="text-blue-500" title="Send Email">
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Link href={`/system-support/users/${user.id}`}>
                      <Button size="sm" variant="ghost" className="text-muted-foreground">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
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
              { label: "Reset Password", icon: Key, color: "from-blue-500 to-blue-600", href: "/system-support/users/passwords" },
              { label: "Unlock Account", icon: RefreshCw, color: "from-green-500 to-emerald-500", href: "/system-support/users/issues" },
              { label: "Send Verification", icon: Mail, color: "from-purple-500 to-indigo-500", href: "#" },
              { label: "View Permissions", icon: Shield, color: "from-orange-500 to-red-500", href: "/system-support/access" },
            ].map((action) => (
              <Link key={action.label} href={action.href}>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex-col gap-2 glass-subtle border-white/20 hover:bg-white/20 w-full"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
