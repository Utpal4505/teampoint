'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Check, Shield, User, Eye } from 'lucide-react'
import type { WorkspaceRole } from '@/features/inviteMember/schemas'

const ROLE_CONFIG: {
  value: WorkspaceRole
  label: string
  desc:  string
  icon:  React.ReactNode
  color: string
}[] = [
  { value: 'ADMIN',  label: 'Admin',  desc: 'Full access, manage members', icon: <Shield size={12} />, color: 'text-[oklch(0.65_0.14_262)]' },
  { value: 'MEMBER', label: 'Member', desc: 'Can view and edit content',    icon: <User   size={12} />, color: 'text-[oklch(0.58_0.14_145)]' },
  { value: 'VIEWER', label: 'Viewer', desc: 'Read-only access',             icon: <Eye    size={12} />, color: 'text-muted-foreground'       },
]

export function RoleSelect({
  value,
  onChange,
}: {
  value:    WorkspaceRole
  onChange: (r: WorkspaceRole) => void
}) {
  const [open,   setOpen]   = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const btnRef  = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => {
      if (btnRef.current?.contains(e.target as Node) || menuRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  useEffect(() => {
    if (!open) return
    const h = () => setOpen(false)
    document.addEventListener('scroll', h, true)
    return () => document.removeEventListener('scroll', h, true)
  }, [open])

  function handleOpen() {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    setCoords({ top: rect.top, left: rect.left })
    setOpen((v) => !v)
  }

  const selected = ROLE_CONFIG.find((r) => r.value === value)!

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        className="flex h-[42px] shrink-0 items-center gap-2 rounded-xl
          border border-border bg-background px-3
          font-sans text-sm font-medium text-foreground
          transition-all duration-150
          hover:border-primary/40 hover:bg-accent
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
          min-w-[110px] justify-between"
      >
        <div className="flex items-center gap-2">
          <span className={selected.color}>{selected.icon}</span>
          <span>{selected.label}</span>
        </div>
        <ChevronDown size={12} className={`text-muted-foreground/60 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && typeof document !== 'undefined' && createPortal(
        <div
          ref={menuRef}
          style={{
            position:  'fixed',
            top:       coords.top,
            left:      coords.left,
            minWidth:  220,
            transform: 'translateY(-100%) translateY(-6px)',
            zIndex:    9999,
          }}
          className="overflow-hidden rounded-xl border border-border bg-card
            shadow-[0_-8px_40px_oklch(0_0_0/0.55)]
            animate-in fade-in-0 slide-in-from-bottom-2 duration-150"
        >
          {/* Header */}
          <div className="border-b border-border px-4 py-2.5">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
              Select role
            </p>
          </div>

          {ROLE_CONFIG.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={`flex w-full items-center gap-3 px-4 py-3
                transition-colors duration-100 hover:bg-accent
                ${value === opt.value ? 'bg-accent/50' : ''}`}
            >
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center
                rounded-lg bg-muted/60 ${opt.color}`}>
                {opt.icon}
              </div>
              <div className="flex-1 text-left">
                <p className="font-sans text-xs font-semibold text-foreground">{opt.label}</p>
                <p className="font-sans text-[10px] text-muted-foreground">{opt.desc}</p>
              </div>
              {value === opt.value && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                  <Check size={11} className="text-primary" />
                </div>
              )}
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  )
}