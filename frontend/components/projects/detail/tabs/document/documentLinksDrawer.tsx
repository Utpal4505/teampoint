'use client'

import { useState } from 'react'
import { X, Plus, ExternalLink, Link2 } from 'lucide-react'
import type { DocumentWithLinks, LinkEntityType } from './documentsTab.types'
import DocumentLinkModal from './documentLinkModal'

const ENTITY_META: Record<
  LinkEntityType,
  {
    icon: string
    label: string
    color: string
    bg: string
    border: string
  }
> = {
  TASK: {
    icon: '🔧',
    label: 'Tasks',
    color: 'text-amber-400',
    bg: 'bg-amber-400/8',
    border: 'border-amber-400/20',
  },
  DISCUSSION: {
    icon: '💬',
    label: 'Discussions',
    color: 'text-sky-400',
    bg: 'bg-sky-400/8',
    border: 'border-sky-400/20',
  },
  MILESTONE: {
    icon: '🎯',
    label: 'Milestones',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/8',
    border: 'border-emerald-400/20',
  },
}

interface DocumentLinksDrawerProps {
  doc: DocumentWithLinks
  onClose: () => void
}

export default function DocumentLinksDrawer({ doc, onClose }: DocumentLinksDrawerProps) {
  const [linkModalOpen, setLinkModalOpen] = useState(false)

  const grouped = doc.links.reduce<Partial<Record<LinkEntityType, typeof doc.links>>>(
    (acc, l) => {
      if (!acc[l.entityType]) acc[l.entityType] = []
      acc[l.entityType]!.push(l)
      return acc
    },
    {},
  )

  const entityTypes = Object.keys(grouped) as LinkEntityType[]
  const totalLinks = doc.links.length

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 z-50 h-full w-[300px] border-l border-border
        bg-background flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-border/60">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Link2 size={14} className="text-primary" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-foreground leading-tight">
                  Document Links
                </h2>
                <p className="text-[11px] text-muted-foreground/50 truncate mt-0.5">
                  {doc.title}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg mt-0.5
                text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Link count summary */}
          {totalLinks > 0 && (
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground/50">
                {totalLinks} link{totalLinks !== 1 ? 's' : ''} across {entityTypes.length}{' '}
                type{entityTypes.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto py-4 px-4 flex flex-col gap-3">
          {entityTypes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl
                bg-muted/40 border border-border/60"
              >
                <Link2 size={18} className="text-muted-foreground/30" />
              </div>
              <div className="text-center">
                <p className="text-[13px] font-medium text-muted-foreground/50">
                  No links yet
                </p>
                <p className="text-[11px] text-muted-foreground/35 mt-1 max-w-[180px] leading-relaxed">
                  Link this document to tasks, discussions, or milestones.
                </p>
              </div>
            </div>
          ) : (
            entityTypes.map(type => {
              const meta = ENTITY_META[type]
              const items = grouped[type]!
              return (
                <div
                  key={type}
                  className={`rounded-xl border ${meta.border} ${meta.bg} overflow-hidden`}
                >
                  {/* Group header */}
                  <div className="flex items-center gap-2 px-3 py-2.5 border-b border-inherit">
                    <span className="text-[11px]">{meta.icon}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest ${meta.color}`}
                    >
                      {meta.label}
                    </span>
                    <span
                      className={`ml-auto text-[10px] font-bold tabular-nums ${meta.color} opacity-60`}
                    >
                      {items.length}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="flex flex-col divide-y divide-border/30">
                    {items.map(link => (
                      <div
                        key={link.id}
                        className="flex items-center gap-2.5 px-3 py-2.5
                          hover:bg-black/5 dark:hover:bg-white/5 transition-colors group/item"
                      >
                        <span className="flex-1 text-[12px] font-medium text-foreground/80 truncate">
                          {link.entityTitle}
                        </span>
                        <ExternalLink
                          size={11}
                          className="text-muted-foreground/25 group-hover/item:text-muted-foreground/60
                            shrink-0 transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-border/60">
          <button
            onClick={() => setLinkModalOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl
              border border-dashed border-border/70 py-2.5 text-xs font-medium
              text-muted-foreground hover:bg-accent hover:text-foreground hover:border-border
              transition-all duration-150"
          >
            <Plus size={12} /> Link to Entity
          </button>
        </div>
      </div>

      {/* Link modal — sits above the drawer */}
      {linkModalOpen && (
        <DocumentLinkModal
          doc={doc}
          onClose={() => setLinkModalOpen(false)}
          onLink={(entityType, entityId) => {
            // TODO: wire to POST /document-links
            console.log('Link', doc.id, '→', entityType, entityId)
            setLinkModalOpen(false)
          }}
        />
      )}
    </>
  )
}
