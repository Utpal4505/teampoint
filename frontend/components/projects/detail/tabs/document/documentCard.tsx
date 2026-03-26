'use client'

import { useState, useRef, useEffect } from 'react'
import {
  FileText,
  FileImage,
  FileCode,
  FileSpreadsheet,
  ExternalLink,
  Link2,
  Archive,
  MoreHorizontal,
  Trash2,
  ArchiveRestore,
} from 'lucide-react'
import type { DocumentWithLinks } from './documentsTab.types'

const FILE_CONFIG: {
  match: (t: string) => boolean
  Icon: React.ElementType
  accent: string
  iconBg: string
  iconColor: string
  label: string
}[] = [
  {
    match: t => t.includes('image'),
    Icon: FileImage,
    label: 'Image',
    accent: 'bg-purple-500',
    iconBg: 'bg-purple-500/15',
    iconColor: 'text-purple-400',
  },
  {
    match: t => t.includes('sheet') || t.includes('excel') || t.includes('csv'),
    Icon: FileSpreadsheet,
    label: 'Spreadsheet',
    accent: 'bg-emerald-500',
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
  },
  {
    match: t => t.includes('json') || t.includes('code') || t.includes('xml'),
    Icon: FileCode,
    label: 'Code',
    accent: 'bg-sky-500',
    iconBg: 'bg-sky-500/15',
    iconColor: 'text-sky-400',
  },
  {
    match: () => true, // fallthrough = PDF / doc
    Icon: FileText,
    label: 'Document',
    accent: 'bg-blue-500',
    iconBg: 'bg-blue-500/15',
    iconColor: 'text-blue-400',
  },
]

function getFileCfg(fileType: string) {
  return FILE_CONFIG.find(c => c.match(fileType.toLowerCase()))!
}

// ── Entity badge meta ─────────────────────────────────────────
const ENTITY_STYLE: Record<string, { icon: string; color: string; bg: string }> = {
  TASK: {
    icon: '🔧',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border border-amber-400/20',
  },
  DISCUSSION: {
    icon: '💬',
    color: 'text-sky-400',
    bg: 'bg-sky-400/10 border border-sky-400/20',
  },
  MILESTONE: {
    icon: '🎯',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10 border border-emerald-400/20',
  },
}

// ── Relative time ─────────────────────────────────────────────
function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function useOutsideClick(ref: React.RefObject<HTMLElement>, cb: () => void) {
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) cb()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, cb])
}

interface DocumentCardProps {
  projectId?: number
  doc: DocumentWithLinks
  onViewLinks: (doc: DocumentWithLinks) => void
  onDelete?: (docId: number) => Promise<void>
  onArchive?: (docId: number) => Promise<void>
  onOpen?: (doc: DocumentWithLinks) => void
}

