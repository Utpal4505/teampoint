'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { STATUS_CONFIG } from '@/features/projects/constants'
import type { ProjectStatus } from '@/features/projects/detail/types'

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'ON_HOLD', label: 'Paused' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'DELETED', label: 'Archived' },
]

interface StatusBadgeProps {
  status: ProjectStatus
  projectId: number
  onStatusChange?: (status: ProjectStatus) => void
}

export default function StatusBadge({ status, onStatusChange }: StatusBadgeProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const cfg = STATUS_CONFIG[status]

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5
          text-[10px] font-semibold uppercase tracking-wider transition-all duration-150
          hover:opacity-80 ${cfg.color} ${cfg.bg} ${cfg.border}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
        {cfg.label}
        <ChevronDown
          size={9}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 top-[calc(100%+6px)] z-50 w-40
          overflow-hidden rounded-xl border border-border bg-card
          shadow-[0_8px_32px_oklch(0_0_0/0.4)]
          animate-in fade-in-0 zoom-in-95 duration-150 origin-top-left"
        >
          {STATUS_OPTIONS.map(opt => {
            const c = STATUS_CONFIG[opt.value]
            return (
              <button
                key={opt.value}
                onClick={() => {
                  onStatusChange?.(opt.value)
                  setOpen(false)
                }}
                className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium
                  transition-colors hover:bg-accent/50
                  ${status === opt.value ? 'text-foreground' : 'text-muted-foreground'}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
                {opt.label}
                {status === opt.value && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
