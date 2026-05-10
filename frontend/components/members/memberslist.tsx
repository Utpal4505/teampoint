'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { GetWorkspaceDTO } from '@/features/workspace/types'
import { format } from 'date-fns'

interface MembersListProps {
  members: GetWorkspaceDTO['workspaceMembers']
}

export default function MembersList({ members }: MembersListProps) {
  if (!members || members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-card mt-6">
        <p className="text-muted-foreground">No members found.</p>
      </div>
    )
  }

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <div
          key={member.user.id}
          className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md"
        >
          <Avatar className="h-12 w-12 border">
            <AvatarImage src={member.user.avatarUrl || ''} />
            <AvatarFallback>{member.user.fullName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <h3 className="truncate font-semibold text-foreground">
              {member.user.fullName}
            </h3>
            <p className="truncate text-xs text-muted-foreground mt-0.5">
              Joined {format(new Date(member.joinedAt), 'MMM d, yyyy')}
            </p>
          </div>
          <div>
            <Badge
              variant={member.role === 'ADMIN' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {member.role.toLowerCase()}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
