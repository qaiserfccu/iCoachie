import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Image, Megaphone, Edit, ArrowRight, Eye } from "lucide-react"
import { contentManagerStats, contentManagerRecentContent, getStatusColor } from "@/lib/services/mockDataService"

const statusColors = { Published: "bg-green-500/20 text-green-500", Draft: "bg-yellow-500/20 text-yellow-600", Pending: "bg-blue-500/20 text-blue-500" }

export default function ContentManagerDashboard() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Content Manager Dashboard</h1>
          <p className="text-muted-foreground">Create and manage club content, media, and announcements</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">Media Library</Button>
          <Button className="bg-gradient-to-r from-violet-500 to-purple-600 text-white"><Edit className="w-4 h-4 mr-2" />Create Content</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {contentManagerStats.map((stat) => (
          <Card key={stat.title} className="glass-card border-white/20 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-muted-foreground">{stat.title}</p><p className="text-2xl font-bold mt-1">{stat.value}</p><p className="text-sm text-violet-500 mt-1">{stat.change || stat.subtitle}</p></div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}><stat.icon className="w-7 h-7 text-white" /></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Recent Content</CardTitle>
          <Button variant="ghost" size="sm" className="text-violet-500">View All</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {contentManagerRecentContent.map((content, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center"><FileText className="w-5 h-5 text-violet-500" /></div>
                <div><p className="font-medium">{content.title}</p><p className="text-sm text-muted-foreground">{content.type} • {content.date}</p></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-muted-foreground"><Edit className="w-4 h-4" /><span className="text-sm">{content.author}</span></div>
                <Badge className={statusColors[content.status as keyof typeof statusColors]}>{content.status}</Badge>
                <Button size="sm" variant="ghost" className="text-violet-500"><ArrowRight className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
