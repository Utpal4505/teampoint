'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface MembersHeaderProps {
  onInviteClick: () => void
  isAdmin: boolean
}

export default function MembersHeader({ onInviteClick, isAdmin }: MembersHeaderProps) {
  return (
    <div className="flex h-16 items-center justify-between border-b px-6 bg-background">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Members</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your workspace members and their roles.
        </p>
      </div>

      {isAdmin && (
        <Button onClick={onInviteClick} className="gap-2">
          <Plus className="h-4 w-4" />
          Invite Member
        </Button>
      )}
    </div>
  )
}
