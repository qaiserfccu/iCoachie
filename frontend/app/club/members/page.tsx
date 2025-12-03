"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  Loader2,
  AlertCircle,
  UserCheck,
  UserX,
  FileText,
  CreditCard,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import clubMembersService, { Member } from "@/lib/services/clubMembersService"
import { useToast } from "@/components/ui/use-toast"

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchMembers()
  }, [])

  async function fetchMembers() {
    try {
      setLoading(true)
      setError(null)
      const data = await clubMembersService.getMembers()
      setMembers(data)
    } catch (err) {
      console.error('Failed to fetch members:', err)
      setError('Failed to load members. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || member.status === statusFilter

    return matchesSearch && matchesStatus
  })

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
          <Button onClick={fetchMembers}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Members</h1>
          <p className="text-muted-foreground">Manage your club members</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search members..." 
            className="pl-9 glass-subtle border-white/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className={`glass-subtle border-white/20 ${statusFilter === 'all' ? 'bg-white/10' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          <Button 
            variant="outline" 
            className={`glass-subtle border-white/20 ${statusFilter === 'active' ? 'bg-white/10' : ''}`}
            onClick={() => setStatusFilter('active')}
          >
            Active
          </Button>
          <Button 
            variant="outline" 
            className={`glass-subtle border-white/20 ${statusFilter === 'inactive' ? 'bg-white/10' : ''}`}
            onClick={() => setStatusFilter('inactive')}
          >
            Inactive
          </Button>
        </div>
      </div>

      {/* Members Table */}
      <Card className="glass-card border-white/20">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead>Member</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id} className="border-white/10 hover:bg-white/5">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border border-white/10">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.user.email}`} />
                        <AvatarFallback>{member.user.firstName[0]}{member.user.lastName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.user.firstName} {member.user.lastName}</div>
                        <div className="text-xs text-muted-foreground">ID: {member.id.slice(0, 8)}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      member.status === 'active' 
                        ? "text-green-500 border-green-500/30 bg-green-500/10" 
                        : "text-gray-500 border-gray-500/30 bg-gray-500/10"
                    }>
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        <span>{member.user.email}</span>
                      </div>
                      {member.user.phoneNumber && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          <span>{member.user.phoneNumber}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span>{new Date(member.createdAt).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {new Date(member.updatedAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 glass-card border-white/20">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <FileText className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Payment History
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {member.status === 'active' ? (
                          <DropdownMenuItem className="text-red-500 focus:text-red-500">
                            <UserX className="w-4 h-4 mr-2" />
                            Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-500 focus:text-green-500">
                            <UserCheck className="w-4 h-4 mr-2" />
                            Activate
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
