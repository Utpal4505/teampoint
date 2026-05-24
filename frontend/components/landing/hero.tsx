'use client'

import Link from 'next/link'
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  MessageSquareText,
  PlayCircle,
  Sparkles,
  Target,
  UserRoundCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const BOARD_TASKS = [
  {
    status: 'To Do',
    items: [
      {
        title: 'Finalize beta onboarding',
        meta: 'Owner: Aisha',
        accent: 'border-l-cyan-400',
      },
      {
        title: 'Ship empty states',
        meta: 'Due tomorrow',
        accent: 'border-l-amber-400',
      },
    ],
  },
  {
    status: 'In Progress',
    items: [
      {
        title: 'Convert meeting notes into tasks',
        meta: '3 action items',
        accent: 'border-l-emerald-400',
      },
      {
        title: 'Review waitlist copy',
        meta: 'Decision needed',
        accent: 'border-l-rose-400',
      },
    ],
  },
  {
    status: 'Done',
    items: [
      {
        title: 'Create early access workspace',
        meta: 'Completed',
        accent: 'border-l-primary',
      },
    ],
  },
]

function WorkCard({
  title,
  meta,
  accent,
}: {
  title: string
  meta: string
  accent: string
}) {
  return (
    <div
      className={cn(
        'rounded-lg border border-white/8 bg-white/[0.04] p-3 shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition hover:border-white/16 hover:bg-white/[0.06]',
        'border-l-2',
        accent,
      )}
    >
      <p className="text-[13px] font-medium leading-snug text-foreground">{title}</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-[11px] text-muted-foreground">{meta}</span>
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
      </div>
    </div>
  )
}

export function ProductPreview() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-white/10 bg-[#11151a] shadow-[0_30px_90px_rgba(0,0,0,0.38)]">
      <div className="h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md">
            <img src="/logo-dot-teampoint.svg" alt="TeamPoint" className="h-7 w-7 object-contain" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Product Sprint</p>
            <p className="text-[11px] text-muted-foreground">
              Tasks, decisions, meetings
            </p>
          </div>{' '}
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <span className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[11px] font-medium text-emerald-300">
            6 active
          </span>
          <span className="rounded-md border border-amber-400/20 bg-amber-400/10 px-2 py-1 text-[11px] font-medium text-amber-300">
            2 decisions
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          {[
            { label: 'Tasks', active: true },
            { label: 'Discussions', active: false },
            { label: 'Meetings', active: false },
          ].map(item => (
            <span
              key={item.label}
              className={cn(
                'rounded-md border px-2.5 py-1 text-[11px] font-medium',
                item.active
                  ? 'border-primary/30 bg-primary/15 text-primary'
                  : 'border-white/8 bg-white/[0.025] text-muted-foreground',
              )}
            >
              {item.label}
            </span>
          ))}
        </div>
        <div className="hidden items-center gap-1.5 text-[11px] text-muted-foreground md:flex">
          <Clock3 size={12} className="text-emerald-300" />
          Updated 4 min ago
        </div>
      </div>

      <div className="grid gap-0 xl:grid-cols-[1fr_250px]">
        <div className="grid gap-3 p-4 sm:grid-cols-3">
          {BOARD_TASKS.map(column => (
            <div
              key={column.status}
              className="min-h-[198px] rounded-lg border border-white/8 bg-black/10 p-3 transition hover:bg-white/[0.025]"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase text-muted-foreground">
                  {column.status}
                </p>
                <span className="text-[11px] text-muted-foreground/70">
                  {column.items.length}
                </span>
              </div>
              <div className="space-y-3">
                {column.items.map(item => (
                  <WorkCard key={item.title} {...item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 bg-white/[0.025] p-4 xl:border-l xl:border-t-0">
          <div className="mb-4 flex items-center gap-2">
            <MessageSquareText size={15} className="text-cyan-300" />
            <p className="text-sm font-semibold text-foreground">Discussion outcome</p>
          </div>
          <div className="rounded-lg border border-white/8 bg-white/[0.04] p-3">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Keep onboarding simple. Ask for workspace name, invite team, then land on
              tasks.
            </p>
            <div className="mt-3 flex items-center gap-2 text-[11px] font-medium text-emerald-300">
              <CheckCircle2 size={13} />
              Decision saved
            </div>
          </div>

          <div className="my-4 h-px bg-white/10" />

          <div className="mb-3 flex items-center gap-2">
            <CalendarDays size={15} className="text-amber-300" />
            <p className="text-sm font-semibold text-foreground">Meeting actions</p>
          </div>
          <div className="space-y-2">
            {['Assign landing copy', 'Create beta invite flow'].map(action => (
              <div
                key={action}
                className="landing-card-hover flex items-center gap-2 rounded-md border border-white/8 bg-black/10 px-3 py-2"
              >
                <ClipboardCheck size={13} className="text-primary" />
                <span className="text-[12px] text-muted-foreground">{action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16">
      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14 lg:py-16">
        <div className="flex flex-col gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5">
            <Sparkles size={13} className="text-emerald-300" />
            <span className="text-xs font-medium text-emerald-200">
              Free during early access
            </span>
          </div>

          <div className="space-y-5">
            <h1 className="max-w-[600px] font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
              Stop managing work.{' '}
              <span className="text-foreground font-medium">Start finishing it.</span>
            </h1>
            <p className="max-w-lg text-lg leading-8 text-muted-foreground">
              TeamPoint helps small startup and dev teams keep tasks, discussions, and
              meeting action items connected without the clutter of{' '}
              <strong className="text-foreground">Jira</strong>,{' '}
              <strong className="text-foreground">ClickUp</strong>, or endless Notion
              pages.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_18px_48px_rgba(76,119,255,0.28)] transition hover:-translate-y-0.5 hover:bg-primary/90"
            >
              Get early access <ArrowRight size={16} />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-5 text-sm font-medium text-foreground transition hover:border-white/20 hover:bg-white/[0.06]"
            >
              <PlayCircle size={16} />
              See the flow
            </a>
          </div>

          <div className="grid max-w-xl gap-3 pt-2 sm:grid-cols-3">
            {[
              'Start in 2 minutes',
              'Built for small teams',
              'AI features coming next',
            ].map(text => (
              <div
                key={text}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <UserRoundCheck size={14} className="text-emerald-300" />
                {text}
              </div>
            ))}
          </div>
        </div>

        <ProductPreview />
      </div>
    </section>
  )
}
