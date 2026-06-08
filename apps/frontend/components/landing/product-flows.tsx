'use client'

import { useState } from 'react'
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  GitBranch,
  MessageCircle,
  Plus,
  UserRound,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const FLOWS = [
  {
    label: 'Tasks',
    title: 'Create. Assign. Complete.',
    text: 'Track tasks without overthinking. Every task has an owner, status, and clear next step.',
    icon: ClipboardList,
    accent: 'text-emerald-300',
    steps: ['Create task', 'Assign owner', 'Move to done'],
  },
  {
    label: 'Decisions',
    title: 'Discuss. Decide. Save.',
    text: 'Project discussions stay attached to the work, so decisions do not vanish inside chat threads.',
    icon: MessageCircle,
    accent: 'text-cyan-300',
    steps: ['Start discussion', 'Agree on outcome', 'Save decision'],
  },
  {
    label: 'Meetings',
    title: 'Meet. Capture. Act.',
    text: 'Turn meeting notes into action items while the context is still fresh.',
    icon: CalendarDays,
    accent: 'text-amber-300',
    steps: ['Run meeting', 'Capture actions', 'Create tasks'],
  },
]

function FlowVisual({ steps }: { steps: string[] }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#11151a] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
      <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </div>
        <span className="text-[11px] font-medium text-muted-foreground">
          Live workflow
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step} className="relative">
            <div className="landing-card-hover rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                {index === 0 ? (
                  <Plus size={18} />
                ) : index === 1 ? (
                  <UserRound size={18} />
                ) : (
                  <CheckCircle2 size={18} />
                )}
              </div>
              <span className="text-[11px] font-semibold uppercase text-muted-foreground">
                Step {index + 1}
              </span>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {step}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className="landing-flow-line absolute left-[calc(100%-2px)] top-1/2 z-10 hidden h-px w-4 bg-white/20 sm:block" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-3">
        <div className="flex items-center gap-2 text-sm font-medium text-emerald-200">
          <GitBranch size={15} />
          Connected back to the project timeline
        </div>
      </div>
    </div>
  )
}

export function ProductFlows() {
  const [active, setActive] = useState(0)
  const flow = FLOWS[active]

  return (
    <section className="landing-noise relative bg-white/[0.015] py-24">
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-10 max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase text-cyan-300">
            Product flow
          </p>
          <h2 className="font-display text-4xl font-bold leading-tight tracking-normal text-foreground lg:text-5xl">
            People understand flows faster than features.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            TeamPoint connects the three places where small teams usually lose
            momentum: tasks, discussions, and meetings.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {FLOWS.map((item, index) => (
            <button
              key={item.label}
              onClick={() => setActive(index)}
              className={cn(
                'inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm font-semibold transition',
                active === index
                  ? 'border-primary/40 bg-primary text-primary-foreground'
                  : 'border-white/10 bg-white/[0.03] text-muted-foreground hover:border-white/20 hover:text-foreground',
              )}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="landing-card-hover rounded-lg border border-white/10 bg-[#11151a] p-6">
            <flow.icon size={26} className={flow.accent} />
            <h3 className="mt-6 text-3xl font-semibold leading-tight text-foreground">
              {flow.title}
            </h3>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              {flow.text}
            </p>
          </div>

          <FlowVisual steps={flow.steps} />
        </div>
      </div>
    </section>
  )
}
