'use client'

import { useState } from 'react'
import { X, CheckCircle2, LayoutGrid, Calendar, Search, Link2 } from 'lucide-react'
import type { DocumentWithLinks } from './documentsTab.types'

// ── Fake entities per type — swap with real data later ────────
const FAKE_ENTITIES: Record<string, { id: number; title: string; meta?: string }[]> = {
  TASK: [
    { id: 1, title: 'Setup CI Pipeline', meta: 'In Progress' },
    { id: 2, title: 'Fix navbar bug', meta: 'Todo' },
    { id: 3, title: 'Write API documentation', meta: 'In Progress' },
    { id: 4, title: 'Design system review', meta: 'Done' },
    { id: 5, title: 'Database migration script', meta: 'Todo' },
    { id: 6, title: 'Deploy to staging', meta: 'Todo' },
  ],
  MEETING: [
    { id: 10, title: 'Backend Planning', meta: 'Jan 20' },
    { id: 11, title: 'Sprint Kickoff', meta: 'Jan 15' },
    { id: 12, title: 'API Design Review', meta: 'Jan 18' },
    { id: 13, title: 'Q1 Retrospective', meta: 'Feb 1' },
  ],
}

const ENTITY_TYPES: {
  key: string
  label: string
  Icon: React.ElementType
  color: string
  bg: string
  border: string
  activeBg: string
}[] = [
  {
    key: 'TASK',
    label: 'Task',
    Icon: LayoutGrid,
    color: 'text-amber-400',
    bg: 'bg-amber-400/8',
    border: 'border-amber-400/25',
    activeBg: 'bg-amber-400/15',
  },
  {
    key: 'MEETING',
    label: 'Meeting',
    Icon: Calendar,
    color: 'text-sky-400',
    bg: 'bg-sky-400/8',
    border: 'border-sky-400/25',
    activeBg: 'bg-sky-400/15',
  },
]

interface DocumentLinkModalProps {
  doc: DocumentWithLinks
  onClose: () => void
  // onLink will be wired to POST /document-links later
  onLink?: (entityType: string, entityId: number) => void
}

export default function DocumentLinkModal({
  doc,
  onClose,
  onLink,
}: DocumentLinkModalProps) {
  const [entityType, setEntityType] = useState<string>('TASK')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<number | null>(null)

  // Already linked entity IDs for this type — prevent duplicates
  const alreadyLinked = new Set(
    doc.links.filter(l => l.entityType === entityType).map(l => l.entityId),
  )

  const entities = FAKE_ENTITIES[entityType] ?? []
  const filtered = entities.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()),
  )

  const activeMeta = ENTITY_TYPES.find(t => t.key === entityType)!

  function handleConfirm() {
    if (selected === null) return
    onLink?.(entityType, selected)
    onClose()
  }

  return (
    <>
      {/* Backdrop — no blur, cheaper paint */}
      <div className="fixed inset-0 z-60 bg-black/50" onClick={onClose} />

      <div
        className="fixed left-1/2 top-1/2 z-60 -translate-x-1/2 -translate-y-1/2
        w-full max-w-[420px] rounded-2xl border border-border bg-background
        shadow-2xl shadow-black/30 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <Link2 size={13} className="text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Link to Entity</h2>
              <p className="text-[10px] text-muted-foreground/50 truncate max-w-[220px]">
                {doc.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg
              text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 p-5 overflow-y-auto flex-1">
          {/* Entity type toggle */}
          <div className="flex gap-2">
            {ENTITY_TYPES.map(t => {
              const isActive = entityType === t.key
              return (
                <button
                  key={t.key}
                  onClick={() => {
                    setEntityType(t.key)
                    setSelected(null)
                    setSearch('')
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl border
                    py-2.5 text-xs font-semibold transition-colors duration-100
                    ${
                      isActive
                        ? `${t.activeBg} ${t.border} ${t.color}`
                        : 'border-border/50 bg-muted/20 text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                >
                  <t.Icon size={13} />
                  {t.label}
                </button>
              )
            })}
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40"
            />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`Search ${activeMeta.label.toLowerCase()}s…`}
              className="w-full rounded-xl border border-border/60 bg-muted/20 pl-8 pr-3 py-2.5
                text-xs text-foreground placeholder:text-muted-foreground/35 outline-none
                focus:border-primary/40 focus:bg-background transition-colors duration-100"
            />
          </div>

          {/* Entity list */}
          <div className="flex flex-col gap-1.5 max-h-[240px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-[12px] text-muted-foreground/40">
                  No {activeMeta.label.toLowerCase()}s found
                </p>
              </div>
            ) : (
              filtered.map(entity => {
                const isSelected = selected === entity.id
                const isLinked = alreadyLinked.has(entity.id)

                return (
                  <button
                    key={entity.id}
                    disabled={isLinked}
                    onClick={() => setSelected(isSelected ? null : entity.id)}
                    className={`relative flex items-center gap-3 rounded-xl border px-3 py-2.5
                      text-left transition-colors duration-100 w-full
                      ${
                        isLinked
                          ? 'border-border/30 bg-muted/10 opacity-40 cursor-not-allowed'
                          : isSelected
                            ? `${activeMeta.activeBg} ${activeMeta.border}`
                            : 'border-border/50 bg-muted/10 hover:bg-accent/50 hover:border-border/80'
                      }`}
                  >
                    {/* Checkbox */}
                    <div
                      className={`flex h-4 w-4 shrink-0 items-center justify-center
                      rounded-full border transition-colors duration-100
                      ${
                        isSelected
                          ? `${activeMeta.bg} ${activeMeta.border}`
                          : 'border-border/60'
                      }`}
                    >
                      {isSelected && (
                        <div
                          className={`h-2 w-2 rounded-full ${activeMeta.color.replace('text-', 'bg-')}`}
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-[12px] font-medium truncate
                        ${isSelected ? activeMeta.color : 'text-foreground/80'}`}
                      >
                        {entity.title}
                      </p>
                      {entity.meta && (
                        <p className="text-[10px] text-muted-foreground/45 mt-0.5">
                          {entity.meta}
                        </p>
                      )}
                    </div>

                    {isLinked && (
                      <span className="text-[10px] text-muted-foreground/50 shrink-0">
                        Already linked
                      </span>
                    )}
                    {isSelected && (
                      <CheckCircle2
                        size={14}
                        className={`shrink-0 ${activeMeta.color}`}
                      />
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between gap-3 px-5 py-4
          border-t border-border/60 bg-muted/10 shrink-0"
        >
          <p className="text-[11px] text-muted-foreground/40">
            {selected !== null
              ? `1 ${activeMeta.label.toLowerCase()} selected`
              : `Select a ${activeMeta.label.toLowerCase()} to link`}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-border/60 bg-background px-4 py-2 text-xs
                font-medium text-muted-foreground hover:bg-accent hover:text-foreground
                transition-colors duration-100"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selected === null}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold
                text-primary-foreground hover:bg-primary/90 transition-colors duration-100
                disabled:opacity-35 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <Link2 size={11} /> Link
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
