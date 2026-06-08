import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export function FinalCTA() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-lg border border-white/10 bg-[#11151a] shadow-[0_24px_90px_rgba(0,0,0,0.28)]">
        <div className="grid gap-8 p-8 md:grid-cols-[1fr_auto] md:items-center lg:p-10">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase text-emerald-300">
              Early access is open
            </p>
            <h2 className="font-display text-4xl font-bold leading-tight tracking-normal text-foreground lg:text-5xl">
              Ready to actually finish work?
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Join the beta, create your first workspace, and see whether
              TeamPoint fits how your team already works.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_18px_48px_rgba(76,119,255,0.25)] transition hover:-translate-y-0.5 hover:bg-primary/90"
            >
              Join the beta <ArrowRight size={16} />
            </Link>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 size={14} className="text-emerald-300" />
              Free during early access
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
