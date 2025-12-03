"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, XCircle, Eye, FileText, MapPin, Loader2, AlertTriangle, RefreshCw } from "lucide-react"
import { adminService } from "@/lib/services/adminService"
import { toast } from "sonner"

interface PendingClub {
  id: number
  name: string
  location: string
  owner: string
  submittedDate: string
  documents: number
  logo: string
}

export default function PendingClubsPage() {
  const [clubs, setClubs] = useState<PendingClub[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPendingClubs()
  }, [])

  async function fetchPendingClubs() {
    setIsLoading(true)
    setError(null)
    try {
      const response = await adminService.getPendingClubs()
      setClubs(response.clubs)
    } catch (err) {
      console.error('Error fetching pending clubs:', err)
      setError('Failed to load pending clubs. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = (clubId: number, clubName: string) => {
    toast.success(`Club Approved`, {
      description: `${clubName} has been approved successfully.`
    })
    setClubs(prev => prev.filter(c => c.id !== clubId))
  }

  const handleReject = (clubId: number, clubName: string) => {
    toast.error(`Club Rejected`, {
      description: `${clubName} has been rejected.`
    })
    setClubs(prev => prev.filter(c => c.id !== clubId))
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-destructive" />
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchPendingClubs}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pending Clubs</h1>
          <p className="text-muted-foreground">Review and approve club registrations</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="glass-subtle border-white/20 bg-transparent"
            onClick={fetchPendingClubs}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Badge className="bg-yellow-500/20 text-yellow-600 text-lg px-4 py-2">
            {clubs.length} Pending
          </Badge>
        </div>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle>Pending Club Registrations</CardTitle>
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
                    <TableHead>Club</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clubs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No pending club registrations
                      </TableCell>
                    </TableRow>
                  ) : (
                    clubs.map((club) => (
                      <TableRow key={club.id} className="hover:bg-white/10">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white">
                                {club.logo}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{club.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {club.location}
                          </div>
                        </TableCell>
                        <TableCell>{club.owner}</TableCell>
                        <TableCell className="text-muted-foreground">{club.submittedDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span>{club.documents} files</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-green-500 hover:text-green-600"
                              onClick={() => handleApprove(club.id, club.name)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-500 hover:text-red-600"
                              onClick={() => handleReject(club.id, club.name)}
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
