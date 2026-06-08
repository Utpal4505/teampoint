'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { createPortal } from 'react-dom'
import type { ProjectRole } from '@/features/projects/schemas'
import { ROLE_OPTIONS } from '@/features/projects/constants'

export function RoleDropdown({
  value,
  onChange,
}: {
  value: ProjectRole
  onChange: (r: ProjectRole) => void
}) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })
  const btnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => {
      if (
        btnRef.current?.contains(e.target as Node) ||
        menuRef.current?.contains(e.target as Node)
      )
        return
      setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  // Close on scroll
  useEffect(() => {
    if (!open) return
    const h = () => setOpen(false)
    document.addEventListener('scroll', h, true)
    return () => document.removeEventListener('scroll', h, true)
  }, [open])

  function handleOpen() {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    // Open upward: position bottom of menu at top of button
    setCoords({
      top: rect.top - 8, // will be used as `bottom` via transform
      left: rect.right - 192, // 192 = w-48, right-aligned to button
      width: 192,
    })
    setOpen(v => !v)
  }

  const selected = ROLE_OPTIONS.find(r => r.value === value) ?? ROLE_OPTIONS[1]

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/40
          px-2.5 py-1.5 font-sans text-xs text-muted-foreground
          transition-all duration-150
          hover:border-primary/40 hover:bg-accent hover:text-foreground
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        {selected.label}
        <ChevronDown
          size={10}
          className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              width: coords.width,
              transform: 'translateY(-100%)',
              zIndex: 9999,
            }}
            className="overflow-hidden rounded-xl border border-border bg-card
            shadow-[0_-4px_32px_oklch(0_0_0/0.55)]
            animate-in fade-in-0 slide-in-from-bottom-2 duration-150"
          >
            {ROLE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                className={`flex w-full items-center gap-3 px-3.5 py-2.5
                transition-colors duration-100 hover:bg-accent
                ${value === opt.value ? 'bg-accent/60' : ''}`}
              >
                <div className="flex-1 text-left">
                  <p className="font-sans text-xs font-medium text-foreground">
                    {opt.label}
                  </p>
                  <p className="font-sans text-[10px] text-muted-foreground">
                    {opt.desc}
                  </p>
                </div>
                {value === opt.value && (
                  <Check size={12} className="shrink-0 text-primary" />
                )}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  )
}
