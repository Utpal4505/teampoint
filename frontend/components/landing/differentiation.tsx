import { CheckCircle2, MinusCircle } from 'lucide-react'

const ROWS = [
  {
    others: 'Feature-heavy',
    teampoint: 'Focused workflow',
  },
  {
    others: 'Complex setup',
    teampoint: 'Start in 2 minutes',
  },
  {
    others: 'Endless options',
    teampoint: 'Clear next step',
  },
  {
    others: 'Work scattered',
    teampoint: 'Tasks, decisions, and meetings connected',
  },
]

export function Differentiation() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase text-amber-300">
            Why not another tool?
          </p>
          <h2 className="font-display text-4xl font-bold leading-tight tracking-normal text-foreground lg:text-5xl">
            Not another complicated workspace.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Notion is flexible, Jira is powerful, ClickUp is loaded. TeamPoint
            is built for the smaller team that wants less tool management and
            more finished work.
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-white/10 bg-[#11151a] shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
          <div className="hidden grid-cols-2 border-b border-white/10 bg-white/[0.03] sm:grid">
            <div className="px-5 py-4 text-sm font-semibold text-muted-foreground">
              Typical tools
            </div>
            <div className="border-l border-white/10 px-5 py-4 text-sm font-semibold text-primary">
              TeamPoint
            </div>
          </div>

          {ROWS.map(row => (
            <div
              key={row.others}
              className="grid border-b border-white/8 transition hover:bg-white/[0.025] last:border-b-0 sm:grid-cols-2"
            >
              <div className="flex items-center gap-3 px-5 pb-2 pt-4 text-sm text-muted-foreground sm:py-4">
                <MinusCircle size={16} className="shrink-0 text-rose-300/80" />
                {row.others}
              </div>
              <div className="flex items-center gap-3 px-5 pb-4 pt-2 text-sm text-foreground sm:border-l sm:border-white/10 sm:py-4">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-300" />
                {row.teampoint}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
