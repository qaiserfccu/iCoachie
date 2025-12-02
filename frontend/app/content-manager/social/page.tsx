"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share2, Plus, Heart, MessageCircle, Eye, ArrowRight, Calendar } from "lucide-react"

const socialPosts = [
  { id: 1, platform: "Instagram", content: "New season starts next week! 🏆", status: "published", likes: 245, comments: 32, date: "Jan 12" },
  { id: 2, platform: "Facebook", content: "Congratulations to our U-12 team!", status: "published", likes: 189, comments: 28, date: "Jan 10" },
  { id: 3, platform: "Twitter", content: "Registration is now open for spring", status: "scheduled", likes: 0, comments: 0, date: "Jan 20" },
  { id: 4, platform: "Instagram", content: "Behind the scenes training video", status: "draft", likes: 0, comments: 0, date: null },
  { id: 5, platform: "LinkedIn", content: "We&apos;re hiring new coaches!", status: "published", likes: 156, comments: 45, date: "Jan 8" },
]

const platformColors = {
  Instagram: "bg-gradient-to-br from-purple-500 to-pink-500",
  Facebook: "bg-blue-600",
  Twitter: "bg-sky-500",
  LinkedIn: "bg-blue-700",
}

const statusColors = { published: "bg-green-500/20 text-green-500", draft: "bg-gray-500/20 text-gray-500", scheduled: "bg-blue-500/20 text-blue-500" }

export default function SocialPage() {
  const totalEngagement = socialPosts.filter(p => p.status === "published").reduce((sum, p) => sum + p.likes + p.comments, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Social Media</h1>
          <p className="text-muted-foreground">Manage social media content</p>
        </div>
        <Button className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Post
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Posts</p>
              <p className="text-2xl font-bold">{socialPosts.length}</p>
            </div>
            <Share2 className="w-8 h-8 text-violet-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Published</p>
              <p className="text-2xl font-bold text-green-500">{socialPosts.filter(p => p.status === "published").length}</p>
            </div>
            <Eye className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Scheduled</p>
              <p className="text-2xl font-bold text-blue-500">{socialPosts.filter(p => p.status === "scheduled").length}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Engagement</p>
              <p className="text-2xl font-bold text-pink-500">{totalEngagement}</p>
            </div>
            <Heart className="w-8 h-8 text-pink-500" />
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Recent Posts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {socialPosts.map((post) => (
            <div key={post.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${platformColors[post.platform as keyof typeof platformColors]}`}>
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{post.platform}</Badge>
                    <Badge className={statusColors[post.status as keyof typeof statusColors]}>{post.status}</Badge>
                  </div>
                  <p className="text-sm mt-1">{post.content}</p>
                  {post.status === "published" && (
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {post.likes}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {post.comments}</span>
                      <span>{post.date}</span>
                    </div>
                  )}
                </div>
              </div>
              <Button size="sm" variant="ghost" className="text-violet-500">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
