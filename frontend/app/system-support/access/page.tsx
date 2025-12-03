"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search, Shield, Users, UserCheck, Key, 
  ChevronRight, Loader2, Edit, Eye
} from "lucide-react"
import { useState, useEffect } from "react"
import { systemSupportService, type AccessRole } from "@/lib/services"
import Link from "next/link"

const scopeColors: Record<string, string> = {
  GLOBAL: "bg-red-500/20 text-red-500",
  CLUB: "bg-blue-500/20 text-blue-500",
  FACILITY: "bg-green-500/20 text-green-500",
  VENUE: "bg-purple-500/20 text-purple-500",
  INDEPENDENT: "bg-orange-500/20 text-orange-500",
  USER: "bg-gray-500/20 text-gray-500",
}

export default function AccessManagementPage() {
  const [roles, setRoles] = useState<AccessRole[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [summary, setSummary] = useState({ totalUsers: 0, activeToday: 0, roles: 0 })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await systemSupportService.getAccessManagement()
        setRoles(data.roles)
        setSummary(data.summary)
      } catch (err) {
        console.error('Error fetching access data:', err)
        setError('Failed to load access management data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
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
          <h1 className="text-2xl font-bold text-foreground">Access Management</h1>
          <p className="text-muted-foreground">Manage roles and permissions</p>
        </div>
        <Link href="/system-support/users">
          <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
            <Users className="w-4 h-4 mr-2" />
            View Users
          </Button>
        </Link>
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
              <p className="text-2xl font-bold">{summary.totalUsers.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Today</p>
              <p className="text-2xl font-bold">{summary.activeToday}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Roles</p>
              <p className="text-2xl font-bold">{summary.roles}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Security Level</p>
              <p className="text-2xl font-bold">High</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Key className="w-6 h-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="glass-card border-white/20">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search roles by name or code..."
              className="pl-10 glass-subtle border-white/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Roles List */}
      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">System Roles ({filteredRoles.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredRoles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No roles found matching your criteria
            </div>
          ) : (
            filteredRoles.map((role) => (
              <div
                key={role.id}
                className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{role.name}</span>
                      <Badge className="bg-gray-500/20 text-gray-500 text-xs">
                        {role.code}
                      </Badge>
                      {role.scope && (
                        <Badge className={scopeColors[role.scope] || "bg-gray-500/20 text-gray-500"}>
                          {role.scope}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {role.description || `${role.name} role with standard permissions`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {role.userCount} users assigned
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" className="text-blue-500" title="View Permissions">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-purple-500" title="Edit Role">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-muted-foreground">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Permission Overview */}
      <Card className="glass-card border-white/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Permission Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "User Management", count: 3, color: "from-blue-500 to-blue-600" },
              { label: "Club Management", count: 4, color: "from-green-500 to-emerald-500" },
              { label: "Session Control", count: 5, color: "from-purple-500 to-indigo-500" },
              { label: "Payment Access", count: 3, color: "from-orange-500 to-red-500" },
              { label: "Reports View", count: 6, color: "from-teal-500 to-teal-600" },
              { label: "System Admin", count: 2, color: "from-red-500 to-red-600" },
            ].map((perm) => (
              <div
                key={perm.label}
                className="p-4 rounded-xl glass-subtle text-center"
              >
                <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${perm.color} flex items-center justify-center mb-2`}>
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <p className="font-bold text-lg">{perm.count}</p>
                <p className="text-xs text-muted-foreground">{perm.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
