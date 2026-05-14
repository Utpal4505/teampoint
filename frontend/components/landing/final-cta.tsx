import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function FinalCTA() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[oklch(0.6_0.18_262/0.1)] blur-[100px]" />
      </div>
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[oklch(0.6_0.18_262/0.3)] bg-[oklch(0.6_0.18_262/0.08)] px-3.5 py-1.5 mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.6_0.18_262)] animate-pulse" />
          <span className="text-xs font-medium text-[oklch(0.75_0.14_262)]">Limited early access spots</span>
        </div>
        <h2 className="font-['Syne'] text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
          Ready to actually{' '}
          <span style={{ backgroundImage: 'linear-gradient(135deg, oklch(0.7 0.18 262), oklch(0.65 0.2 300))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ship things?
          </span>
        </h2>
        <p className="text-lg text-[#8a8a9a] mb-10 max-w-lg mx-auto">
          Join teams already using TeamPoint to stay focused, move faster, and finish what they start.
        </p>
        <div className="flex flex-col items-center gap-3">
          <Link
            href="/sign-up"
            className="flex items-center gap-2 rounded-xl bg-[oklch(0.6_0.18_262)] px-8 py-3.5 text-base font-bold text-white hover:bg-[oklch(0.65_0.18_262)] transition-all shadow-[0_0_40px_oklch(0.6_0.18_262/0.4)] hover:shadow-[0_0_60px_oklch(0.6_0.18_262/0.55)] hover:-translate-y-px"
          >
            Get early access — it&apos;s free <ArrowRight size={16} />
          </Link>
          <p className="text-xs text-[#55556a]">Free during early access. No spam. No credit card.</p>
        </div>
      </div>
    </section>
  )
}