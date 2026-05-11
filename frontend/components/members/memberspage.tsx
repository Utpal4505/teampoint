'use client'

import { useState } from 'react'
import { SidebarInset } from '@/components/ui/sidebar'
import MembersList from './memberslist'
import InviteMemberModal from './invitemembermodal'
import { useFetchWorkspaceById } from '@/features/workspace/hooks'
import { useUserStore } from '@/store/user.store'
import { Loader2 } from 'lucide-react'
import MembersHeader from './membersheader'

interface MembersPageProps {
  workspaceId: string
}

export default function MembersPage({ workspaceId }: MembersPageProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)

  const { data: workspace, isLoading, error } = useFetchWorkspaceById(Number(workspaceId))
  const user = useUserStore(state => state.user)

  if (isLoading) {
    return (
      <SidebarInset>
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </SidebarInset>
    )
  }

  if (error || !workspace) {
    return (
      <SidebarInset>
        <div className="flex h-full items-center justify-center flex-col gap-2">
          <p className="text-destructive font-medium">Failed to load workspace members</p>
          <p className="text-sm text-muted-foreground">Please try again later</p>
        </div>
      </SidebarInset>
    )
  }

  const currentUserMember = workspace.workspaceMembers.find(
    (member) => member.user.id === user?.id
  )
  const isAdmin = currentUserMember?.role === 'ADMIN' || workspace.createdBy === user?.id

  return (
    <SidebarInset>
      <MembersHeader />

      <div className="flex-1 overflow-auto p-6 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Workspace Members ({workspace.workspaceMembers.length})</h2>
            <p className="text-sm text-muted-foreground">
              People who have access to this workspace.
            </p>
          </div>

          <MembersList 
            workspaceId={Number(workspaceId)}
            members={workspace.workspaceMembers} 
            currentUserId={user?.id}
            isAdmin={isAdmin}
            ownerId={workspace.createdBy}
            onInviteClick={() => setIsInviteModalOpen(true)}
          />
        </div>
      </div>

      <InviteMemberModal
        open={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        workspaceId={Number(workspaceId)}
      />
    </SidebarInset>
  )
}
