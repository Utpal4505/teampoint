'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  const faqs = [
    { q: 'Is TeamPoint really free during early access?', a: "Yes — completely free. No credit card, no catch. We're building with early teams and want your feedback." },
    { q: 'How many people can I invite?', a: "You can invite your entire team. There's no per-seat limit during early access." },
    { q: 'What happens after early access?', a: "We'll introduce a fair pricing model. Early access users will get a special discount and we'll notify you well in advance." },
    { q: 'Is my data secure?', a: 'Yes. All data is encrypted in transit and at rest. We follow security best practices from day one.' },
    { q: 'Can I migrate from Jira or Notion?', a: "We're working on import tools. For now, getting started fresh takes under 5 minutes." },
    { q: 'What makes TeamPoint different from Linear?', a: "Linear is great for engineering teams. TeamPoint is for any small team — design, product, operations — with built-in discussions, meetings, and docs." },
  ]

  return (
    <section id="faq" className="py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center mb-14">
          <h2 className="font-['Syne'] text-4xl font-bold text-white tracking-tight mb-4">FAQ</h2>
          <p className="text-[#8a8a9a]">Everything you&apos;d want to know before signing up.</p>
        </div>
        <div className="flex flex-col gap-3">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-sm font-medium text-white pr-4">{f.q}</span>
                <ChevronDown size={16} className={cn('shrink-0 text-[#8a8a9a] transition-transform duration-200', open === i && 'rotate-180')} />
              </button>
              {open === i && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-[#8a8a9a] leading-relaxed">{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}