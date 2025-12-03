"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Edit, 
  Check, 
  X, 
  Loader2, 
  AlertTriangle,
  Shield,
  Building2,
  UserCog,
  Briefcase,
  Users,
  Baby,
  HeadphonesIcon,
} from "lucide-react"
import { adminService, type AdminRole, type PermissionMatrixRow } from "@/lib/services/adminService"

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  Building2,
  UserCog,
  Briefcase,
  Users,
  Baby,
  HeadphonesIcon,
}

export default function RolesPage() {
  const [roles, setRoles] = useState<AdminRole[]>([])
  const [permissionsMatrix, setPermissionsMatrix] = useState<PermissionMatrixRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRoles()
  }, [])

  async function fetchRoles() {
    setIsLoading(true)
    setError(null)
    try {
      const response = await adminService.getRoles()
      setRoles(response.roles)
      setPermissionsMatrix(response.permissionsMatrix)
    } catch (err) {
      console.error('Error fetching roles:', err)
      setError('Failed to load roles. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-destructive" />
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => fetchRoles()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Roles & Permissions</h1>
          <p className="text-muted-foreground">Manage user roles and access permissions</p>
        </div>
        <Button className="gradient-primary text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Role
        </Button>
      </div>

      {/* Roles Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => {
              const IconComponent = iconMap[role.icon] || Users
              return (
                <Card key={role.id} className="glass-card border-white/20 hover-lift">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardTitle className="mt-3">{role.name}</CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">Active Users</span>
                      <Badge variant="secondary" className="bg-primary/20 text-primary">
                        {role.users.toLocaleString()}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Key Permissions:</p>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.slice(0, 3).map((perm) => (
                          <Badge key={perm} variant="outline" className="text-xs border-white/30">
                            {perm}
                          </Badge>
                        ))}
                        {role.permissions.length > 3 && (
                          <Badge variant="outline" className="text-xs border-white/30">
                            +{role.permissions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Permission Matrix */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle>Permission Matrix</CardTitle>
              <CardDescription>Overview of permissions by role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4 font-medium">Permission</th>
                      {roles.slice(0, 6).map((role) => (
                        <th key={role.code} className="text-center py-3 px-4 font-medium">
                          {role.name.split(' ')[0]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {permissionsMatrix.map((row) => (
                      <tr key={row.permission} className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-3 px-4">{row.permission}</td>
                        {roles.slice(0, 6).map((role) => {
                          const hasPermission = row[role.code.toLowerCase()] === true
                          return (
                            <td key={role.code} className="text-center py-3 px-4">
                              {hasPermission ? (
                                <Check className="w-5 h-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-red-400 mx-auto" />
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
