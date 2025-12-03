"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search, Book, FileText, Video, HelpCircle, 
  ChevronRight, Star, Clock, Eye, ThumbsUp, Plus, Loader2
} from "lucide-react"
import { useState, useEffect } from "react"
import { systemSupportService, type KnowledgeBaseArticle } from "@/lib/services"

const staticCategories = [
  { id: 1, name: "Getting Started", icon: Book, articles: 12, color: "from-blue-500 to-blue-600", code: "account" },
  { id: 2, name: "Account & Billing", icon: FileText, articles: 18, color: "from-green-500 to-emerald-500", code: "billing" },
  { id: 3, name: "Technical Support", icon: HelpCircle, articles: 25, color: "from-purple-500 to-indigo-500", code: "technical" },
  { id: 4, name: "Support Procedures", icon: Video, articles: 8, color: "from-orange-500 to-red-500", code: "support" },
]

const statusColors = {
  published: "bg-green-500/20 text-green-500",
  draft: "bg-gray-500/20 text-gray-500",
  review: "bg-yellow-500/20 text-yellow-500",
}

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [articles, setArticles] = useState<KnowledgeBaseArticle[]>([])
  const [categories, setCategories] = useState<Array<{ name: string; count: number }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await systemSupportService.getKnowledgeBase({
          category: selectedCategory || undefined,
          search: searchQuery || undefined
        })
        setArticles(data.articles)
        setCategories(data.categories)
      } catch (err) {
        console.error('Error fetching knowledge base:', err)
        setError('Failed to load knowledge base. Using fallback data.')
        // Fallback data
        setArticles([
          { id: 1, title: "How to reset your password", category: "account", content: "Navigate to settings and click reset password", views: 1250, helpful: 180, lastUpdated: "2 days ago" },
          { id: 2, title: "Getting started with session booking", category: "technical", content: "Open the sessions tab and select create new session", views: 980, helpful: 150, lastUpdated: "1 week ago" },
          { id: 3, title: "Troubleshooting login issues", category: "technical", content: "Common login issues and their solutions", views: 875, helpful: 120, lastUpdated: "3 days ago" },
          { id: 4, title: "Payment methods and billing FAQ", category: "billing", content: "All about payment processing and invoices", views: 720, helpful: 95, lastUpdated: "5 days ago" },
          { id: 5, title: "Mobile app setup guide", category: "account", content: "How to set up the mobile application", views: 650, helpful: 85, lastUpdated: "1 week ago" },
        ])
        setCategories([
          { name: "account", count: 2 },
          { name: "billing", count: 1 },
          { name: "technical", count: 2 },
        ])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchArticles, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery, selectedCategory])

  const totalViews = articles.reduce((sum, a) => sum + a.views, 0)
  const avgRating = articles.length > 0 
    ? (articles.reduce((sum, a) => sum + (a.helpful / Math.max(a.views, 1)), 0) / articles.length * 5).toFixed(1)
    : "0.0"
  const helpfulRate = articles.length > 0
    ? Math.round(articles.reduce((sum, a) => sum + a.helpful, 0) / Math.max(totalViews, 1) * 100)
    : 0

  // Update category counts from API data
  const displayCategories = staticCategories.map(cat => {
    const apiCategory = categories.find(c => c.name === cat.code)
    return {
      ...cat,
      articles: apiCategory?.count || cat.articles
    }
  })

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

      {error && (
        <div className="p-4 rounded-lg bg-yellow-500/20 text-yellow-600 text-sm">
          {error}
        </div>
      )}

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
        {displayCategories.map((category) => (
          <Card 
            key={category.id} 
            className={`glass-card border-white/20 hover-lift cursor-pointer ${selectedCategory === category.code ? 'ring-2 ring-purple-500' : ''}`}
            onClick={() => setSelectedCategory(selectedCategory === category.code ? null : category.code)}
          >
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

      {/* Articles List */}
      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">
            {loading ? "Loading..." : `Articles (${articles.length})`}
          </CardTitle>
          {selectedCategory && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-purple-500"
              onClick={() => setSelectedCategory(null)}
            >
              Clear Filter
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No articles found matching your criteria
            </div>
          ) : (
            articles.map((article) => (
              <div
                key={article.id}
                className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{article.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{article.content}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <Badge className="bg-purple-500/20 text-purple-500">
                      {article.category}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {article.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3 text-green-500" /> {article.helpful}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {article.lastUpdated}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <Card className="glass-card border-white/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-purple-500">{articles.length}</p>
              <p className="text-sm text-muted-foreground">Total Articles</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-500">{totalViews.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Views</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-500">{avgRating}</p>
              <p className="text-sm text-muted-foreground">Avg. Rating</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-500">{helpfulRate}%</p>
              <p className="text-sm text-muted-foreground">Helpful Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
