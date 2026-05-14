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
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 mb-5">
            <span className="text-xs font-medium text-[#8a8a9a]">Why TeamPoint</span>
          </div>
          <h2 className="font-['Syne'] text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">Built different</h2>
          <p className="text-[#8a8a9a] max-w-md mx-auto">
            Most tools are built for enterprise. We&apos;re built for teams that actually ship.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
          <div className="grid grid-cols-5 border-b border-white/[0.07] bg-white/[0.02]">
            <div className="col-span-2 px-5 py-3.5 text-xs font-semibold text-[#8a8a9a] uppercase tracking-wider">Feature</div>
            {tools.map((t, i) => (
              <div key={i} className={cn('px-3 py-3.5 text-xs font-semibold text-center uppercase tracking-wider', t.highlight ? 'text-[oklch(0.75_0.14_262)]' : 'text-[#8a8a9a]')}>
                {t.name}
              </div>
            ))}
          </div>
          {rows.map((row, i) => (
            <div key={i} className={cn('grid grid-cols-5 border-b border-white/[0.04] last:border-0', i % 2 !== 0 && 'bg-white/[0.01]')}>
              <div className="col-span-2 px-5 py-3.5 text-sm text-[#8a8a9a]">{row.feature}</div>
              {[row.tp, row.jira, row.notion, row.linear].map((val, j) => (
                <div key={j} className="px-3 py-3.5 flex items-center justify-center">
                  {val
                    ? <Check size={15} className={j === 0 ? 'text-[oklch(0.6_0.18_262)]' : 'text-emerald-500'} />
                    : <X size={13} className="text-white/20" />}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}