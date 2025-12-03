"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, XCircle, Eye, FileText, Loader2, AlertTriangle, RefreshCw } from "lucide-react"
import { adminService } from "@/lib/services/adminService"
import { toast } from "sonner"

interface PendingUser {
  id: number
  name: string
  email: string
  role: string
  requestDate: string
  documents: number
  avatar: string
}

export default function PendingUsersPage() {
  const [users, setUsers] = useState<PendingUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPendingUsers()
  }, [])

  async function fetchPendingUsers() {
    setIsLoading(true)
    setError(null)
    try {
      const response = await adminService.getPendingUsers()
      setUsers(response.users)
    } catch (err) {
      console.error('Error fetching pending users:', err)
      setError('Failed to load pending users. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = (userId: number, userName: string) => {
    toast.success(`User Approved`, {
      description: `${userName} has been approved successfully.`
    })
    setUsers(prev => prev.filter(u => u.id !== userId))
  }

  const handleReject = (userId: number, userName: string) => {
    toast.error(`User Rejected`, {
      description: `${userName} has been rejected.`
    })
    setUsers(prev => prev.filter(u => u.id !== userId))
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-destructive" />
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchPendingUsers}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pending Approvals</h1>
          <p className="text-muted-foreground">Review and approve user registrations</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="glass-subtle border-white/20 bg-transparent"
            onClick={fetchPendingUsers}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Badge className="bg-yellow-500/20 text-yellow-600 text-lg px-4 py-2">
            {users.length} Pending
          </Badge>
        </div>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle>Pending User Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden border border-white/20">
              <Table>
                <TableHeader>
                  <TableRow className="bg-white/10 hover:bg-white/10">
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No pending user approvals
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-white/10">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
                                {user.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.requestDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span>{user.documents} files</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-green-500 hover:text-green-600"
                              onClick={() => handleApprove(user.id, user.name)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-500 hover:text-red-600"
                              onClick={() => handleReject(user.id, user.name)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
