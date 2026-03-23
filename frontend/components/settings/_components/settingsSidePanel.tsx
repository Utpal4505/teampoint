'use client'

import { X } from 'lucide-react'

interface SettingsSidePanelProps {
  title: string
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function SettingsSidePanel({
  title,
  open,
  onClose,
  children,
}: SettingsSidePanelProps) {
  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 z-50 h-full w-full max-w-[420px]
        border-l border-border bg-background flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4
          border-b border-border/60 shrink-0"
        >
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg
              text-muted-foreground hover:bg-accent hover:text-foreground
              transition-colors duration-100"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </>
  )
}
