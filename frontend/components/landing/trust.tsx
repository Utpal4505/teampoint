import { Star } from 'lucide-react'

export function Trust() {
  const testimonials = [
    { quote: "Finally a tool where my team doesn't need onboarding. We were shipping in 10 minutes.", name: 'Arjun N.', role: 'Founder, early access', avatar: 'A' },
    { quote: 'The contextual discussions are a game changer. No more "which Slack thread was that in?"', name: 'Priya M.', role: 'Product Lead, early access', avatar: 'P' },
    { quote: "Linear is great but overkill for us. TeamPoint is exactly what a 6-person team needs.", name: 'Rahul S.', role: 'CTO, early access', avatar: 'R' },
  ]

  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-primary/5 blur-[100px]" />
      </div>
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-amber-400 fill-amber-400" />)}
          </div>
          <h2 className="font-display text-4xl font-bold text-foreground tracking-tight">Loved by early teams</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div key={i} className="rounded-2xl border border-border/40 bg-card/50 p-6 flex flex-col gap-5">
              <p className="text-sm text-muted-foreground leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}