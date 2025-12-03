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

interface CoachVerification {
  id: number
  name: string
  email: string
  specialty: string
  submittedDate: string
  documents: string[]
  avatar: string
}

export default function CoachVerificationsPage() {
  const [coaches, setCoaches] = useState<CoachVerification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCoachVerifications()
  }, [])

  async function fetchCoachVerifications() {
    setIsLoading(true)
    setError(null)
    try {
      const response = await adminService.getCoachVerifications()
      setCoaches(response.coaches)
    } catch (err) {
      console.error('Error fetching coach verifications:', err)
      setError('Failed to load coach verifications. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = (coachId: number, coachName: string) => {
    toast.success(`Coach Verified`, {
      description: `${coachName} has been verified successfully.`
    })
    setCoaches(prev => prev.filter(c => c.id !== coachId))
  }

  const handleReject = (coachId: number, coachName: string) => {
    toast.error(`Verification Rejected`, {
      description: `${coachName}'s verification has been rejected.`
    })
    setCoaches(prev => prev.filter(c => c.id !== coachId))
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-destructive" />
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchCoachVerifications}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Coach Verifications</h1>
          <p className="text-muted-foreground">Review and verify coach applications</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="glass-subtle border-white/20 bg-transparent"
            onClick={fetchCoachVerifications}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Badge className="bg-yellow-500/20 text-yellow-600 text-lg px-4 py-2">
            {coaches.length} Pending
          </Badge>
        </div>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle>Pending Verifications</CardTitle>
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
                    <TableHead>Coach</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coaches.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No pending coach verifications
                      </TableCell>
                    </TableRow>
                  ) : (
                    coaches.map((coach) => (
                      <TableRow key={coach.id} className="hover:bg-white/10">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-gradient-to-br from-teal-500 to-green-500 text-white">
                                {coach.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{coach.name}</p>
                              <p className="text-sm text-muted-foreground">{coach.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{coach.specialty}</TableCell>
                        <TableCell className="text-muted-foreground">{coach.submittedDate}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {coach.documents.map((doc) => (
                              <Badge key={doc} variant="outline" className="text-xs">
                                <FileText className="w-3 h-3 mr-1" />
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-green-500 hover:text-green-600"
                              onClick={() => handleApprove(coach.id, coach.name)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-500 hover:text-red-600"
                              onClick={() => handleReject(coach.id, coach.name)}
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
