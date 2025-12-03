"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreVertical, Baby, Users, Eye, Edit, Mail, DollarSign, Loader2, AlertTriangle } from "lucide-react"
import { adminService, type AdminFamily } from "@/lib/services/adminService"

export default function FamiliesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [families, setFamilies] = useState<AdminFamily[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFamilies()
  }, [searchQuery])

  async function fetchFamilies() {
    setIsLoading(true)
    setError(null)
    try {
      const response = await adminService.getFamilies({ search: searchQuery || undefined })
      setFamilies(response.families)
    } catch (err) {
      console.error('Error fetching families:', err)
      setError('Failed to load families. Please try again.')
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
          <Button onClick={() => fetchFamilies()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Parents & Kids</h1>
          <p className="text-muted-foreground">Manage parent accounts and their children</p>
        </div>
        <Button className="gradient-primary text-white">
          <Baby className="w-4 h-4 mr-2" />
          Add Family
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 glass-input rounded-xl px-4 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search families..."
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
          <CardTitle>All Families</CardTitle>
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
                    <TableHead>Parent</TableHead>
                    <TableHead>Kids</TableHead>
                    <TableHead>Active Sessions</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {families.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No families found
                      </TableCell>
                    </TableRow>
                  ) : (
                    families.map((family) => (
                      <TableRow key={family.id} className="hover:bg-white/10">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-500 text-white">
                                {family.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{family.parentName}</p>
                              <p className="text-sm text-muted-foreground">{family.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span>{family.kids}</span>
                          </div>
                        </TableCell>
                        <TableCell>{family.activeSessions}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-green-500">
                            <DollarSign className="w-4 h-4" />
                            {family.totalSpent}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{family.joined}</TableCell>
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
                              <DropdownMenuItem><Mail className="w-4 h-4 mr-2" />Send Email</DropdownMenuItem>
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
