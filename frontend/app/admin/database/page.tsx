"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Database, HardDrive, Clock, Download, RefreshCw, AlertTriangle, Loader2 } from "lucide-react"
import { adminService } from "@/lib/services/adminService"
import { toast } from "sonner"

interface TableStats {
  name: string
  rows: string
  size: string
}

interface DatabaseStats {
  totalSize: string
  tablesCount: number
  lastBackup: string
  backupFrequency: string
  tables: TableStats[]
}

export default function DatabasePage() {
  const [stats, setStats] = useState<DatabaseStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)

  useEffect(() => {
    fetchDatabaseStats()
  }, [])

  async function fetchDatabaseStats() {
    setIsLoading(true)
    setError(null)
    try {
      const response = await adminService.getDatabaseStats()
      setStats(response)
    } catch (err) {
      console.error('Error fetching database stats:', err)
      setError('Failed to load database statistics. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackup = async () => {
    setIsBackingUp(true)
    // Simulate backup process
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsBackingUp(false)
    toast.success('Backup Complete', {
      description: 'Database backup has been created successfully.'
    })
  }

  const handleOptimize = async () => {
    setIsOptimizing(true)
    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsOptimizing(false)
    toast.success('Optimization Complete', {
      description: 'Database has been optimized successfully.'
    })
    fetchDatabaseStats()
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-destructive" />
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchDatabaseStats}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Database Management</h1>
          <p className="text-muted-foreground">Monitor and manage database</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="glass-subtle border-white/20 bg-transparent"
            onClick={handleBackup}
            disabled={isBackingUp}
          >
            {isBackingUp ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isBackingUp ? 'Backing up...' : 'Backup Now'}
          </Button>
          <Button 
            variant="outline" 
            className="glass-subtle border-white/20 bg-transparent"
            onClick={handleOptimize}
            disabled={isOptimizing}
          >
            {isOptimizing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            {isOptimizing ? 'Optimizing...' : 'Optimize'}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="glass-card border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Size</p>
                    <p className="text-2xl font-bold">{stats.totalSize}</p>
                  </div>
                  <HardDrive className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tables</p>
                    <p className="text-2xl font-bold">{stats.tablesCount}</p>
                  </div>
                  <Database className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Last Backup</p>
                    <p className="text-lg font-bold">{new Date(stats.lastBackup).toLocaleString()}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Backup Frequency</p>
                    <p className="text-2xl font-bold">{stats.backupFrequency}</p>
                  </div>
                  <RefreshCw className="w-8 h-8 text-teal-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle>Database Tables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl overflow-hidden border border-white/20">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-white/10 hover:bg-white/10">
                      <TableHead>Table Name</TableHead>
                      <TableHead>Rows</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.tables.map((table, index) => (
                      <TableRow key={index} className="hover:bg-white/10">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-primary" />
                            <span className="font-mono">{table.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{table.rows}</TableCell>
                        <TableCell>{table.size}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20 border-yellow-500/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="font-medium">Database Maintenance</p>
                  <p className="text-sm text-muted-foreground">Regular maintenance helps optimize database performance. Run optimization to improve query speeds.</p>
                </div>
                <Button 
                  variant="outline" 
                  className="ml-auto"
                  onClick={handleOptimize}
                  disabled={isOptimizing}
                >
                  {isOptimizing ? 'Running...' : 'Run Maintenance'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
