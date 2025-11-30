"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, MessageSquare, Calendar, Star, DollarSign } from "lucide-react"
import { useState, useEffect } from "react"
import { freelancerClientsService, FreelancerClient, ClientStats } from "@/lib/services/freelancerClientsService"
import { useLoading } from "@/lib/contexts/LoadingContext"
import { useError } from "@/lib/contexts/ErrorContext"

export default function ClientsPage() {
  const [clients, setClients] = useState<FreelancerClient[]>([])
  const [filteredClients, setFilteredClients] = useState<FreelancerClient[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const { setLoading } = useLoading()
  const { setError } = useError()

  useEffect(() => {
    const loadClientsData = async () => {
      try {
        setLoading(true)
        const clientsData = await freelancerClientsService.getFreelancerClients()
        setClients(clientsData)
        setFilteredClients(clientsData)
      } catch (error) {
        console.error('Error loading clients data:', error)
        setError('Failed to load clients data')
      } finally {
        setLoading(false)
      }
    }

    loadClientsData()
  }, [setLoading, setError])

  useEffect(() => {
    const searchClients = async () => {
      try {
        if (searchQuery.trim()) {
          const filtered = await freelancerClientsService.searchClients(searchQuery)
          setFilteredClients(filtered)
        } else {
          setFilteredClients(clients)
        }
      } catch (error) {
        console.error('Error searching clients:', error)
        setError('Failed to search clients')
      }
    }

    searchClients()
  }, [searchQuery, clients, setError])
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground">Manage your client relationships</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2 glass-input rounded-xl px-4 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
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

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="glass-card border-white/20 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={`/.jpg?key=5eabz&height=56&width=56&query=${client.name}`} />
                    <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white text-lg">
                      {client.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{client.name}</h3>
                    <div className="flex items-center gap-1">
                      {[...Array(client.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <Badge
                  className={
                    client.status === "Active" ? "bg-green-500/20 text-green-600" : "bg-gray-500/20 text-gray-500"
                  }
                >
                  {client.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{client.sessions} sessions</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="text-green-500 font-medium">${client.totalSpent}</span>
                </div>
              </div>

              <div className="text-sm text-muted-foreground mb-4 space-y-1">
                <p>Last session: {client.lastSession}</p>
                <p>Next: {client.nextSession}</p>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-white/20">
                <Button size="sm" variant="outline" className="flex-1 glass-subtle border-white/20 bg-transparent">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Message
                </Button>
                <Button size="sm" className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  <Calendar className="w-4 h-4 mr-1" />
                  Book
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
