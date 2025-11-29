"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Building2, UserCog, Briefcase, Users, Baby, Plus, Edit, Check, X } from "lucide-react"

const roles = [
  {
    id: 1,
    name: "Super Admin",
    icon: Shield,
    color: "from-red-500 to-orange-500",
    description: "Full system access with all permissions",
    users: 3,
    permissions: ["All Access"],
  },
  {
    id: 2,
    name: "Club Admin",
    icon: Building2,
    color: "from-blue-500 to-blue-600",
    description: "Manage club operations, coaches, and members",
    users: 284,
    permissions: ["Club Management", "Coach Management", "Member Management", "Payments", "Reports"],
  },
  {
    id: 3,
    name: "Coach",
    icon: UserCog,
    color: "from-teal-500 to-teal-600",
    description: "Manage sessions, attendance, and student progress",
    users: 1456,
    permissions: ["Schedule Management", "Attendance", "Progress Tracking", "Evaluations", "Messaging"],
  },
  {
    id: 4,
    name: "Freelancer",
    icon: Briefcase,
    color: "from-yellow-500 to-orange-500",
    description: "Independent coach with booking and payment features",
    users: 328,
    permissions: ["Profile Management", "Booking Management", "Payments", "Client Communication"],
  },
  {
    id: 5,
    name: "Parent",
    icon: Users,
    color: "from-green-500 to-green-600",
    description: "Manage kids, bookings, and view progress",
    users: 8542,
    permissions: ["Kid Management", "Booking", "Progress View", "Payments", "Messaging"],
  },
  {
    id: 6,
    name: "Kid",
    icon: Baby,
    color: "from-purple-500 to-purple-600",
    description: "Limited access to view schedules and progress",
    users: 2237,
    permissions: ["View Schedule", "View Progress", "View Badges"],
  },
]

const permissionMatrix = [
  {
    permission: "User Management",
    admin: true,
    clubAdmin: false,
    coach: false,
    freelancer: false,
    parent: false,
    kid: false,
  },
  {
    permission: "Club Management",
    admin: true,
    clubAdmin: true,
    coach: false,
    freelancer: false,
    parent: false,
    kid: false,
  },
  {
    permission: "Coach Management",
    admin: true,
    clubAdmin: true,
    coach: false,
    freelancer: false,
    parent: false,
    kid: false,
  },
  {
    permission: "Session Management",
    admin: true,
    clubAdmin: true,
    coach: true,
    freelancer: true,
    parent: false,
    kid: false,
  },
  {
    permission: "Attendance Tracking",
    admin: true,
    clubAdmin: true,
    coach: true,
    freelancer: true,
    parent: false,
    kid: false,
  },
  {
    permission: "Progress & Evaluation",
    admin: true,
    clubAdmin: true,
    coach: true,
    freelancer: true,
    parent: true,
    kid: true,
  },
  {
    permission: "Payment Processing",
    admin: true,
    clubAdmin: true,
    coach: false,
    freelancer: true,
    parent: true,
    kid: false,
  },
  {
    permission: "Reports & Analytics",
    admin: true,
    clubAdmin: true,
    coach: true,
    freelancer: true,
    parent: false,
    kid: false,
  },
  { permission: "Messaging", admin: true, clubAdmin: true, coach: true, freelancer: true, parent: true, kid: false },
]

export default function RolesPage() {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <Card key={role.id} className="glass-card border-white/20 hover-lift">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center`}
                >
                  <role.icon className="w-6 h-6 text-white" />
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
        ))}
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
                  <th className="text-center py-3 px-4 font-medium">Admin</th>
                  <th className="text-center py-3 px-4 font-medium">Club Admin</th>
                  <th className="text-center py-3 px-4 font-medium">Coach</th>
                  <th className="text-center py-3 px-4 font-medium">Freelancer</th>
                  <th className="text-center py-3 px-4 font-medium">Parent</th>
                  <th className="text-center py-3 px-4 font-medium">Kid</th>
                </tr>
              </thead>
              <tbody>
                {permissionMatrix.map((row) => (
                  <tr key={row.permission} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-4">{row.permission}</td>
                    <td className="text-center py-3 px-4">
                      {row.admin ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {row.clubAdmin ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {row.coach ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {row.freelancer ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {row.parent ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {row.kid ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
