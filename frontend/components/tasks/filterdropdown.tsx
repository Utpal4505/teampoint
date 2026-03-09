'use client'

import { useState, useRef, useEffect } from 'react'
import { SlidersHorizontal, Check, User, FolderKanban } from 'lucide-react'
import { STATUS_CONFIG, PRIORITY_CONFIG } from '@/features/tasks/constants'
import type { Filters, Status, Priority, TaskType } from '@/features/tasks/types'

interface FilterDropdownProps {
  filters: Filters
  onChange: (filters: Filters) => void
  onClear: () => void
}

export default function FilterDropdown({
  filters,
  onChange,
  onClear,
}: FilterDropdownProps) {
  const [open, setOpen] = useState<boolean>(false)
  const [local, setLocal] = useState<Filters>(filters)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function toggle(key: keyof Filters, val: string) {
    setLocal(prev => {
      const arr = (prev[key] || []) as string[]
      const next = arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]
      return { ...prev, [key]: next }
    })
  }

  const activeCount = Object.values(filters).flat().filter(Boolean).length

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => {
          setLocal(filters)
          setOpen(v => !v)
        }}
        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-all duration-150 font-sans
          ${
            activeCount > 0
              ? 'border-primary/50 bg-primary/10 text-primary'
              : 'border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground'
          }`}
        style={{ color: activeCount > 0 ? 'oklch(0.6 0.16 262)' : undefined }}
      >
        <SlidersHorizontal size={14} />
        Filter
        {activeCount > 0 && (
          <span
            className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
            style={{ background: 'oklch(0.6 0.16 262)', color: 'white' }}
          >
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-72 rounded-2xl border border-border bg-card shadow-[0_16px_48px_oklch(0_0_0/0.5)]"
          style={{ animation: 'fadeSlideDown 0.15s ease' }}
        >
          <div className="border-b border-border px-4 py-3">
            <p className="font-display text-sm font-bold text-foreground">Filter Tasks</p>
          </div>

          <div className="flex flex-col gap-4 p-4">
            {/* Status */}
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Status
              </p>
              <div className="flex flex-col gap-1">
                {(['TODO', 'IN_PROGRESS', 'DONE'] as Status[]).map(s => (
                  <label
                    key={s}
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-foreground/80 hover:bg-accent/50 transition-colors"
                  >
                    <div
                      onClick={() => toggle('status', s)}
                      className={`flex h-4 w-4 items-center justify-center rounded border transition-all
                        ${(local.status || []).includes(s) ? 'border-primary bg-primary/20' : 'border-border'}`}
                    >
                      {(local.status || []).includes(s) && (
                        <Check size={10} style={{ color: 'oklch(0.6 0.16 262)' }} />
                      )}
                    </div>
                    {STATUS_CONFIG[s].label}
                  </label>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Priority
              </p>
              <div className="flex flex-col gap-1">
                {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as Priority[]).map(p => (
                  <label
                    key={p}
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-accent/50"
                  >
                    <div
                      onClick={() => toggle('priority', p)}
                      className={`flex h-4 w-4 items-center justify-center rounded border transition-all
                        ${(local.priority || []).includes(p) ? 'border-primary bg-primary/20' : 'border-border'}`}
                    >
                      {(local.priority || []).includes(p) && (
                        <Check size={10} style={{ color: 'oklch(0.6 0.16 262)' }} />
                      )}
                    </div>
                    <span className={PRIORITY_CONFIG[p].color}>
                      {PRIORITY_CONFIG[p].label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Task Type */}
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Task Type
              </p>
              <div className="flex gap-2">
                {(['PERSONAL', 'PROJECT'] as TaskType[]).map(t => (
                  <button
                    key={t}
                    onClick={() => toggle('type', t)}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-all
                      ${
                        (local.type || []).includes(t)
                          ? 'border-primary/50 bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:bg-accent'
                      }`}
                    style={
                      (local.type || []).includes(t)
                        ? { color: 'oklch(0.6 0.16 262)' }
                        : {}
                    }
                  >
                    {t === 'PERSONAL' ? <User size={11} /> : <FolderKanban size={11} />}
                    {t.charAt(0) + t.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 border-t border-border px-4 py-3">
            <button
              onClick={() => {
                onClear()
                setOpen(false)
              }}
              className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
            >
              Clear Filters
            </button>
            <button
              onClick={() => {
                onChange(local)
                setOpen(false)
              }}
              className="flex-1 rounded-xl px-3 py-2 text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: 'oklch(0.6 0.16 262)' }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
