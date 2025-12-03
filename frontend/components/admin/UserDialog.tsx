import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import adminService, { AdminUser, AdminRole } from '@/lib/services/adminService'
import { toast } from 'sonner'

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  roleId: z.string().min(1, 'Role is required'),
  clubId: z.string().optional(),
})

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: AdminUser | null
  onSuccess: () => void
}

export function UserDialog({ open, onOpenChange, user, onSuccess }: UserDialogProps) {
  const [roles, setRoles] = useState<AdminRole[]>([])
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      roleId: '',
      clubId: '',
    },
  })

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await adminService.getRoles()
        setRoles(response.roles)
      } catch (error) {
        console.error('Error fetching roles:', error)
        toast.error('Failed to load roles')
      }
    }

    if (open) {
      fetchRoles()
    }
  }, [open])

  useEffect(() => {
    if (user) {
      // Find role ID based on role name if possible, or just default to empty if not found
      // Ideally AdminUser should have roleId, but it currently has role name.
      // We'll try to match by name.
      const role = roles.find(r => r.name === user.role)
      
      form.reset({
        name: user.name,
        email: user.email,
        password: '',
        roleId: role ? role.id.toString() : '',
        clubId: '',
      })
    } else {
      form.reset({
        name: '',
        email: '',
        password: '',
        roleId: '',
        clubId: '',
      })
    }
  }, [user, open, form, roles])

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    setLoading(true)
    try {
      const payload: any = {
        ...values,
        roleId: parseInt(values.roleId),
        clubId: values.clubId ? parseInt(values.clubId) : undefined,
      }

      if (user) {
        // Update
        // Remove password if empty
        if (!payload.password) delete payload.password
        await adminService.updateUser(user.id, payload)
        toast.success('User updated successfully')
      } else {
        // Create
        if (!payload.password) {
          toast.error('Password is required for new users')
          setLoading(false)
          return
        }
        await adminService.createUser(payload)
        toast.success('User created successfully')
      }
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      console.error('Error saving user:', error)
      toast.error(error.response?.data?.message || 'Failed to save user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? 'Edit User' : 'Add User'}</DialogTitle>
          <DialogDescription>
            {user ? 'Update user details below.' : 'Create a new user account.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{user ? 'Password (leave blank to keep current)' : 'Password'}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
