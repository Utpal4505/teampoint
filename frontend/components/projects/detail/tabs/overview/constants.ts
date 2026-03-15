import { Flame, ChevronUp, Minus, Flag } from 'lucide-react'

export const PRIORITY_META = {
  URGENT: { label: 'Urgent', color: 'bg-red-500',    text: 'text-red-400',    icon: Flame     },
  HIGH:   { label: 'High',   color: 'bg-orange-400', text: 'text-orange-400', icon: ChevronUp },
  MEDIUM: { label: 'Medium', color: 'bg-amber-400',  text: 'text-amber-400',  icon: Minus     },
  LOW:    { label: 'Low',    color: 'bg-slate-400',  text: 'text-slate-400',  icon: Flag      },
} as const

export type PriorityKey = keyof typeof PRIORITY_META