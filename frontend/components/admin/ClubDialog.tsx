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
import adminService, { AdminClub } from '@/lib/services/adminService'
import { toast } from 'sonner'

const clubSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  subdomain: z.string().min(2, 'Subdomain must be at least 2 characters'),
  logo: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
})

interface ClubDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  club?: AdminClub | null
  onSuccess: () => void
}

export function ClubDialog({ open, onOpenChange, club, onSuccess }: ClubDialogProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof clubSchema>>({
    resolver: zodResolver(clubSchema),
    defaultValues: {
      name: '',
      subdomain: '',
      logo: '',
      primaryColor: '',
      secondaryColor: '',
    },
  })

  useEffect(() => {
    if (club) {
      form.reset({
        name: club.name,
        subdomain: club.subdomain,
        logo: club.logo || '',
        primaryColor: club.primaryColor || '',
        secondaryColor: club.secondaryColor || '',
      })
    } else {
      form.reset({
        name: '',
        subdomain: '',
        logo: '',
        primaryColor: '',
        secondaryColor: '',
      })
    }
  }, [club, open, form])

  const onSubmit = async (values: z.infer<typeof clubSchema>) => {
    setLoading(true)
    try {
      if (club) {
        await adminService.updateClub(club.id, values)
        toast.success('Club updated successfully')
      } else {
        await adminService.createClub(values)
        toast.success('Club created successfully')
      }
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      console.error('Error saving club:', error)
      toast.error(error.response?.data?.message || 'Failed to save club')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{club ? 'Edit Club' : 'Add Club'}</DialogTitle>
          <DialogDescription>
            {club ? 'Update club details below.' : 'Create a new club.'}
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
                    <Input placeholder="My Tennis Club" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subdomain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subdomain</FormLabel>
                  <FormControl>
                    <Input placeholder="mytennisclub" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="primaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Color</FormLabel>
                  <FormControl>
                    <Input placeholder="#000000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="secondaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Color</FormLabel>
                  <FormControl>
                    <Input placeholder="#ffffff" {...field} />
                  </FormControl>
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
