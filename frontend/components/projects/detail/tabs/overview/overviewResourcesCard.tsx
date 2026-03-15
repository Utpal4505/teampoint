import { ArrowRight, FileText, Calendar } from 'lucide-react'
import type { TabKey } from '../../projectdetailpage'

interface OverviewResourcesCardProps {
  documentCount: number
  onTabChange: (tab: TabKey) => void
}

export default function OverviewResourcesCard({
  documentCount,
  onTabChange,
}: OverviewResourcesCardProps) {
  return (
    <div className="flex-1 rounded-2xl border border-border/60 bg-card p-5 flex flex-col gap-3">
      <h3 className="text-sm font-bold text-foreground">Resources</h3>

      {/* Documents — clickable */}
      <button
        onClick={() => onTabChange('documents')}
        className="group flex items-center gap-3 rounded-xl border border-border/50
          bg-muted/20 p-3.5 hover:bg-accent/40 hover:border-border/80
          transition-all duration-150 text-left"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
          bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/15 transition-colors">
          <FileText size={14} className="text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground">Documents</p>
          <p className="text-[10px] text-muted-foreground/60 mt-0.5">
            {documentCount} file{documentCount !== 1 ? 's' : ''} uploaded
          </p>
        </div>
        <ArrowRight
          size={13}
          className="text-muted-foreground/40 group-hover:text-muted-foreground
            group-hover:translate-x-0.5 transition-all duration-150"
        />
      </button>

      {/* Meetings — coming soon */}
      <div className="flex items-center gap-3 rounded-xl border border-border/40
        bg-muted/10 p-3.5 opacity-50 cursor-not-allowed">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
          bg-emerald-500/10 border border-emerald-500/20">
          <Calendar size={14} className="text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground">Meetings</p>
          <p className="text-[10px] text-muted-foreground/60 mt-0.5">Coming soon</p>
        </div>
      </div>
    </div>
  )
}