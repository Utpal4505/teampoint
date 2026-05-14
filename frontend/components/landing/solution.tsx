import { CheckSquare, MessageSquare, Users, BarChart2, Zap, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Solution() {
  const features = [
    { icon: CheckSquare, color: 'text-emerald-400', bg: 'bg-emerald-400/10', title: 'Tasks, not tickets', desc: 'Simple Kanban + list view. No ceremonies, no config. Just work.' },
    { icon: MessageSquare, color: 'text-primary', bg: 'bg-primary/12', title: 'Discussions in context', desc: 'Every project has channels. Talk where the work lives.' },
    { icon: Users, color: 'text-amber-400', bg: 'bg-amber-400/10', title: 'Team visibility', desc: "See who's doing what. No standups required." },
    { icon: BarChart2, color: 'text-blue-400', bg: 'bg-blue-400/10', title: 'Progress at a glance', desc: 'Overview dashboards that actually tell you something.' },
    { icon: Zap, color: 'text-violet-400', bg: 'bg-violet-400/10', title: 'Fast by design', desc: 'No bloat, no loading spinners. Built for speed.' },
    { icon: Shield, color: 'text-teal-400', bg: 'bg-teal-400/10', title: 'Roles & permissions', desc: 'Owner, Admin, Member — control what each person can do.' },
  ]

  return (
    <section className="py-28 relative" id="how-it-works">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      </div>
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 mb-5">
            <span className="text-xs font-medium text-primary">The solution</span>
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Everything your team needs.<br />
            <span className="bg-clip-text text-transparent bg-linear-to-br from-primary to-primary/60">
              Nothing it doesn&apos;t.
            </span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            TeamPoint combines tasks, communication, and visibility into one lean workspace.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={i} className="group rounded-2xl border border-border/40 bg-card/50 p-6 hover:border-border hover:bg-card transition-all duration-200">
              <div className={cn('mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl', f.bg)}>
                <f.icon size={18} className={f.color} />
              </div>
              <h3 className="font-display text-base font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}