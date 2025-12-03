"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Book, Users, CreditCard, Building2, BarChart3, HelpCircle, ExternalLink, MessageCircle } from "lucide-react"
import { adminHelpTopics } from "@/lib/services/mockDataService"

const topicIcons: Record<string, typeof Book> = {
  book: Book,
  users: Users,
  "credit-card": CreditCard,
  building: Building2,
  chart: BarChart3,
  help: HelpCircle,
}

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Help Center</h1>
          <p className="text-muted-foreground">Find answers and get support</p>
        </div>
        <Button className="gradient-primary text-white">
          <MessageCircle className="w-4 h-4 mr-2" />
          Contact Support
        </Button>
      </div>

      <Card className="glass-card border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 glass-input rounded-xl px-4 py-3">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for help articles..."
              className="border-0 bg-transparent focus-visible:ring-0 p-0 h-auto text-lg"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminHelpTopics.map((topic) => {
          const Icon = topicIcons[topic.icon] || HelpCircle
          
          return (
            <Card key={topic.id} className="glass-card border-white/20 hover-lift cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{topic.title}</h3>
                    <p className="text-sm text-muted-foreground">{topic.articles} articles</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle>Popular Articles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {["How to add a new user", "Setting up payment integration", "Managing club permissions", "Generating reports", "Understanding analytics"].map((article, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl glass-subtle hover:bg-white/20 cursor-pointer">
                <span>{article}</span>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle>Need More Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl glass-subtle">
              <h4 className="font-medium mb-2">Email Support</h4>
              <p className="text-sm text-muted-foreground mb-3">Get help via email within 24 hours</p>
              <Button variant="outline" className="w-full">support@icoachie.com</Button>
            </div>
            <div className="p-4 rounded-xl glass-subtle">
              <h4 className="font-medium mb-2">Live Chat</h4>
              <p className="text-sm text-muted-foreground mb-3">Available Mon-Fri, 9am-5pm EST</p>
              <Button className="w-full gradient-primary text-white">Start Chat</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
