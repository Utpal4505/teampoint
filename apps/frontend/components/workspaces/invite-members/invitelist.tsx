import { Trash2, Users } from 'lucide-react'
import { RoleSelect } from './roleselect'
import type { InviteEntry, WorkspaceRole } from '@/features/inviteMember/schemas'

interface InviteListProps {
  invites:       InviteEntry[]
  workspaceName: string
  onRemove:      (id: string) => void
  onRoleChange:  (id: string, role: WorkspaceRole) => void
}

export function InviteList({ invites, workspaceName, onRemove, onRoleChange }: InviteListProps) {
  if (invites.length === 0) {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-dashed
        border-border/50 bg-muted/20 px-5 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center
          rounded-xl bg-muted/60">
          <Users size={15} className="text-muted-foreground/40" />
        </div>
        <div>
          <p className="font-sans text-xs font-medium text-muted-foreground/60">No invites added yet</p>
          <p className="font-sans text-[10px] text-muted-foreground/40 mt-0.5">
            Add teammates to <span className="text-muted-foreground/60">{workspaceName}</span> above
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      {/* List header */}
      <div className="flex items-center justify-between border-b border-border
        bg-muted/30 px-4 py-2">
        <span className="font-sans text-[10px] font-semibold uppercase tracking-wider
          text-muted-foreground/50">
          Pending — {invites.length}
        </span>
        <span className="font-sans text-[10px] font-semibold uppercase tracking-wider
          text-muted-foreground/50">
          Role
        </span>
      </div>

      <div className="flex flex-col divide-y divide-border/50"
        style={{ maxHeight: '192px', overflowY: 'auto' }}>
        {invites.map((invite) => (
          <div key={invite.id}
            className="group flex items-center gap-3 px-4 py-3
              transition-colors duration-100 hover:bg-accent/30">
            {/* Avatar */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center
              rounded-full bg-primary/10 font-sans text-xs font-bold text-primary">
              {invite.email[0].toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-sans text-xs font-medium text-foreground truncate">
                {invite.email}
              </p>
              <p className="font-sans text-[10px] text-muted-foreground/60 mt-0.5">
                Invite pending · {invite.role.charAt(0) + invite.role.slice(1).toLowerCase()}
              </p>
            </div>

            <RoleSelect value={invite.role} onChange={(r) => onRoleChange(invite.id, r)} />

            <button onClick={() => onRemove(invite.id)}
              className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg
                text-muted-foreground/25 opacity-0 group-hover:opacity-100
                transition-all duration-150
                hover:bg-destructive/10 hover:text-destructive">
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}