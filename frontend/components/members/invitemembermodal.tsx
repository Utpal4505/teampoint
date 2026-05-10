'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSendWorkspaceInvite } from '@/features/workspace/hooks'
import { toast } from 'sonner'
import { Mail, Shield } from 'lucide-react'

interface InviteMemberModalProps {
  open: boolean
  onClose: () => void
  workspaceId: number
}

export default function InviteMemberModal({
  open,
  onClose,
  workspaceId,
}: InviteMemberModalProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'MEMBER' | 'ADMIN'>('MEMBER')

  const { mutate: sendInvite, isPending } = useSendWorkspaceInvite()

  const handleInvite = () => {
    if (!email) {
      toast.error('Please enter an email address')
      return
    }

    sendInvite(
      { workspaceId, email, role },
      {
        onSuccess: () => {
          toast.success(`Invitation sent to ${email}`)
          setEmail('')
          setRole('MEMBER')
          onClose()
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || 'Failed to send invitation')
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Invite to Workspace</DialogTitle>
          <DialogDescription>
            Invite new members to collaborate in your workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Role
            </label>
            <Select value={role} onValueChange={(val: 'MEMBER' | 'ADMIN') => setRole(val)}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Select a role" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MEMBER">Member (Can view and edit)</SelectItem>
                <SelectItem value="ADMIN">Admin (Can manage workspace)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleInvite} disabled={isPending || !email}>
            {isPending ? 'Sending...' : 'Send Invite'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
