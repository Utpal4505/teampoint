import {
  ArrowRight,
  CalendarCheck2,
  CheckSquare2,
  MessageSquareReply,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const PILLARS = [
  {
    icon: CheckSquare2,
    title: 'Tasks that move forward',
    text: 'Clear ownership, simple priorities, and progress your team can scan quickly.',
    accent: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20',
  },
  {
    icon: MessageSquareReply,
    title: 'Discussions that lead to decisions',
    text: 'Keep conversation close to the project, then turn the outcome into a saved decision.',
    accent: 'text-cyan-300 bg-cyan-400/10 border-cyan-400/20',
  },
  {
    icon: CalendarCheck2,
    title: 'Meetings that create action',
    text: 'Capture action items while context is fresh and move them straight into tasks.',
    accent: 'text-amber-300 bg-amber-400/10 border-amber-400/20',
  },
]

export function Solution() {
  return (
    <section className="py-24" id="how-it-works">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.85fr_1fr] lg:items-end">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase text-primary">
              The idea
            </p>
            <h2 className="font-display text-4xl font-bold leading-tight tracking-normal text-foreground lg:text-5xl">
              Built for execution, not management.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground lg:ml-auto">
            TeamPoint is not trying to become the biggest workspace. It is
            trying to become the cleanest path from conversation to finished
            work for small teams.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {PILLARS.map((pillar, index) => (
            <div
              key={pillar.title}
              className="landing-card-hover group rounded-lg border border-white/10 bg-[#11151a] p-6"
            >
              <div
                className={cn(
                  'mb-7 flex h-11 w-11 items-center justify-center rounded-md border',
                  pillar.accent,
                )}
              >
                <pillar.icon size={20} />
              </div>
              <div className="mb-4 flex items-center gap-3">
                <span className="text-xs font-semibold text-muted-foreground">
                  0{index + 1}
                </span>
                <ArrowRight
                  size={14}
                  className="text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground"
                />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {pillar.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
