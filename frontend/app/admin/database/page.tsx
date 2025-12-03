"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Database, HardDrive, Clock, Download, RefreshCw, AlertTriangle } from "lucide-react"
import { adminDatabaseStats } from "@/lib/services/mockDataService"

export default function DatabasePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Database Management</h1>
          <p className="text-muted-foreground">Monitor and manage database</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Backup Now
          </Button>
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
            <RefreshCw className="w-4 h-4 mr-2" />
            Optimize
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Size</p>
                <p className="text-2xl font-bold">{adminDatabaseStats.totalSize}</p>
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
                <p className="text-2xl font-bold">{adminDatabaseStats.tablesCount}</p>
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
                <p className="text-lg font-bold">{adminDatabaseStats.lastBackup}</p>
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
                <p className="text-2xl font-bold">{adminDatabaseStats.backupFrequency}</p>
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
                {adminDatabaseStats.tables.map((table, index) => (
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
              <p className="text-sm text-muted-foreground">Regular maintenance helps optimize database performance. Last optimization: 3 days ago.</p>
            </div>
            <Button variant="outline" className="ml-auto">Run Maintenance</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
