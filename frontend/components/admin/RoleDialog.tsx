import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AdminRole } from '@/lib/services/adminService'

interface RoleDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (roleData: any) => Promise<void>
  role?: AdminRole
  availablePermissions: string[]
}

export function RoleDialog({ isOpen, onClose, onSave, role, availablePermissions }: RoleDialogProps) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (role) {
      setName(role.name)
      setCode(role.code)
      setDescription(role.description)
      // Assuming role.permissions is an array of permission strings
      setSelectedPermissions(role.permissions || [])
    } else {
      setName('')
      setCode('')
      setDescription('')
      setSelectedPermissions([])
    }
  }, [role, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Convert selected permissions array to the object format expected by backend
      // The backend expects a JSON object where keys are permissions and values are true
      const permissionsObject = selectedPermissions.reduce((acc, perm) => {
        acc[perm] = true
        return acc
      }, {} as Record<string, boolean>)

      await onSave({
        name,
        code,
        description,
        permissions: permissionsObject
      })
      onClose()
    } catch (error) {
      console.error('Error saving role:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePermission = (permission: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{role ? 'Edit Role' : 'Create New Role'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col gap-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Senior Coach"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Role Code</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SENIOR_COACH"
                  required
                  disabled={!!role} // Code cannot be changed after creation
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the responsibilities of this role..."
              />
            </div>

            <div className="space-y-2 flex-1 min-h-0 flex flex-col">
              <Label>Permissions</Label>
              <div className="border rounded-md p-4 flex-1">
                <ScrollArea className="h-[200px]">
                  <div className="grid grid-cols-2 gap-4">
                    {availablePermissions.map((permission) => (
                      <div key={permission} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`perm-${permission}`} 
                          checked={selectedPermissions.includes(permission)}
                          onCheckedChange={() => togglePermission(permission)}
                        />
                        <Label 
                          htmlFor={`perm-${permission}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {permission}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (role ? 'Update Role' : 'Create Role')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
