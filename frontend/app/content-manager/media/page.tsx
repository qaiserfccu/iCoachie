"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Image, Video, FileText, Music, Upload, Search, Grid, List, Trash2 } from "lucide-react"

const mediaItems = [
  { id: 1, name: "team_photo_2024.jpg", type: "image", size: "2.4 MB", uploadedBy: "Admin", date: "Jan 10", tags: ["featured", "team"] },
  { id: 2, name: "training_video.mp4", type: "video", size: "45.2 MB", uploadedBy: "Coach Sarah", date: "Jan 8", tags: ["training"] },
  { id: 3, name: "schedule_q1.pdf", type: "document", size: "1.2 MB", uploadedBy: "Admin", date: "Jan 5", tags: ["schedule"] },
  { id: 4, name: "promo_banner.png", type: "image", size: "890 KB", uploadedBy: "Marketing", date: "Jan 3", tags: ["marketing", "banner"] },
  { id: 5, name: "podcast_ep12.mp3", type: "audio", size: "32.1 MB", uploadedBy: "Media Team", date: "Dec 28", tags: ["podcast"] },
  { id: 6, name: "facility_tour.mp4", type: "video", size: "128 MB", uploadedBy: "Admin", date: "Dec 20", tags: ["tour", "featured"] },
]

const typeIcons = { image: Image, video: Video, document: FileText, audio: Music }
const typeColors = { image: "bg-green-500/20 text-green-500", video: "bg-blue-500/20 text-blue-500", document: "bg-orange-500/20 text-orange-500", audio: "bg-purple-500/20 text-purple-500" }

export default function MediaPage() {
  const totalSize = "210 MB"
  const imageCount = mediaItems.filter(m => m.type === "image").length
  const videoCount = mediaItems.filter(m => m.type === "video").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Media Library</h1>
          <p className="text-muted-foreground">Manage images, videos, and documents</p>
        </div>
        <Button className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
          <Upload className="w-4 h-4 mr-2" />
          Upload Files
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Files</p>
              <p className="text-2xl font-bold">{mediaItems.length}</p>
            </div>
            <FileText className="w-8 h-8 text-violet-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Images</p>
              <p className="text-2xl font-bold text-green-500">{imageCount}</p>
            </div>
            <Image className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Videos</p>
              <p className="text-2xl font-bold text-blue-500">{videoCount}</p>
            </div>
            <Video className="w-8 h-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Storage Used</p>
              <p className="text-2xl font-bold text-purple-500">{totalSize}</p>
            </div>
            <FileText className="w-8 h-8 text-purple-500" />
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search media files..." className="pl-10 glass-subtle border-white/20" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="glass-subtle border-white/20">
                <Grid className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="glass-subtle border-white/20">
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">All Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mediaItems.map((item) => {
            const TypeIcon = typeIcons[item.type as keyof typeof typeIcons]
            return (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${typeColors[item.type as keyof typeof typeColors]}`}>
                    <TypeIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.size} • {item.uploadedBy} • {item.date}</p>
                    <div className="flex gap-1 mt-1">
                      {item.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={typeColors[item.type as keyof typeof typeColors]}>{item.type}</Badge>
                  <Button size="sm" variant="ghost" className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
