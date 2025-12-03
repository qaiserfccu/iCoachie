"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, CheckCircle, XCircle, DollarSign, Clock, AlertTriangle } from "lucide-react"
import { adminRefunds } from "@/lib/services/mockDataService"

export default function RefundsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Refund Requests</h1>
          <p className="text-muted-foreground">Process and manage refund requests</p>
        </div>
        <Badge className="bg-yellow-500/20 text-yellow-600 text-lg px-4 py-2">
          {adminRefunds.filter(r => r.status === "Pending" || r.status === "Under Review").length} Pending
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Processed</p>
                <p className="text-2xl font-bold">$2,450</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Under Review</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle>All Refund Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl overflow-hidden border border-white/20">
            <Table>
              <TableHeader>
                <TableRow className="bg-white/10 hover:bg-white/10">
                  <TableHead>Refund ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Original</TableHead>
                  <TableHead>Refund</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminRefunds.map((refund) => (
                  <TableRow key={refund.id} className="hover:bg-white/10">
                    <TableCell className="font-mono text-sm">{refund.id}</TableCell>
                    <TableCell>{refund.user}</TableCell>
                    <TableCell className="text-muted-foreground">{refund.originalAmount}</TableCell>
                    <TableCell className="font-medium text-red-500">{refund.refundAmount}</TableCell>
                    <TableCell className="text-muted-foreground max-w-[150px] truncate">{refund.reason}</TableCell>
                    <TableCell>
                      <Badge className={
                        refund.status === "Processed" ? "bg-green-500/20 text-green-600" :
                        refund.status === "Pending" ? "bg-yellow-500/20 text-yellow-600" :
                        "bg-orange-500/20 text-orange-600"
                      }>
                        {refund.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{refund.date}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                        {refund.status !== "Processed" && (
                          <>
                            <Button variant="ghost" size="icon" className="text-green-500">
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500">
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
