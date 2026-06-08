'use client'

import { useState } from 'react'
import {
  BadgeDollarSign,
  Box,
  Brain,
  ChevronDown,
  Clock3,
  Layers3,
  ShieldQuestion,
  UsersRound,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const FAQS = [
  {
    icon: Box,
    question: 'What does TeamPoint actually do?',
    answer:
      'TeamPoint helps small teams manage tasks, project discussions, decisions, and meeting action items in one focused workspace. The point is simple: less clutter, more finished work.',
  },
  {
    icon: UsersRound,
    question: 'Who is TeamPoint for?',
    answer:
      'It is mainly for small startup teams and dev teams that need structure, but do not want the weight of Jira, ClickUp, or a custom Notion setup.',
  },
  {
    icon: Layers3,
    question: 'How is it different from Notion, Jira, or ClickUp?',
    answer:
      'Notion is flexible but can become manual. Jira and ClickUp are powerful but often too heavy for small teams. TeamPoint focuses on a connected workflow: task, discussion, decision, meeting, action.',
  },
  {
    icon: Zap,
    question: 'Is TeamPoint available right now?',
    answer:
      'TeamPoint is in beta early access. You can join early and help shape what the product becomes.',
  },
  {
    icon: BadgeDollarSign,
    question: 'Is it free?',
    answer:
      'Yes. TeamPoint is free during early access, and you do not need a credit card to start.',
  },
  {
    icon: Clock3,
    question: 'How long does setup take?',
    answer:
      'The goal is under 2 minutes: create a workspace, invite the team, and start adding work. No complex onboarding.',
  },
  {
    icon: ShieldQuestion,
    question: 'Will this become just another tool my team ignores?',
    answer:
      'That is the main risk TeamPoint is designed against. The product keeps the core workflow obvious so teammates know where work lives and what needs to happen next.',
  },
  {
    icon: Brain,
    question: 'What is coming next?',
    answer:
      'AI features are planned next, focused on reducing manual work around planning, meeting notes, and turning conversations into useful action items.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-10 text-center">
          <p className="mb-4 text-xs font-semibold uppercase text-primary">
            FAQ
          </p>
          <h2 className="font-display text-4xl font-bold tracking-normal text-foreground">
            Clear answers before you start.
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, index) => {
            const Icon = item.icon
            const isOpen = open === index

            return (
              <div
                key={item.question}
                className={cn(
                  'landing-card-hover rounded-lg border bg-[#11151a]',
                  isOpen ? 'border-primary/35' : 'border-white/10',
                )}
              >
                <button
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : index)}
                  className="flex w-full items-center gap-3 px-4 py-4 text-left"
                >
                  <span
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-md border',
                      isOpen
                        ? 'border-primary/25 bg-primary/10 text-primary'
                        : 'border-white/10 bg-white/[0.03] text-muted-foreground',
                    )}
                  >
                    <Icon size={17} />
                  </span>
                  <span className="flex-1 text-sm font-semibold leading-6 text-foreground">
                    {item.question}
                  </span>
                  <ChevronDown
                    size={17}
                    className={cn(
                      'shrink-0 text-muted-foreground transition',
                      isOpen && 'rotate-180 text-primary',
                    )}
                  />
                </button>

                <div
                  className={cn(
                    'grid transition-all duration-200',
                    isOpen
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0',
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-4 pb-4 pl-[4.25rem] text-sm leading-6 text-muted-foreground">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
