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
  Trash2,
} from "lucide-react"
import { adminService, type AdminRole, type PermissionMatrixRow } from "@/lib/services/adminService"
import { RoleDialog } from "@/components/admin/RoleDialog"
import { useToast } from "@/hooks/use-toast"

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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<AdminRole | undefined>(undefined)
  const { toast } = useToast()

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

  const handleCreateRole = async (roleData: any) => {
    try {
      await adminService.createRole(roleData)
      toast({
        title: "Success",
        description: "Role created successfully",
      })
      fetchRoles()
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error('Error creating role:', error)
      toast({
        title: "Error",
        description: "Failed to create role",
        variant: "destructive",
      })
    }
  }

  const handleUpdateRole = async (roleData: any) => {
    if (!editingRole) return

    try {
      await adminService.updateRole(editingRole.id, roleData)
      toast({
        title: "Success",
        description: "Role updated successfully",
      })
      fetchRoles()
      setEditingRole(undefined)
    } catch (error) {
      console.error('Error updating role:', error)
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      })
    }
  }

  const handleDeleteRole = async (roleId: number) => {
    if (!confirm('Are you sure you want to delete this role? This action cannot be undone.')) return

    try {
      await adminService.deleteRole(roleId)
      toast({
        title: "Success",
        description: "Role deleted successfully",
      })
      fetchRoles()
    } catch (error) {
      console.error('Error deleting role:', error)
      toast({
        title: "Error",
        description: "Failed to delete role",
        variant: "destructive",
      })
    }
  }

  const availablePermissions = permissionsMatrix.map(row => row.permission)

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
        <Button 
          className="gradient-primary text-white"
          onClick={() => setIsCreateDialogOpen(true)}
        >
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
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setEditingRole(role)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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

          <RoleDialog 
            isOpen={isCreateDialogOpen}
            onClose={() => setIsCreateDialogOpen(false)}
            onSave={handleCreateRole}
            availablePermissions={availablePermissions}
          />

          <RoleDialog 
            isOpen={!!editingRole}
            onClose={() => setEditingRole(undefined)}
            onSave={handleUpdateRole}
            role={editingRole}
            availablePermissions={availablePermissions}
          />
        </>
      )}
    </div>
  )
}
