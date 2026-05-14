'use client'

import Link from 'next/link'
import { ArrowRight, CalendarDays, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

const PREVIEW_TASKS = [
  { id: 1, col: 'todo', title: '🔧 Build core features', priority: 'MEDIUM', priorityColor: 'text-blue-400 bg-blue-400/10 border-blue-400/20', due: '2 days left', avatar: 'U' },
  { id: 2, col: 'todo', title: '🧪 Test with users', priority: 'LOW', priorityColor: 'text-[#8a8a9a] bg-white/5 border-white/10', due: '4 days left', avatar: 'P' },
  { id: 3, col: 'inprogress', title: '🎨 Design the UI', priority: 'URGENT', priorityColor: 'text-red-400 bg-red-400/10 border-red-400/20', due: 'Due today', avatar: 'A' },
  { id: 4, col: 'done', title: '💡 Define the idea', priority: 'HIGH', priorityColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20', due: 'Completed', avatar: 'R' },
]

const COL_CFG = {
  todo: { label: 'TODO', accent: 'text-[#8a8a9a]', border: 'border-white/[0.08]', glow: 'transparent' },
  inprogress: { label: 'IN PROGRESS', accent: 'text-amber-400', border: 'border-amber-400/20', glow: 'oklch(0.7 0.15 55 / 0.04)' },
  done: { label: 'DONE', accent: 'text-emerald-400', border: 'border-emerald-400/20', glow: 'oklch(0.52 0.15 145 / 0.04)' },
}

function MiniCard({ task }: { task: typeof PREVIEW_TASKS[0] }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#0e0e12] p-3 flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <span className={cn('text-[10px] font-bold uppercase tracking-wider border rounded-md px-1.5 py-0.5', task.priorityColor)}>
          {task.priority}
        </span>
        <GripVertical size={11} className="text-white/20" />
      </div>
      <p className="text-xs font-medium text-white/80 leading-snug">{task.title}</p>
      <div className="border-t border-white/[0.06]" />
      <div className="flex items-center justify-between">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[oklch(0.6_0.18_262/0.2)] text-[9px] font-bold text-[oklch(0.75_0.14_262)]">
          {task.avatar}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-white/30">
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
    <div className="rounded-2xl border border-white/[0.07] bg-[#0e0e12]/80 backdrop-blur p-4 grid grid-cols-3 gap-3">
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
              <span className="text-[10px] text-white/30 font-medium">{tasks.length}</span>
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
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[oklch(0.6_0.18_262/0.07)] blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[oklch(0.55_0.2_280/0.05)] blur-[100px]" />
      </div>
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.3]"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      <div className="relative mx-auto max-w-6xl px-6 w-full py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[oklch(0.6_0.18_262/0.3)] bg-[oklch(0.6_0.18_262/0.08)] px-3.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.6_0.18_262)] animate-pulse" />
            <span className="text-xs font-medium text-[oklch(0.75_0.14_262)]">Now in Early Access</span>
          </div>

          <h1 className="font-['Syne'] text-5xl lg:text-6xl font-extrabold text-white leading-[1.05] tracking-tight">
            Stop managing work.{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, oklch(0.7 0.18 262), oklch(0.65 0.2 300))' }}>
              Start finishing it.
            </span>
          </h1>

          <p className="text-lg text-[#8a8a9a] leading-relaxed max-w-md">
            TeamPoint helps small teams stay focused on tasks, decisions, and progress — without the clutter of traditional tools.
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/sign-up"
                className="flex items-center gap-2 rounded-xl bg-[oklch(0.6_0.18_262)] px-6 py-3 text-sm font-bold text-white hover:bg-[oklch(0.65_0.18_262)] transition-all shadow-[0_0_30px_oklch(0.6_0.18_262/0.4)] hover:shadow-[0_0_40px_oklch(0.6_0.18_262/0.55)] hover:-translate-y-px"
              >
                Get early access <ArrowRight size={15} />
              </Link>
              <a
                href="#how-it-works"
                className="flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-[#8a8a9a] hover:border-white/20 hover:text-white transition-all"
              >
                See how it works
              </a>
            </div>
            <p className="text-xs text-[#55556a]">Free during early access. No spam.</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-[oklch(0.6_0.18_262/0.08)] rounded-2xl blur-xl -z-10 scale-95" />
          <KanbanPreview />
        </div>
      </div>
    </section>
  )
}