export default function DocumentCard({
  doc,
  onViewLinks,
  onDelete,
  onArchive,
  onOpen,
}: DocumentCardProps) {
  const cfg = getFileCfg(doc.fileType)
  const linkCount = doc.links.length
  const { Icon } = cfg

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null!)
  useOutsideClick(menuRef, () => setMenuOpen(false))

  const grouped = doc.links.reduce<Record<string, number>>((acc, l) => {
    acc[l.entityType] = (acc[l.entityType] ?? 0) + 1
    return acc
  }, {})

  return (
    <div
      className={`group relative flex flex-col rounded-2xl border bg-card overflow-hidden
        transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/15
        ${doc.isArchived ? 'border-border/30 opacity-55' : 'border-border/60 hover:border-border/90'}`}
    >
      {/* Colored top accent bar */}
      <div className={`h-[3px] w-full ${cfg.accent} opacity-70`} />

      <div className="flex flex-col gap-0 p-4 flex-1">
        {/* Row 1: icon + title + menu */}
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cfg.iconBg}`}
          >
            <Icon size={18} className={cfg.iconColor} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1">
              <div className="min-w-0">
                <h3 className="text-[13px] font-semibold text-foreground truncate leading-tight">
                  {doc.title}
                </h3>
                <span className={`text-[10px] font-medium ${cfg.iconColor} opacity-70`}>
                  {cfg.label}
                </span>
              </div>
              <div ref={menuRef} className="relative shrink-0">
                <button
                  onClick={e => {
                    e.stopPropagation()
                    setMenuOpen(v => !v)
                  }}
                  className="flex h-6 w-6 items-center justify-center rounded-lg
                    text-muted-foreground/40 hover:bg-accent hover:text-muted-foreground
                    transition-colors opacity-0 group-hover:opacity-100"
                >
                  <MoreHorizontal size={13} />
                </button>

                {menuOpen && (
                  <div
                    className="absolute right-0 top-full mt-1 z-30 w-44
                    rounded-xl border border-border bg-background shadow-lg shadow-black/10
                    py-1.5 overflow-hidden"
                  >
                    <button
                      onClick={async () => {
                        setMenuOpen(false)
                        if (onOpen) {
                          await onOpen(doc)
                        }
                      }}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs
                        text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    >
                      <ExternalLink size={12} /> Open
                    </button>

                    <button
                      onClick={() => {
                        setMenuOpen(false)
                        onViewLinks(doc)
                      }}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs
                        text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    >
                      <Link2 size={12} /> View Links
                      {linkCount > 0 && (
                        <span className="ml-auto text-[10px] font-bold text-primary tabular-nums">
                          {linkCount}
                        </span>
                      )}
                    </button>

                    <div className="my-1 border-t border-border/60" />

                    {doc.isArchived ? (
                      <button
                        onClick={async () => {
                          setMenuOpen(false)
                          await onArchive?.(doc.id)
                        }}
                        className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs
                          text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                      >
                        <ArchiveRestore size={12} /> Unarchive
                      </button>
                    ) : (
                      <button
                        onClick={async () => {
                          setMenuOpen(false)
                          await onArchive?.(doc.id)
                        }}
                        className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs
                          text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                      >
                        <Archive size={12} /> Archive
                      </button>
                    )}

                    <button
                      onClick={async () => {
                        setMenuOpen(false)
                        await onDelete?.(doc.id)
                      }}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs
                        text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {doc.description && (
          <p className="text-[12px] text-muted-foreground/60 mt-2.5 line-clamp-2 leading-relaxed">
            {doc.description}
          </p>
        )}

        {/* Spacer */}
        <div className="flex-1 min-h-[12px]" />

        {/* Link badges */}
        <div className="mt-3">
          {linkCount > 0 ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              {Object.entries(grouped).map(([type, count]) => {
                const s = ENTITY_STYLE[type] ?? {
                  icon: '📎',
                  color: 'text-muted-foreground',
                  bg: 'bg-muted/20',
                }
                return (
                  <span
                    key={type}
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5
                      text-[10px] font-semibold ${s.bg} ${s.color}`}
                  >
                    {s.icon} {type.charAt(0) + type.slice(1).toLowerCase()} · {count}
                  </span>
                )
              })}
            </div>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground/30">
              <Link2 size={10} /> No links
            </span>
          )}
        </div>

        <div className="mt-3.5 mb-3 border-t border-border/40" />

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <div
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full
              bg-primary/20 text-[8px] font-bold text-primary"
            >
              {doc.uploaderName ? doc.uploaderName.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="text-[11px] text-muted-foreground/60 truncate">
              {doc.uploaderName || `User ${doc.uploadedBy || '—'}`}
            </span>
            <span className="text-muted-foreground/30 text-[10px]">·</span>
            <span className="text-[11px] text-muted-foreground/40 shrink-0">
              {relativeTime(doc.createdAt)}
            </span>
          </div>

          {/* Archived badge */}
          {doc.isArchived && (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-muted/50
              px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/60 shrink-0"
            >
              <Archive size={8} /> Archived
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={async () => {
              if (onOpen) {
                await onOpen(doc)
              }
            }}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl
              border border-border/50 bg-muted/20 py-2 text-xs font-medium text-muted-foreground
              hover:bg-accent hover:text-foreground hover:border-border/80 transition-all duration-150"
          >
            <ExternalLink size={11} /> Open
          </button>

          <button
            onClick={() => onViewLinks(doc)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl
              border border-border/50 bg-muted/20 py-2 text-xs font-medium text-muted-foreground
              hover:bg-accent hover:text-foreground hover:border-border/80 transition-all duration-150"
          >
            <Link2 size={11} />
            Links
            {linkCount > 0 && (
              <span
                className="flex h-4 min-w-4 items-center justify-center rounded-full
                bg-primary/15 px-1 text-[9px] font-bold text-primary"
              >
                {linkCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
