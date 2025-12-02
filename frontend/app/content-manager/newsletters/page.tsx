"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Plus, Send, Eye, Users, Edit, Clock } from "lucide-react"

const newsletters = [
  { id: 1, title: "January 2024 Newsletter", status: "sent", recipients: 1250, openRate: "68%", sentDate: "Jan 15, 2024" },
  { id: 2, title: "Holiday Special Edition", status: "sent", recipients: 1180, openRate: "72%", sentDate: "Dec 20, 2023" },
  { id: 3, title: "February Preview", status: "draft", recipients: 0, openRate: "-", sentDate: null },
  { id: 4, title: "Spring Season Kickoff", status: "scheduled", recipients: 1300, openRate: "-", sentDate: "Feb 1, 2024" },
  { id: 5, title: "Monthly Highlights - Dec", status: "sent", recipients: 1150, openRate: "65%", sentDate: "Dec 1, 2023" },
]

const statusColors = { sent: "bg-green-500/20 text-green-500", draft: "bg-gray-500/20 text-gray-500", scheduled: "bg-blue-500/20 text-blue-500" }

export default function NewslettersPage() {
  const sentCount = newsletters.filter(n => n.status === "sent").length
  const totalRecipients = newsletters.filter(n => n.status === "sent").reduce((sum, n) => sum + n.recipients, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Newsletters</h1>
          <p className="text-muted-foreground">Create and send email newsletters</p>
        </div>
        <Button className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Newsletter
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Newsletters</p>
              <p className="text-2xl font-bold">{newsletters.length}</p>
            </div>
            <Mail className="w-8 h-8 text-violet-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Sent</p>
              <p className="text-2xl font-bold text-green-500">{sentCount}</p>
            </div>
            <Send className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Recipients</p>
              <p className="text-2xl font-bold text-blue-500">{totalRecipients.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg. Open Rate</p>
              <p className="text-2xl font-bold text-purple-500">68%</p>
            </div>
            <Eye className="w-8 h-8 text-purple-500" />
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">All Newsletters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {newsletters.map((newsletter) => (
            <div key={newsletter.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-violet-500" />
                </div>
                <div>
                  <p className="font-medium">{newsletter.title}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {newsletter.sentDate && <span>{newsletter.sentDate}</span>}
                    {newsletter.recipients > 0 && (
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {newsletter.recipients}</span>
                    )}
                    {newsletter.openRate !== "-" && (
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {newsletter.openRate}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={statusColors[newsletter.status as keyof typeof statusColors]}>{newsletter.status}</Badge>
                <Button size="sm" variant="ghost" className="text-violet-500">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
