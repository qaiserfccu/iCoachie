"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search, Book, FileText, Video, HelpCircle, 
  ChevronRight, Star, Clock, Eye, ThumbsUp, Plus
} from "lucide-react"
import { useState } from "react"

const categories = [
  { id: 1, name: "Getting Started", icon: Book, articles: 12, color: "from-blue-500 to-blue-600" },
  { id: 2, name: "Account & Billing", icon: FileText, articles: 18, color: "from-green-500 to-emerald-500" },
  { id: 3, name: "Technical Support", icon: HelpCircle, articles: 25, color: "from-purple-500 to-indigo-500" },
  { id: 4, name: "Video Tutorials", icon: Video, articles: 8, color: "from-orange-500 to-red-500" },
]

const popularArticles = [
  { id: 1, title: "How to reset your password", category: "Account & Billing", views: 1250, rating: 4.8, updated: "2 days ago" },
  { id: 2, title: "Getting started with session booking", category: "Getting Started", views: 980, rating: 4.9, updated: "1 week ago" },
  { id: 3, title: "Troubleshooting login issues", category: "Technical Support", views: 875, rating: 4.7, updated: "3 days ago" },
  { id: 4, title: "Payment methods and billing FAQ", category: "Account & Billing", views: 720, rating: 4.6, updated: "5 days ago" },
  { id: 5, title: "Mobile app setup guide", category: "Getting Started", views: 650, rating: 4.8, updated: "1 week ago" },
]

const recentArticles = [
  { id: 1, title: "New feature: Calendar sync with Google", category: "Getting Started", status: "published", author: "Support Team", date: "Today" },
  { id: 2, title: "Updated payment gateway documentation", category: "Technical Support", status: "draft", author: "John S.", date: "Yesterday" },
  { id: 3, title: "2024 Platform updates overview", category: "Getting Started", status: "published", author: "Admin", date: "3 days ago" },
  { id: 4, title: "Troubleshooting common API errors", category: "Technical Support", status: "review", author: "Dev Team", date: "1 week ago" },
]

const statusColors = {
  published: "bg-green-500/20 text-green-500",
  draft: "bg-gray-500/20 text-gray-500",
  review: "bg-yellow-500/20 text-yellow-500",
}

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Knowledge Base</h1>
          <p className="text-muted-foreground">Help articles and documentation</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Article
        </Button>
      </div>

      {/* Search */}
      <Card className="glass-card border-white/20">
        <CardContent className="p-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search knowledge base articles..."
              className="pl-12 h-12 text-lg glass-subtle border-white/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Card key={category.id} className="glass-card border-white/20 hover-lift cursor-pointer">
            <CardContent className="p-6">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4`}>
                <category.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-1">{category.name}</h3>
              <p className="text-sm text-muted-foreground">{category.articles} articles</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Articles */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Popular Articles</CardTitle>
            <Button variant="ghost" size="sm" className="text-purple-500">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {popularArticles.map((article) => (
              <div
                key={article.id}
                className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{article.title}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span>{article.category}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {article.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" /> {article.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {article.updated}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Updates */}
        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Updates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentArticles.map((article) => (
              <div
                key={article.id}
                className="p-3 rounded-xl glass-subtle hover:bg-white/20 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{article.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {article.author} • {article.date}
                    </p>
                  </div>
                  <Badge className={statusColors[article.status as keyof typeof statusColors]}>
                    {article.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <Card className="glass-card border-white/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-purple-500">63</p>
              <p className="text-sm text-muted-foreground">Total Articles</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-500">12.5K</p>
              <p className="text-sm text-muted-foreground">Total Views</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-500">4.8</p>
              <p className="text-sm text-muted-foreground">Avg. Rating</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-500">85%</p>
              <p className="text-sm text-muted-foreground">Helpful Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
