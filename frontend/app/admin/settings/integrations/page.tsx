"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plug, Plus, Settings, Trash2, CreditCard, Calendar, Video, Mail, MessageSquare } from "lucide-react"
import { adminIntegrations } from "@/lib/services/mockDataService"

const integrationIcons: Record<string, typeof Plug> = {
  stripe: CreditCard,
  google: Calendar,
  zoom: Video,
  mailchimp: Mail,
  slack: MessageSquare,
}

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Integrations</h1>
          <p className="text-muted-foreground">Manage third-party integrations</p>
        </div>
        <Button className="gradient-primary text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Integration
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminIntegrations.map((integration) => {
          const Icon = integrationIcons[integration.icon] || Plug
          const isConnected = integration.status === "Connected"
          
          return (
            <Card key={integration.id} className="glass-card border-white/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isConnected ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
                      <Icon className={`w-6 h-6 ${isConnected ? 'text-green-500' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{integration.name}</h3>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge className={isConnected ? "bg-green-500/20 text-green-600" : "bg-gray-500/20 text-gray-500"}>
                    {integration.status}
                  </Badge>
                  <div className="flex items-center gap-2">
                    {isConnected ? (
                      <>
                        <Button variant="ghost" size="icon"><Settings className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
                      </>
                    ) : (
                      <Button size="sm" className="gradient-primary text-white">Connect</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
