'use client'

import { X } from 'lucide-react'

interface SettingsModalProps {
  title: string
  open: boolean
  onClose: () => void
  children: React.ReactNode
  size?: 'sm' | 'md'
}

export default function SettingsModal({
  title,
  open,
  onClose,
  children,
  size = 'md',
}: SettingsModalProps) {
  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60" onClick={onClose} />
      <div
        className={`fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2
          w-full rounded-2xl border border-border/60 bg-card
          shadow-2xl shadow-black/40 flex flex-col overflow-hidden
          ${size === 'sm' ? 'max-w-sm' : 'max-w-[460px]'}`}
        style={{ maxHeight: '85vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/40 shrink-0">
          <h2 className="text-[13px] font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-md
              text-muted-foreground/50 hover:bg-accent hover:text-foreground
              transition-colors duration-100"
          >
            <X size={13} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </>
  )
}
