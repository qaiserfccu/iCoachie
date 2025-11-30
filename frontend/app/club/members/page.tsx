"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, UserPlus, MoreVertical, Download, Users, UserCheck, Clock, AlertCircle } from "lucide-react"
import { useLoading } from "@/lib/contexts/LoadingContext"
import { useError } from "@/lib/contexts/ErrorContext"
import clubMembersService, { Member, MemberStats } from "@/lib/services/clubMembersService"

const memberStats = [
  { label: "Total Members", value: "0", icon: Users, color: "from-blue-500 to-blue-600" },
  { label: "Active", value: "0", icon: UserCheck, color: "from-green-500 to-green-600" },
  { label: "New This Month", value: "0", icon: Clock, color: "from-teal-500 to-teal-600" },
  { label: "Expiring Soon", value: "0", icon: AlertCircle, color: "from-yellow-500 to-orange-500" },
]

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [stats, setStats] = useState<MemberStats | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { showLoading, hideLoading } = useLoading()
  const { showError } = useError()

  useEffect(() => {
    fetchMembers()
    fetchMemberStats()
  }, [])

  useEffect(() => {
    const filtered = members.filter(member =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.coach.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredMembers(filtered)
  }, [members, searchQuery])

  const fetchMembers = async () => {
    try {
      showLoading("Loading members...")
      const data = await clubMembersService.getMembers()
      setMembers(data)
    } catch (error) {
      showError("Failed to load members")
      console.error("Error fetching members:", error)
    } finally {
      hideLoading()
    }
  }

  const fetchMemberStats = async () => {
    try {
      const data = await clubMembersService.getMemberStats()
      setStats(data)
    } catch (error) {
      console.error("Error fetching member stats:", error)
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getDisplayStats = () => {
    if (!stats) return memberStats
    return [
      { label: "Total Members", value: stats.totalMembers.toString(), icon: Users, color: "from-blue-500 to-blue-600" },
      { label: "Active", value: stats.activeMembers.toString(), icon: UserCheck, color: "from-green-500 to-green-600" },
      { label: "New This Month", value: stats.newThisMonth.toString(), icon: Clock, color: "from-teal-500 to-teal-600" },
      { label: "Expiring Soon", value: stats.expiringSoon.toString(), icon: AlertCircle, color: "from-yellow-500 to-orange-500" },
    ]
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
        {getDisplayStats().map((stat) => (
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
                {filteredMembers.map((member) => (
                  <TableRow key={member.id} className="hover:bg-white/10">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white text-sm">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Age: {member.age || 'N/A'}
                          </p>
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
                    <TableCell>{member.parent || 'Not specified'}</TableCell>
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

      {filteredMembers.length === 0 && members.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No members found</h3>
          <p className="text-muted-foreground mb-4">Get started by adding your first member to the club.</p>
          <Button className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>
      )}

      {filteredMembers.length === 0 && members.length > 0 && searchQuery && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No members match your search</h3>
          <p className="text-muted-foreground">Try adjusting your search terms or filters.</p>
        </div>
      )}
    </div>
  )
}
