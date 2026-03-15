import { FileText, Upload, Link2, Archive, FolderOpen } from 'lucide-react'
import type { DocumentFilter } from './documentsTab.types'

const MESSAGES: Record<
  DocumentFilter,
  {
    title: string
    sub: string
    showUpload: boolean
    Icon: React.ElementType
    iconBg: string
    iconColor: string
  }
> = {
  ALL: {
    title: 'No documents yet',
    sub: 'Upload your first document to keep the team in sync.',
    showUpload: true,
    Icon: FolderOpen,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  LINKED: {
    title: 'No linked documents',
    sub: 'Documents linked to tasks or milestones will appear here.',
    showUpload: false,
    Icon: Link2,
    iconBg: 'bg-sky-500/10',
    iconColor: 'text-sky-400',
  },
  UNLINKED: {
    title: 'Everything is linked',
    sub: 'All documents have been linked to project entities — great work!',
    showUpload: false,
    Icon: FileText,
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
  },
  ARCHIVED: {
    title: 'No archived documents',
    sub: 'Archived documents will appear here.',
    showUpload: false,
    Icon: Archive,
    iconBg: 'bg-muted/40',
    iconColor: 'text-muted-foreground/50',
  },
}

interface DocumentEmptyStateProps {
  filter: DocumentFilter
  onUpload: () => void
}

export default function DocumentEmptyState({
  filter,
  onUpload,
}: DocumentEmptyStateProps) {
  const { title, sub, showUpload, Icon, iconBg, iconColor } = MESSAGES[filter]

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5">
      {/* Icon with outer ring */}
      <div className="relative">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl
          border border-border/40 ${iconBg}`}
        >
          <Icon size={26} className={iconColor} />
        </div>
        {/* Decorative ring */}
        <div className="absolute -inset-2 rounded-3xl border border-border/20 -z-10" />
        <div className="absolute -inset-4 rounded-3xl border border-border/10 -z-20" />
      </div>

      <div className="text-center flex flex-col gap-1.5">
        <p className="text-sm font-semibold text-foreground/70">{title}</p>
        <p className="text-[12px] text-muted-foreground/45 max-w-[220px] leading-relaxed">
          {sub}
        </p>
      </div>

      {showUpload && (
        <button
          onClick={onUpload}
          className="flex items-center gap-2 rounded-xl bg-primary/10 border border-primary/20
            px-4 py-2.5 text-xs font-semibold text-primary
            hover:bg-primary/15 hover:border-primary/30 transition-all duration-150"
        >
          <Upload size={12} /> Upload Document
        </button>
      )}
    </div>
  )
}
