"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, UserPlus, MoreVertical, Download, Users, UserCheck, Clock, AlertCircle, Loader2 } from "lucide-react"
import clubMembersService, { Member, MemberStats } from "@/lib/services/clubMembersService"

// Stats configuration for rendering
const statsConfig = [
  { key: 'totalMembers', title: 'Total Members', icon: Users, color: 'from-blue-500 to-blue-600' },
  { key: 'activeMembers', title: 'Active', icon: UserCheck, color: 'from-green-500 to-green-600' },
  { key: 'newThisMonth', title: 'New This Month', icon: Clock, color: 'from-yellow-500 to-orange-500' },
  { key: 'expiringSoon', title: 'Pending Renewal', icon: AlertCircle, color: 'from-red-500 to-red-600' },
]

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [members, setMembers] = useState<Member[]>([])
  const [stats, setStats] = useState<MemberStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMembersData() {
      try {
        setLoading(true)
        setError(null)

        const [membersData, statsData] = await Promise.all([
          clubMembersService.getMembers(),
          clubMembersService.getMemberStats(),
        ])

        setMembers(membersData)
        setStats(statsData)
      } catch (err) {
        console.error('Failed to fetch members data:', err)
        setError('Failed to load members data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchMembersData()
  }, [])

  // Filter members based on search query
  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.coach.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading members...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
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
          <Link href="/club/members/add">
            <Button className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsConfig.map((statConfig) => {
          const value = stats ? stats[statConfig.key as keyof MemberStats] : 0
          return (
            <Card key={statConfig.title} className="glass-card border-white/20">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${statConfig.color} flex items-center justify-center`}>
                  <statConfig.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-sm text-muted-foreground">{statConfig.title}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Members Table */}
      <Card className="glass-card border-white/20">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>All Members ({filteredMembers.length})</CardTitle>
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
          {filteredMembers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No members found</p>
              <p className="text-sm mt-1">
                {searchQuery ? 'Try adjusting your search query' : 'Add your first member to get started'}
              </p>
            </div>
          ) : (
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
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id} className="hover:bg-white/10">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={member.avatar || `/.jpg?height=40&width=40&query=${member.name} child`}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white text-sm">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            {member.age && <p className="text-sm text-muted-foreground">Age: {member.age}</p>}
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
                      <TableCell>{member.parent || '-'}</TableCell>
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
