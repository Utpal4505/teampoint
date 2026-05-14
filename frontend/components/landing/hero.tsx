'use client'

import Link from 'next/link'
import { ArrowRight, CalendarDays, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

const PREVIEW_TASKS = [
  { id: 1, col: 'todo', title: '🔧 Build core features', priority: 'MEDIUM', priorityColor: 'text-blue-400 bg-blue-400/10 border-blue-400/20', due: '2 days left', avatar: 'U' },
  { id: 2, col: 'todo', title: '🧪 Test with users', priority: 'LOW', priorityColor: 'text-muted-foreground bg-white/5 border-white/10', due: '4 days left', avatar: 'P' },
  { id: 3, col: 'inprogress', title: '🎨 Design the UI', priority: 'URGENT', priorityColor: 'text-red-400 bg-red-400/10 border-red-400/20', due: 'Due today', avatar: 'A' },
  { id: 4, col: 'done', title: '💡 Define the idea', priority: 'HIGH', priorityColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20', due: 'Completed', avatar: 'R' },
]

const COL_CFG = {
  todo: { label: 'TODO', accent: 'text-muted-foreground', border: 'border-border/40', glow: 'transparent' },
  inprogress: { label: 'IN PROGRESS', accent: 'text-amber-400', border: 'border-amber-400/20', glow: 'oklch(0.7 0.15 55 / 0.04)' },
  done: { label: 'DONE', accent: 'text-emerald-400', border: 'border-emerald-400/20', glow: 'oklch(0.52 0.15 145 / 0.04)' },
}

function MiniCard({ task }: { task: typeof PREVIEW_TASKS[0] }) {
  return (
    <div className="rounded-xl border border-border/30 bg-card p-3 flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <span className={cn('text-[10px] font-bold uppercase tracking-wider border rounded-md px-1.5 py-0.5', task.priorityColor)}>
          {task.priority}
        </span>
        <GripVertical size={11} className="text-white/20" />
      </div>
      <p className="text-xs font-medium text-foreground/80 leading-snug">{task.title}</p>
      <div className="border-t border-border/30" />
      <div className="flex items-center justify-between">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[9px] font-bold text-primary">
          {task.avatar}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
          <CalendarDays size={9} />
          {task.due}
        </div>
      </div>
    </div>
  )
}

export function KanbanPreview() {
  const cols = ['todo', 'inprogress', 'done'] as const
  return (
    <div className="rounded-2xl border border-border/40 bg-card/80 backdrop-blur p-4 grid grid-cols-3 gap-3">
      {cols.map(col => {
        const cfg = COL_CFG[col]
        const tasks = PREVIEW_TASKS.filter(t => t.col === col)
        return (
          <div
            key={col}
            className={cn('rounded-xl border flex flex-col gap-2 p-3', cfg.border)}
            style={{ background: `linear-gradient(180deg, ${cfg.glow} 0%, transparent 40%)` }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={cn('text-[10px] font-bold uppercase tracking-widest', cfg.accent)}>{cfg.label}</span>
              <span className="text-[10px] text-muted-foreground/50 font-medium">{tasks.length}</span>
            </div>
            {tasks.map(t => <MiniCard key={t.id} task={t} />)}
          </div>
        )
      })}
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
      </div>
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.3]"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      <div className="relative mx-auto max-w-6xl px-6 w-full py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-primary">Now in Early Access</span>
          </div>

          <h1 className="font-display text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.05] tracking-tight">
            Stop managing work.{' '}
            <span className="bg-clip-text text-transparent bg-linear-to-br from-primary to-primary/60">
              Start finishing it.
            </span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
            TeamPoint helps small teams stay focused on tasks, decisions, and progress — without the clutter of traditional tools.
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/sign-up"
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-display font-bold text-primary-foreground hover:opacity-90 transition-all shadow-[0_0_30px_var(--color-primary)]/40 hover:shadow-[0_0_40px_var(--color-primary)]/55 hover:-translate-y-px"
              >
                Get early access <ArrowRight size={15} />
              </Link>
              <a
                href="#how-it-works"
                className="flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-sans font-medium text-muted-foreground hover:border-foreground/20 hover:text-foreground transition-all"
              >
                See how it works
              </a>
            </div>
            <p className="text-xs text-muted-foreground/60">Free during early access. No spam.</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl -z-10 scale-95" />
          <KanbanPreview />
        </div>
      </div>
    </section>
  )
}