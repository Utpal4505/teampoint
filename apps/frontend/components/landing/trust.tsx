import { Compass, FlaskConical, ShieldCheck } from 'lucide-react'

const TRUST_POINTS = [
  {
    icon: FlaskConical,
    title: 'Currently in beta',
    text: 'TeamPoint is in early access, so the product is still being shaped with real usage.',
  },
  {
    icon: Compass,
    title: 'Designed from real workflows',
    text: 'The core model follows how small teams already work: tasks, discussions, meetings, outcomes.',
  },
  {
    icon: ShieldCheck,
    title: 'Simple by default',
    text: 'No complex rollout, no process migration, no credit card during early access.',
  },
]

export function Trust() {
  return (
    <section className="landing-noise relative bg-white/[0.015] py-24">
      <div className="relative mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase text-emerald-300">
            Early access
          </p>
          <h2 className="font-display text-4xl font-bold leading-tight tracking-normal text-foreground lg:text-5xl">
            Built for small teams, shaped by real users.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            TeamPoint is a proof of concept moving into beta. The goal is not
            to copy Jira or ClickUp. The goal is to make the first version
            useful enough that a small team can actually use it every day.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {TRUST_POINTS.map(point => (
            <div
              key={point.title}
              className="landing-card-hover rounded-lg border border-white/10 bg-[#11151a] p-5"
            >
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <point.icon size={18} />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                {point.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {point.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
