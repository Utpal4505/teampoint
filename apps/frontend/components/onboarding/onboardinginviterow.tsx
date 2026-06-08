'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, X, AlertCircle, ChevronDown, Check, UserPlus } from 'lucide-react'

export type MemberRole = 'ADMIN' | 'MEMBER'
export interface InvitedMember {
  email: string
  role: MemberRole
}

const ROLES: { value: MemberRole; description: string }[] = [
  { value: 'ADMIN', description: 'Full access, can manage workspace' },
  { value: 'MEMBER', description: 'Can view and edit projects' },
]

const ROLE_STYLES: Record<MemberRole, { badge: string; dot: string }> = {
  ADMIN: {
    badge:
      'text-[oklch(0.7_0.14_262)]  bg-[oklch(0.6_0.16_262/0.12)] border-[oklch(0.6_0.16_262/0.25)]',
    dot: 'bg-[oklch(0.6_0.16_262)]',
  },
  MEMBER: {
    badge:
      'text-[oklch(0.72_0_0)]       bg-[oklch(0.25_0.01_250)]      border-[oklch(0.32_0.01_250)]',
    dot: 'bg-[oklch(0.55_0_0)]',
  },
}

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
}

// ── Custom Role Dropdown ──────────────────────────────────────
function RoleDropdown({
  value,
  onChange,
}: {
  value: MemberRole
  onChange: (r: MemberRole) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`
          flex items-center gap-2 rounded-xl border px-4 py-4 w-[130px]
          font-[family-name:var(--body-family)] text-sm outline-none
          transition-all duration-150
          ${
            open
              ? 'border-[oklch(0.6_0.16_262/0.7)] bg-[oklch(0.22_0.012_255)] shadow-[0_0_0_3px_oklch(0.6_0.16_262/0.1)] text-[oklch(0.92_0_0)]'
              : 'border-[oklch(0.28_0.01_250)] bg-[oklch(0.19_0.01_250)] text-[oklch(0.72_0_0)] hover:border-[oklch(0.35_0.01_250)] hover:bg-[oklch(0.22_0.01_250)]'
          }
        `}
      >
        <span
          className={`h-[6px] w-[6px] rounded-full shrink-0 ${ROLE_STYLES[value].dot}`}
        />
        <span className="flex-1 text-left">{value}</span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-[oklch(0.45_0_0)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 top-[calc(100%+6px)] z-50 w-60
          rounded-xl border border-[oklch(0.28_0.01_250)]
          bg-[oklch(0.19_0.01_250)]
          shadow-[0_12px_40px_oklch(0_0_0/0.6),0_2px_8px_oklch(0_0_0/0.3)]
          overflow-hidden"
        >
          <div
            className="h-px w-full"
            style={{
              background:
                'linear-gradient(90deg,transparent,oklch(0.6 0.16 262/0.35),transparent)',
            }}
          />
          <div className="p-2">
            {ROLES.map(r => (
              <button
                key={r.value}
                type="button"
                onClick={() => {
                  onChange(r.value)
                  setOpen(false)
                }}
                className={`
                            flex w-full items-center gap-3 rounded-md px-3 py-2 my-0.5 text-left
                            transition-all duration-200
                            ${
                              value === r.value
                                ? 'bg-[oklch(0.6_0.16_262/0.12)]'
                                : 'hover:bg-[oklch(0.25_0.01_250)]'
                            }
                        `}
              >
                <span
                  className={`h-2 w-2 rounded-full shrink-0 ${ROLE_STYLES[r.value].dot}`}
                />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-[family-name:var(--body-family)] text-sm text-[oklch(0.88_0_0)]">
                    {r.value}
                  </span>
                  <span className="font-[family-name:var(--body-family)] text-[11px] text-[oklch(0.45_0_0)] leading-tight">
                    {r.description}
                  </span>
                </div>
                {value === r.value && (
                  <Check size={13} className="shrink-0 text-[oklch(0.6_0.16_262)]" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────
interface OnboardingInviteRowProps {
  members: InvitedMember[]
  onChange: (members: InvitedMember[]) => void
}

export function OnboardingInviteRow({ members, onChange }: OnboardingInviteRowProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<MemberRole>('MEMBER')
  const [error, setError] = useState('')
  const [focused, setFocused] = useState(false)

  function add() {
    const trimmed = email.trim()
    if (!trimmed) {
      setError('Enter an email address')
      return
    }
    if (!isValidEmail(trimmed)) {
      setError('Enter a valid email address')
      return
    }
    if (members.some(m => m.email === trimmed)) {
      setError('Already added')
      return
    }
    onChange([...members, { email: trimmed, role }])
    setEmail('')
    setError('')
  }

  function remove(idx: number) {
    onChange(members.filter((_, i) => i !== idx))
  }
  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      add()
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Input group */}
      <div className="flex flex-col gap-2">
        <label className="font-[family-name:var(--body-family)] text-sm text-[oklch(0.72_0_0)]">
          Email address
        </label>

        {/* Row 1: email field full width */}
        <input
          type="email"
          value={email}
          onChange={e => {
            setEmail(e.target.value)
            setError('')
          }}
          onKeyDown={handleKey}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="teammate@company.com"
          className={`
            w-full rounded-xl border px-4 py-4
            font-[family-name:var(--body-family)] text-sm
            text-[oklch(0.92_0_0)] placeholder:text-[oklch(0.38_0_0)]
            outline-none transition-all duration-150
            ${
              error
                ? 'border-[oklch(0.62_0.2_25/0.7)] bg-[oklch(0.22_0.005_15)] shadow-[0_0_0_3px_oklch(0.62_0.2_25/0.08)]'
                : focused
                  ? 'border-[oklch(0.6_0.16_262/0.7)] bg-[oklch(0.22_0.012_255)] shadow-[0_0_0_3px_oklch(0.6_0.16_262/0.1)]'
                  : 'border-[oklch(0.28_0.01_250)] bg-[oklch(0.19_0.01_250)] hover:border-[oklch(0.33_0.01_250)]'
            }
          `}
        />

        {/* Row 2: role dropdown + add button */}
        <div className="flex items-center gap-2">
          <RoleDropdown value={role} onChange={setRole} />

          <button
            type="button"
            onClick={add}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl
              bg-[oklch(0.6_0.16_262)] px-4 py-4
              font-[family-name:var(--body-family)] text-sm font-medium
              text-[oklch(0.98_0_0)]
              shadow-[0_2px_12px_oklch(0.6_0.16_262/0.25)]
              transition-all duration-150
              hover:-translate-y-px hover:bg-[oklch(0.56_0.16_262)]
              hover:shadow-[0_4px_20px_oklch(0.6_0.16_262/0.4)]
              active:translate-y-0 active:scale-[0.97]
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-[oklch(0.6_0.16_262)]"
          >
            <Plus size={15} />
            Add member
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="flex items-center gap-2 font-[family-name:var(--body-family)] text-xs text-[oklch(0.72_0.15_25)]">
            <AlertCircle size={12} className="shrink-0" />
            {error}
          </p>
        )}
      </div>

      {/* Member list */}
      {members.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="font-[family-name:var(--body-family)] text-xs text-[oklch(0.45_0_0)]">
            {members.length} {members.length === 1 ? 'person' : 'people'} will be invited
          </p>
          <div
            className="flex flex-col gap-[6px] rounded-xl border border-[oklch(0.25_0.01_250)] bg-[oklch(0.175_0.008_255)] p-2 overflow-y-auto"
            style={{ maxHeight: '224px' }}
          >
            {members.map((m, i) => (
              <div
                key={m.email}
                className="group flex items-center justify-between gap-4 rounded-lg
                  bg-[oklch(0.21_0.01_250)] px-4 py-3
                  transition-colors duration-150 hover:bg-[oklch(0.235_0.01_250)]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full
                    bg-[oklch(0.6_0.16_262/0.15)]
                    font-[family-name:var(--body-family)] text-xs font-medium text-[oklch(0.65_0.12_262)]"
                  >
                    {m.email[0].toUpperCase()}
                  </div>
                  <span className="truncate font-[family-name:var(--body-family)] text-sm text-[oklch(0.75_0_0)]">
                    {m.email}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={`rounded-md border px-2 py-[3px] font-[family-name:var(--body-family)] text-[11px] font-medium ${ROLE_STYLES[m.role].badge}`}
                  >
                    {m.role}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg
                      text-[oklch(0.38_0_0)] opacity-0 transition-all duration-150
                      hover:bg-[oklch(0.62_0.2_25/0.12)] hover:text-[oklch(0.72_0.15_25)]
                      group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty state hint */
        <div
          className="flex items-center justify-center gap-3 rounded-xl border border-dashed
          border-[oklch(0.27_0.01_250)] py-8"
        >
          <UserPlus size={16} className="text-[oklch(0.35_0_0)]" />
          <p className="font-[family-name:var(--body-family)] text-sm text-[oklch(0.38_0_0)]">
            No teammates added yet
          </p>
        </div>
      )}
    </div>
  )
}
