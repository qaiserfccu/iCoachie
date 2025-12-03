"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreVertical, Briefcase, Star, Eye, Edit, Ban, DollarSign, Loader2, AlertTriangle } from "lucide-react"
import { adminService, type AdminFreelancer } from "@/lib/services/adminService"

export default function FreelancersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [freelancers, setFreelancers] = useState<AdminFreelancer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFreelancers()
  }, [searchQuery])

  async function fetchFreelancers() {
    setIsLoading(true)
    setError(null)
    try {
      const response = await adminService.getFreelancers({ search: searchQuery || undefined })
      setFreelancers(response.freelancers)
    } catch (err) {
      console.error('Error fetching freelancers:', err)
      setError('Failed to load freelancers. Please try again.')
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
          <Button onClick={() => fetchFreelancers()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Freelancers Management</h1>
          <p className="text-muted-foreground">Manage all platform freelancers</p>
        </div>
        <Button className="gradient-primary text-white">
          <Briefcase className="w-4 h-4 mr-2" />
          Add Freelancer
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 glass-input rounded-xl px-4 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search freelancers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0 p-0 h-auto"
          />
        </div>
        <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle>All Freelancers</CardTitle>
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
                    <TableHead>Freelancer</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Earnings</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {freelancers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No freelancers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    freelancers.map((freelancer) => (
                      <TableRow key={freelancer.id} className="hover:bg-white/10">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
                                {freelancer.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{freelancer.name}</p>
                              <p className="text-sm text-muted-foreground">{freelancer.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{freelancer.specialty}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span>{freelancer.rating.toFixed(1)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{freelancer.bookings}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-green-500">
                            <DollarSign className="w-4 h-4" />
                            {freelancer.earnings}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={freelancer.status === "Active" ? "bg-green-500/20 text-green-600" : "bg-yellow-500/20 text-yellow-600"}>
                            {freelancer.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass-card border-white/20">
                              <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />View Profile</DropdownMenuItem>
                              <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-yellow-600"><Ban className="w-4 h-4 mr-2" />Suspend</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
