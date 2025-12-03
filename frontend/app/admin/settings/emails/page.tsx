"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Mail, Plus, Edit, Eye, Copy, Send, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { adminService, type EmailTemplate, type CreateEmailTemplateInput } from "@/lib/services/adminService"

/**
 * HTML sanitization for email template preview.
 * 
 * SECURITY NOTE: This is a basic sanitization for admin-only preview functionality.
 * Email templates are created by trusted admin users (SUPER_ADMIN, SYSTEM_SUPPORT, CLUB_ADMIN).
 * 
 * For production use with untrusted content, consider using a dedicated library
 * like DOMPurify for comprehensive XSS protection.
 * 
 * This function uses recursive replacement to handle nested/obfuscated attacks.
 */
function sanitizeHtml(html: string): string {
  if (!html) return ''
  
  let sanitized = html
  let iterations = 0
  const maxIterations = 100 // Prevent infinite loops
  let previousContent = ''
  
  // Keep replacing until no more changes (handles nested obfuscation)
  while (sanitized !== previousContent && iterations < maxIterations) {
    previousContent = sanitized
    iterations++
    
    // Remove script tags - using multiple patterns to catch various formats
    // Pattern matches <script>, <script attr>, <script\n>, etc.
    sanitized = sanitized.replace(/<\s*script[\s\S]*?<\s*\/\s*script\s*>/gi, '')
    sanitized = sanitized.replace(/<\s*script[^>]*>/gi, '')
    
    // Remove event handlers (onclick, onerror, onload, etc.)
    // Handles onclick="...", onclick='...', onclick=value
    sanitized = sanitized.replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '')
    
    // Remove dangerous URI schemes
    sanitized = sanitized.replace(/javascript\s*:/gi, 'blocked:')
    sanitized = sanitized.replace(/vbscript\s*:/gi, 'blocked:')
    sanitized = sanitized.replace(/data\s*:\s*text\/html/gi, 'blocked:text/html')
    
    // Remove expression() used in IE for CSS XSS
    sanitized = sanitized.replace(/expression\s*\(/gi, 'blocked(')
    
    // Remove iframe, object, embed, form tags
    sanitized = sanitized.replace(/<\s*iframe[\s\S]*?<\s*\/\s*iframe\s*>/gi, '')
    sanitized = sanitized.replace(/<\s*iframe[^>]*>/gi, '')
    sanitized = sanitized.replace(/<\s*object[\s\S]*?<\s*\/\s*object\s*>/gi, '')
    sanitized = sanitized.replace(/<\s*embed[^>]*>/gi, '')
    sanitized = sanitized.replace(/<\s*form[\s\S]*?<\s*\/\s*form\s*>/gi, '')
  }
  
  return sanitized
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [formData, setFormData] = useState<CreateEmailTemplateInput>({
    name: '',
    subject: '',
    body: '',
    variables: [],
  })

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const response = await adminService.getEmailTemplates()
      setTemplates(response.templates)
    } catch (error) {
      console.error('Error loading templates:', error)
      toast.error('Failed to load email templates')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    setIsCreating(true)
    setFormData({
      name: '',
      subject: '',
      body: '',
      variables: [],
    })
    setIsEditDialogOpen(true)
  }

  const handleEdit = (template: EmailTemplate) => {
    setIsCreating(false)
    setSelectedTemplate(template)
    setFormData({
      name: template.name,
      subject: template.subject,
      body: template.body,
      variables: template.variables,
    })
    setIsEditDialogOpen(true)
  }

  const handlePreview = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setIsPreviewDialogOpen(true)
  }

  const handleDeleteConfirm = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setIsDeleteDialogOpen(true)
  }

  const handleTestEmail = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setTestEmail('')
    setIsTestDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.subject || !formData.body) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSaving(true)
    try {
      if (isCreating) {
        await adminService.createEmailTemplate(formData)
        toast.success('Template created successfully')
      } else if (selectedTemplate) {
        await adminService.updateEmailTemplate(selectedTemplate.id, formData)
        toast.success('Template updated successfully')
      }
      setIsEditDialogOpen(false)
      loadTemplates()
    } catch (error) {
      console.error('Error saving template:', error)
      toast.error('Failed to save template')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedTemplate) return

    try {
      await adminService.deleteEmailTemplate(selectedTemplate.id)
      toast.success('Template deleted successfully')
      setIsDeleteDialogOpen(false)
      loadTemplates()
    } catch (error) {
      console.error('Error deleting template:', error)
      toast.error('Failed to delete template')
    }
  }

  const handleDuplicate = async (template: EmailTemplate) => {
    try {
      await adminService.duplicateEmailTemplate(template.id)
      toast.success('Template duplicated successfully')
      loadTemplates()
    } catch (error) {
      console.error('Error duplicating template:', error)
      toast.error('Failed to duplicate template')
    }
  }

  const handleSendTest = async () => {
    if (!selectedTemplate || !testEmail) {
      toast.error('Please enter a test email address')
      return
    }

    try {
      await adminService.sendTestEmail(selectedTemplate.id, testEmail)
      toast.success(`Test email sent to ${testEmail}`)
      setIsTestDialogOpen(false)
    } catch (error) {
      console.error('Error sending test email:', error)
      toast.error('Failed to send test email')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Email Templates</h1>
          <p className="text-muted-foreground">Manage system email templates</p>
        </div>
        <Button className="gradient-primary text-white" onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle>All Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl overflow-hidden border border-white/20">
            <Table>
              <TableHeader>
                <TableRow className="bg-white/10 hover:bg-white/10">
                  <TableHead>Template</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id} className="hover:bg-white/10">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        <span className="font-medium">{template.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{template.subject}</TableCell>
                    <TableCell className="text-muted-foreground">{template.lastModified}</TableCell>
                    <TableCell>
                      <Badge className={template.status === 'Active' ? 'bg-green-500/20 text-green-600' : 'bg-gray-500/20 text-gray-600'}>
                        {template.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handlePreview(template)} title="Preview">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(template)} title="Edit">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDuplicate(template)} title="Duplicate">
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleTestEmail(template)} title="Send Test">
                          <Send className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteConfirm(template)} title="Delete" className="text-red-500 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit/Create Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl glass-card border-white/20">
          <DialogHeader>
            <DialogTitle>{isCreating ? 'Create New Template' : 'Edit Template'}</DialogTitle>
            <DialogDescription>
              {isCreating ? 'Create a new email template' : 'Modify the email template content'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., welcome_email"
                className="glass-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-subject">Subject</Label>
              <Input
                id="template-subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Email subject line"
                className="glass-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-body">Body (HTML)</Label>
              <Textarea
                id="template-body"
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                placeholder="Enter HTML email body..."
                className="glass-input min-h-[200px] font-mono text-sm"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Use variables like {'{{name}}'}, {'{{email}}'} for dynamic content
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="glass-subtle border-white/20">
              Cancel
            </Button>
            <Button className="gradient-primary text-white" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Template'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-3xl glass-card border-white/20">
          <DialogHeader>
            <DialogTitle>Template Preview</DialogTitle>
            <DialogDescription>
              Subject: {selectedTemplate?.subject}
            </DialogDescription>
          </DialogHeader>
          <div className="border border-white/20 rounded-lg p-4 bg-white/5 min-h-[300px] max-h-[500px] overflow-auto">
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedTemplate?.body || '') }} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)} className="glass-subtle border-white/20">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="glass-card border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the template "{selectedTemplate?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="glass-subtle border-white/20">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 text-white hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Test Email Dialog */}
      <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
        <DialogContent className="glass-card border-white/20">
          <DialogHeader>
            <DialogTitle>Send Test Email</DialogTitle>
            <DialogDescription>
              Send a test email using the "{selectedTemplate?.name}" template
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="test-email">Test Email Address</Label>
            <Input
              id="test-email"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Enter email address"
              className="glass-input mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTestDialogOpen(false)} className="glass-subtle border-white/20">
              Cancel
            </Button>
            <Button className="gradient-primary text-white" onClick={handleSendTest}>
              <Send className="w-4 h-4 mr-2" />
              Send Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
