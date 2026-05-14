export function Problem() {
  const pains = [
    { icon: '😩', text: "Endless status meetings that could've been a message" },
    { icon: '🗂️', text: 'Tasks scattered across 5 different tools' },
    { icon: '😶‍🌫️', text: "No one knows what's actually blocking progress" },
    { icon: '🔔', text: 'Notification overload that kills deep work' },
  ]

  return (
    <section id="product" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-destructive/5 blur-[100px]" />
      </div>
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-destructive/20 bg-destructive/10 px-3.5 py-1.5 mb-5">
            <span className="text-xs font-medium text-destructive">The problem</span>
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Your team is busy.<br />But is it{' '}
            <span className="text-destructive">actually productive?</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Small teams waste hours every week on coordination overhead — not the actual work.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {pains.map((p, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-border/40 bg-card/50 p-4">
              <span className="text-2xl shrink-0">{p.icon}</span>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}