"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Copy, Edit, Eye, Trash2 } from "lucide-react"

const templates = [
  { id: 1, name: "Welcome Email", type: "email", category: "Onboarding", lastUsed: "Jan 12", usageCount: 45 },
  { id: 2, name: "Session Reminder", type: "email", category: "Notifications", lastUsed: "Jan 15", usageCount: 120 },
  { id: 3, name: "Payment Receipt", type: "email", category: "Billing", lastUsed: "Jan 14", usageCount: 89 },
  { id: 4, name: "Monthly Newsletter", type: "newsletter", category: "Marketing", lastUsed: "Jan 1", usageCount: 12 },
  { id: 5, name: "Event Announcement", type: "announcement", category: "Events", lastUsed: "Jan 10", usageCount: 23 },
  { id: 6, name: "Progress Report", type: "document", category: "Reports", lastUsed: "Jan 8", usageCount: 67 },
]

const typeColors = {
  email: "bg-blue-500/20 text-blue-500",
  newsletter: "bg-purple-500/20 text-purple-500",
  announcement: "bg-orange-500/20 text-orange-500",
  document: "bg-green-500/20 text-green-500",
}

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Templates</h1>
          <p className="text-muted-foreground">Manage reusable content templates</p>
        </div>
        <Button className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Templates</p>
              <p className="text-2xl font-bold">{templates.length}</p>
            </div>
            <FileText className="w-8 h-8 text-violet-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Email Templates</p>
              <p className="text-2xl font-bold text-blue-500">{templates.filter(t => t.type === "email").length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Usage</p>
              <p className="text-2xl font-bold text-green-500">{templates.reduce((sum, t) => sum + t.usageCount, 0)}</p>
            </div>
            <Copy className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Categories</p>
              <p className="text-2xl font-bold text-purple-500">{new Set(templates.map(t => t.category)).size}</p>
            </div>
            <FileText className="w-8 h-8 text-purple-500" />
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">All Templates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {templates.map((template) => (
            <div key={template.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-violet-500" />
                </div>
                <div>
                  <p className="font-medium">{template.name}</p>
                  <p className="text-sm text-muted-foreground">{template.category} • Last used: {template.lastUsed}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{template.usageCount} uses</span>
                <Badge className={typeColors[template.type as keyof typeof typeColors]}>{template.type}</Badge>
                <Button size="sm" variant="ghost" className="text-blue-500">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-violet-500">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-green-500">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
