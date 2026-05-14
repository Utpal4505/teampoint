import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Differentiation() {
  const rows = [
    { feature: 'Contextual discussions', tp: true, jira: false, notion: false, linear: false },
    { feature: 'Built for small teams', tp: true, jira: false, notion: true, linear: true },
    { feature: 'No learning curve', tp: true, jira: false, notion: false, linear: true },
    { feature: 'Tasks + Docs + Meetings', tp: true, jira: false, notion: true, linear: false },
    { feature: 'Team workload overview', tp: true, jira: true, notion: false, linear: true },
    { feature: 'Free early access', tp: true, jira: false, notion: false, linear: false },
  ]

  const tools = [
    { name: 'TeamPoint', highlight: true },
    { name: 'Jira', highlight: false },
    { name: 'Notion', highlight: false },
    { name: 'Linear', highlight: false },
  ]

  return (
    <section className="py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/[0.04] px-3.5 py-1.5 mb-5">
            <span className="text-xs font-medium text-muted-foreground">Why TeamPoint</span>
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">Built different</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Most tools are built for enterprise. We&apos;re built for teams that actually ship.
          </p>
        </div>

        <div className="rounded-2xl border border-border/40 overflow-hidden">
          <div className="grid grid-cols-5 border-b border-border/40 bg-card/50">
            <div className="col-span-2 px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Feature</div>
            {tools.map((t, i) => (
              <div key={i} className={cn('px-3 py-3.5 text-xs font-semibold text-center uppercase tracking-wider', t.highlight ? 'text-primary' : 'text-muted-foreground')}>
                {t.name}
              </div>
            ))}
          </div>
          {rows.map((row, i) => (
            <div key={i} className={cn('grid grid-cols-5 border-b border-border/20 last:border-0', i % 2 !== 0 && 'bg-foreground/[0.01]')}>
              <div className="col-span-2 px-5 py-3.5 text-sm text-muted-foreground">{row.feature}</div>
              {[row.tp, row.jira, row.notion, row.linear].map((val, j) => (
                <div key={j} className="px-3 py-3.5 flex items-center justify-center">
                  {val
                    ? <Check size={15} className={j === 0 ? 'text-primary' : 'text-emerald-500'} />
                    : <X size={13} className="text-foreground/20" />}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}