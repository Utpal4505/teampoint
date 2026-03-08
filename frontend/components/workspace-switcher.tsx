'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { ChevronsUpDownIcon, PlusIcon, Check } from 'lucide-react'
import { CreateWorkspacePayload } from '@/features/workspace/schema'
import { InviteMembersModal, InviteMembersPayload } from './workspaces/invite-members'
import { CreateWorkspaceModal } from './workspaces/create-workspace/createworkspacemodal'
import { useCreateWorkspace, useSendWorkspaceInvite } from '@/features/workspace/hooks'
import { handleApiError } from '@/lib/handle-api-error'
import { toast } from 'sonner'

type Workspace = {
  workspaceId: string
  name: string
}

interface WorkspaceSwitcherProps {
  workspaces: Workspace[]
  activeWorkspaceId: string
}

export function WorkspaceSwitcher({
  workspaces,
  activeWorkspaceId,
}: WorkspaceSwitcherProps) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const { mutateAsync: createWorkspace, isPending } = useCreateWorkspace()

  const { mutateAsync: sendInvite } = useSendWorkspaceInvite()
  const [isInviting, setIsInviting] = React.useState(false)

  const [createOpen, setCreateOpen] = React.useState(false)
  const [inviteOpen, setInviteOpen] = React.useState(false)
  const [newWsName, setNewWsName] = React.useState('')
  const [newWsId, setNewWsId] = React.useState<string | null>(null)

  const activeWorkspace =
    workspaces.find(w => w.workspaceId === activeWorkspaceId) ?? workspaces[0]

  if (!activeWorkspace) return null

  // ── Handlers ─────────────────────────────────────────────
  async function handleCreateWorkspace(payload: CreateWorkspacePayload) {
    try {
      const res = await createWorkspace({
        name: payload.name,
        description: payload.description,
      })

      setNewWsId(res.id)
      setNewWsName(payload.name)
      setCreateOpen(false)
      setInviteOpen(true)

      router.push(`/workspace/${res.id}/dashboard`)
    } catch (error) {
      handleApiError(error)
      throw error
    }
  }

  async function handleSendInvites(payload: InviteMembersPayload) {
    if (!newWsId) {
      toast.error('Workspace context lost. Please try again.')
      return
    }

    setIsInviting(true)

    try {
      await Promise.all(
        payload.invites.map(invite =>
          sendInvite({
            workspaceId: Number(newWsId),
            email: invite.email,
            role: invite.role as 'ADMIN' | 'MEMBER',
          }),
        ),
      )

      toast.success(`${payload.invites.length} invite(s) sent!`, {
        description: `Your teammates have been notified via email.`,
      })

      setInviteOpen(false)
      setNewWsId(null)

      router.push(`/workspace/${newWsId}/dashboard`)
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsInviting(false)
    }
  }

  function handleSkipInvite() {
    setInviteOpen(false)

    if (newWsId) {
      router.push(`/workspace/${newWsId}/dashboard`)

      setNewWsId(null)
      setNewWsName('')
    } else {
      toast.error('Could not find the new workspace. Please select it from the switcher.')
    }
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                {/* Initial avatar */}
                <div
                  className="flex aspect-square size-8 items-center justify-center
                  rounded-lg bg-sidebar-primary text-sidebar-primary-foreground
                  font-semibold text-sm"
                >
                  {activeWorkspace.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex flex-1 flex-col text-left leading-tight min-w-0">
                  <span className="truncate font-semibold text-sm">
                    {activeWorkspace.name}
                  </span>
                  <span className="truncate font-sans text-[10px] text-muted-foreground">
                    Workspace
                  </span>
                </div>

                <ChevronsUpDownIcon className="ml-auto size-4 shrink-0 text-muted-foreground" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? 'bottom' : 'right'}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Workspaces
              </DropdownMenuLabel>

              {workspaces.map((ws, i) => (
                <DropdownMenuItem
                  key={ws.workspaceId}
                  onClick={() => router.push(`/workspace/${ws.workspaceId}/dashboard`)}
                  className="gap-2 p-2"
                >
                  <div
                    className="flex size-6 items-center justify-center rounded-md
                    border font-semibold text-xs"
                  >
                    {ws.name.charAt(0).toUpperCase()}
                  </div>

                  <span className="flex-1 truncate">{ws.name}</span>

                  {/* Active check */}
                  {ws.workspaceId === activeWorkspaceId && (
                    <Check size={13} className="text-primary" />
                  )}

                  <DropdownMenuShortcut>⌘{i + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />

              {/* Add workspace */}
              <DropdownMenuItem
                className="gap-2 p-2 cursor-pointer"
                onClick={() => setCreateOpen(true)}
              >
                <div
                  className="flex size-6 items-center justify-center rounded-md border
                  text-muted-foreground"
                >
                  <PlusIcon size={14} />
                </div>
                <span className="font-medium text-muted-foreground">Add workspace</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <CreateWorkspaceModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateWorkspace}
      />

      <InviteMembersModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        workspaceName={newWsName}
        onSubmit={handleSendInvites}
        onSkip={handleSkipInvite}
      />
    </>
  )
}
