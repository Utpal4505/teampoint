'use client'

import { useState, useMemo } from 'react'
import { Upload, FileText, Link2, Archive, FolderOpen } from 'lucide-react'

import { FAKE_DOCUMENTS } from './fakeData'
import DocumentFilterBar from './documentFilterBar'
import DocumentCard from './documentCard'
import DocumentLinksDrawer from './documentLinksDrawer'
import DocumentUploadModal from './documentUploadModal'
import DocumentEmptyState from './documentEmptyState'
import type { DocumentFilter, DocumentWithLinks } from './documentsTab.types'

const PAGE_SIZE = 6

export default function DocumentsTab() {
  const docs = FAKE_DOCUMENTS

  const [filter, setFilter] = useState<DocumentFilter>('ALL')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [drawerDoc, setDrawerDoc] = useState<DocumentWithLinks | null>(null)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  // ── Counts ────────────────────────────────────────────────
  const counts = useMemo<Record<DocumentFilter, number>>(
    () => ({
      ALL: docs.length,
      LINKED: docs.filter(d => d.links.length > 0).length,
      UNLINKED: docs.filter(d => d.links.length === 0 && !d.isArchived).length,
      ARCHIVED: docs.filter(d => d.isArchived).length,
    }),
    [docs],
  )

  // ── Filtered ──────────────────────────────────────────────
  const filtered = useMemo(() => {
    switch (filter) {
      case 'LINKED':
        return docs.filter(d => d.links.length > 0)
      case 'UNLINKED':
        return docs.filter(d => d.links.length === 0 && !d.isArchived)
      case 'ARCHIVED':
        return docs.filter(d => d.isArchived)
      default:
        return docs
    }
  }, [docs, filter])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = filtered.length > visibleCount

  function handleFilterChange(f: DocumentFilter) {
    setFilter(f)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <>
      <div className="p-6 flex flex-col gap-6">
        {/* ── Page header ─────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-bold text-foreground">Documents</h2>
            <p className="text-[12px] text-muted-foreground/50">
              All files and references for this project
            </p>
          </div>

          <button
            onClick={() => setUploadOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2
              text-xs font-semibold text-primary-foreground shrink-0
              hover:bg-primary/90 transition-all duration-150 shadow-sm shadow-primary/20"
          >
            <Upload size={12} /> Upload
          </button>
        </div>

        {/* ── Stats strip ─────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-3">
          {[
            {
              label: 'Total',
              value: counts.ALL,
              Icon: FolderOpen,
              color: 'text-primary',
              bg: 'bg-primary/5',
              border: 'border-primary/15',
            },
            {
              label: 'Linked',
              value: counts.LINKED,
              Icon: Link2,
              color: 'text-sky-400',
              bg: 'bg-sky-400/5',
              border: 'border-sky-400/15',
            },
            {
              label: 'Unlinked',
              value: counts.UNLINKED,
              Icon: FileText,
              color: 'text-amber-400',
              bg: 'bg-amber-400/5',
              border: 'border-amber-400/15',
            },
            {
              label: 'Archived',
              value: counts.ARCHIVED,
              Icon: Archive,
              color: 'text-muted-foreground',
              bg: 'bg-muted/20',
              border: 'border-border/40',
            },
          ].map(s => (
            <div
              key={s.label}
              className={`flex items-center gap-3 rounded-2xl border ${s.border} ${s.bg} px-4 py-3`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${s.bg} border ${s.border}`}
              >
                <s.Icon size={14} className={s.color} />
              </div>
              <div>
                <p className={`text-lg font-bold tabular-nums leading-none ${s.color}`}>
                  {s.value}
                </p>
                <p className="text-[10px] text-muted-foreground/50 mt-0.5 uppercase tracking-wider">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filter bar ──────────────────────────────────────── */}
        <DocumentFilterBar
          active={filter}
          counts={counts}
          onChange={handleFilterChange}
        />

        {/* ── Cards grid ──────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <DocumentEmptyState filter={filter} onUpload={() => setUploadOpen(true)} />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map(doc => (
                <DocumentCard key={doc.id} doc={doc} onViewLinks={d => setDrawerDoc(d)} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center">
                <button
                  onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
                  className="rounded-xl border border-border/60 bg-muted/20 px-6 py-2.5
                    text-xs font-medium text-muted-foreground
                    hover:bg-accent hover:text-foreground transition-all duration-150"
                >
                  Load more
                  <span className="ml-1.5 text-muted-foreground/40">
                    · {filtered.length - visibleCount} remaining
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {drawerDoc && (
        <DocumentLinksDrawer doc={drawerDoc} onClose={() => setDrawerDoc(null)} />
      )}

      {uploadOpen && <DocumentUploadModal onClose={() => setUploadOpen(false)} />}
    </>
  )
}
