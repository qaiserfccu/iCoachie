"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, UserPlus, MoreVertical, Download, Users, UserCheck, Clock, AlertCircle, Loader2 } from "lucide-react"
import { clubAdminService, type ClubMember, type ClubMemberStats } from "@/lib/services"

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [members, setMembers] = useState<ClubMember[]>([])
  const [stats, setStats] = useState<ClubMemberStats | null>(null)

  useEffect(() => {
    loadMembersData()
  }, [])

  async function loadMembersData() {
    try {
      setLoading(true)
      setError(null)
      
      const [membersData, statsData] = await Promise.all([
        clubAdminService.getMembers({ pageSize: 50 }),
        clubAdminService.getMemberStats()
      ])
      
      setMembers(membersData.data)
      setStats(statsData)
    } catch (err) {
      console.error('Error loading members data:', err)
      setError('Failed to load members data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredMembers = members.filter(member => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    const fullName = `${member.firstName} ${member.lastName}`.toLowerCase()
    return fullName.includes(query) || 
           member.email.toLowerCase().includes(query) ||
           member.sport.toLowerCase().includes(query) ||
           member.coach.toLowerCase().includes(query)
  })

  const memberStats = [
    { title: "Total Members", value: stats?.totalMembers.toString() || "0", icon: Users, color: "from-blue-500 to-blue-600" },
    { title: "Active", value: stats?.activeMembers.toString() || "0", icon: UserCheck, color: "from-green-500 to-green-600" },
    { title: "New This Month", value: stats?.newThisMonth.toString() || "0", icon: Clock, color: "from-yellow-500 to-orange-500" },
    { title: "Pending Renewal", value: stats?.expiringSoon.toString() || "0", icon: AlertCircle, color: "from-red-500 to-red-600" },
  ]

  const getAge = (dateOfBirth: string | null): string => {
    if (!dateOfBirth) return 'N/A'
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age.toString()
  }

  const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={loadMembersData}>Try Again</Button>
      </div>
    )
  }

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
          <Card key={stat.title} className="glass-card border-white/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
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
            {filteredMembers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'No members found matching your search.' : 'No members found. Add your first member!'}
              </div>
            ) : (
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
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id} className="hover:bg-white/10">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={`/.jpg?height=40&width=40&query=${member.firstName} ${member.lastName} child`}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white text-sm">
                              {getInitials(member.firstName, member.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.firstName} {member.lastName}</p>
                            <p className="text-sm text-muted-foreground">Age: {getAge(member.dateOfBirth)}</p>
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
                      <TableCell>{member.parentName || 'N/A'}</TableCell>
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
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
