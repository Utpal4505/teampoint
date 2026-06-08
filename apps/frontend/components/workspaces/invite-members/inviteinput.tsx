import { Mail, Plus, AlertCircle } from 'lucide-react'
import { RoleSelect } from './roleselect'
import type { WorkspaceRole } from '@/features/inviteMember/schemas'

interface InviteInputProps {
  email:         string
  role:          WorkspaceRole
  error?:        string
  onEmailChange: (v: string) => void
  onRoleChange:  (r: WorkspaceRole) => void
  onAdd:         () => void
}

export function InviteInput({ email, role, error, onEmailChange, onRoleChange, onAdd }: InviteInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {/* Email field */}
        <div className="relative flex-1">
          <Mail size={13} className="pointer-events-none absolute left-3.5 top-1/2
            -translate-y-1/2 text-muted-foreground/50" />
          <input
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onAdd() } }}
            placeholder="colleague@company.com"
            className={`w-full rounded-xl border pl-9 pr-4 h-[42px] font-sans text-sm
              text-foreground placeholder:text-muted-foreground/30 outline-none bg-background
              transition-all duration-200
              ${error
                ? 'border-destructive/50 shadow-[0_0_0_3px_oklch(0.62_0.2_25/0.1)]'
                : 'border-border hover:border-muted-foreground/30 focus:border-primary/60 focus:shadow-[0_0_0_3px_oklch(0.6_0.16_262/0.1)]'
              }`}
          />
        </div>

        {/* Role — same h-[42px] as email input */}
        <RoleSelect value={role} onChange={onRoleChange} />

        {/* Add button */}
        <button type="button" onClick={onAdd}
          className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl
            bg-primary text-primary-foreground font-bold
            shadow-[0_2px_12px_oklch(0.6_0.16_262/0.35)] transition-all duration-200
            hover:-translate-y-px hover:shadow-[0_4px_20px_oklch(0.6_0.16_262/0.5)]
            active:translate-y-0 active:scale-[0.97]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="flex items-center gap-1.5 font-sans text-[11px] text-destructive">
          <AlertCircle size={10} className="shrink-0" /> {error}
        </p>
      )}

      <p className="font-sans text-[10px] text-muted-foreground/40 pl-0.5">
        Press <kbd className="rounded bg-muted px-1 py-px font-mono text-[9px] text-muted-foreground">Enter</kbd> or click + to add multiple
      </p>
    </div>
  )
}