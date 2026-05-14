import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function FinalCTA() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-primary/10 blur-[100px]" />
      </div>
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-primary">Limited early access spots</span>
        </div>
        <h2 className="font-display text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight mb-6">
          Ready to actually{' '}
          <span className="bg-clip-text text-transparent bg-linear-to-br from-primary to-primary/60">
            ship things?
          </span>
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto">
          Join teams already using TeamPoint to stay focused, move faster, and finish what they start.
        </p>
        <div className="flex flex-col items-center gap-3">
          <Link
            href="/sign-up"
            className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-display font-bold text-primary-foreground hover:opacity-90 transition-all shadow-[0_0_40px_var(--color-primary)]/40 hover:shadow-[0_0_60px_var(--color-primary)]/55 hover:-translate-y-px"
          >
            Get early access — it&apos;s free <ArrowRight size={16} />
          </Link>
          <p className="text-xs text-muted-foreground/60">Free during early access. No spam. No credit card.</p>
        </div>
      </div>
    </section>
  )
}