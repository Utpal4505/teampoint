'use client'

import { useState, useRef, useEffect } from 'react'
import {
  MoreHorizontal,
  Pencil,
  Users,
  ChevronRight,
  Archive,
  Trash2,
  Check,
} from 'lucide-react'
import type { ProjectDetail, ProjectStatus } from '@/features/projects/detail/types'
import type { ModalState } from './projectdetailpage'
import { STATUS_CONFIG } from '@/features/projects/constants'

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'ON_HOLD', label: 'Paused' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'DELETED', label: 'Archived' },
]

interface ProjectMenuProps {
  project: ProjectDetail
  onOpenModal: (modal: ModalState) => void
}

export default function ProjectMenu({ project, onOpenModal }: ProjectMenuProps) {
  const [open, setOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setStatusOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function close() {
    setOpen(false)
    setStatusOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex h-8 w-8 items-center justify-center rounded-xl border
          transition-all duration-150
          ${
            open
              ? 'border-border bg-accent text-foreground'
              : 'border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground'
          }`}
      >
        <MoreHorizontal size={15} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+6px)] z-50 w-52
          overflow-hidden rounded-xl border border-border bg-card
          shadow-[0_12px_40px_oklch(0_0_0/0.5)]
          animate-in fade-in-0 zoom-in-95 duration-150 origin-top-right"
        >
          <button
            onClick={() => {
              onOpenModal({ type: 'edit' })
              close()
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium
              text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Pencil size={13} /> Edit Project
          </button>

          <button
            onClick={() => {
              onOpenModal({ type: 'members' })
              close()
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium
              text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Users size={13} /> Manage Members
          </button>

          {/* Change Status submenu */}
          <div className="relative">
            <button
              onClick={() => setStatusOpen(o => !o)}
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium
                text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Change Status
              <ChevronRight
                size={12}
                className={`ml-auto transition-transform ${statusOpen ? 'rotate-90' : ''}`}
              />
            </button>

            {statusOpen && (
              <div className="border-t border-border/40">
                {STATUS_OPTIONS.map(opt => {
                  const cfg = STATUS_CONFIG[opt.value]
                  return (
                    <button
                      key={opt.value}
                      onClick={close}
                      className="flex w-full items-center gap-2.5 pl-8 pr-3.5 py-2 text-xs font-medium
                        text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                      {opt.label}
                      {project.status === opt.value && (
                        <Check size={11} className="ml-auto text-primary" />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="mx-3 my-1 h-px bg-border/60" />

          <button
            onClick={close}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium
              text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Archive size={13} /> Archive Project
          </button>

          <button
            onClick={() => {
              onOpenModal({ type: 'delete' })
              close()
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium
              text-destructive transition-colors hover:bg-destructive/10"
          >
            <Trash2 size={13} /> Delete Project
          </button>
        </div>
      )}
    </div>
  )
}
