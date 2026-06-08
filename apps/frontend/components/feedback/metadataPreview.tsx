'use client'

import { useState } from 'react'
import { Monitor, Globe, Cpu, Wifi, Clock, ChevronDown } from 'lucide-react'
import { collectMetadata } from '@/lib/feedback-metadata'

export default function MetadataPreview() {
  const [meta] = useState(() => collectMetadata())
  const [open, setOpen] = useState(false)

  const items = [
    { icon: Globe, label: 'Browser', value: `${meta.browser} ${meta.browser_version}` },
    { icon: Monitor, label: 'OS', value: `${meta.os} ${meta.os_version}` },
    { icon: Cpu, label: 'Device', value: meta.device_type },
    { icon: Wifi, label: 'Network', value: meta.network_status },
    { icon: Clock, label: 'Load', value: `${meta.pageLoadTimeMs}ms` },
  ]

  return (
    <div className="rounded-xl border border-border overflow-hidden text-xs">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between px-3.5 py-2.5
          bg-muted/30 hover:bg-muted/50 transition-colors duration-150"
      >
        <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          <Monitor size={11} />
          Auto-collected device info
        </span>
        <ChevronDown
          size={12}
          className={`text-muted-foreground/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="border-t border-border px-3.5 py-3 bg-muted/10">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-2">
            {items.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-1.5 min-w-0">
                <Icon size={10} className="text-muted-foreground/40 shrink-0" />
                <span className="text-[10px] text-muted-foreground/50 shrink-0">
                  {label}:
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {value}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5 min-w-0 pt-2 border-t border-border/50">
            <Globe size={10} className="text-muted-foreground/40 shrink-0" />
            <span className="text-[10px] text-muted-foreground/50 shrink-0">Page:</span>
            <span className="text-[10px] text-muted-foreground truncate">
              {meta.url || '—'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
