import {
  AlertCircle,
  ArrowUp,
  Minus,
  ArrowDown,
  Circle,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import type {
  Priority,
  Status,
  Task,
  PriorityConfigEntry,
  StatusConfigEntry,
  ColumnStyle,
  PriorityOption,
} from './types'

export const PRIORITY_CONFIG: Record<Priority, PriorityConfigEntry> = {
  URGENT: {
    label: 'Urgent',
    color: 'text-red-400',
    bg: 'bg-red-400/10 border-red-400/20',
    dot: 'bg-red-400',
    Icon: AlertCircle,
  },
  HIGH: {
    label: 'High',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10 border-orange-400/20',
    dot: 'bg-orange-400',
    Icon: ArrowUp,
  },
  MEDIUM: {
    label: 'Medium',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10 border-blue-400/20',
    dot: 'bg-blue-400',
    Icon: Minus,
  },
  LOW: {
    label: 'Low',
    color: 'text-slate-400',
    bg: 'bg-slate-400/10 border-slate-400/20',
    dot: 'bg-slate-400',
    Icon: ArrowDown,
  },
}

export const STATUS_CONFIG: Record<Status, StatusConfigEntry> = {
  TODO: { label: 'Todo', color: 'text-slate-400', bg: 'bg-slate-400/10', Icon: Circle },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    Icon: Clock,
  },
  DONE: {
    label: 'Done',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    Icon: CheckCircle2,
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    Icon: XCircle,
  },
}

export const COLUMN_STYLES: Record<string, ColumnStyle> = {
  TODO: {
    label: 'Todo',
    accent: 'text-slate-400',
    border: 'border-slate-400/30',
    glow: 'rgba(148,163,184,0.06)',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    accent: 'text-amber-400',
    border: 'border-amber-400/30',
    glow: 'rgba(251,191,36,0.06)',
  },
  DONE: {
    label: 'Done',
    accent: 'text-emerald-400',
    border: 'border-emerald-400/30',
    glow: 'rgba(52,211,153,0.06)',
  },
}

export const PRIORITY_OPTIONS: PriorityOption[] = [
  {
    value: 'URGENT',
    label: 'Urgent',
    Icon: AlertCircle,
    color: 'text-red-400',
    activeBg: 'bg-red-400/10',
  },
  {
    value: 'HIGH',
    label: 'High',
    Icon: ArrowUp,
    color: 'text-orange-400',
    activeBg: 'bg-orange-400/10',
  },
  {
    value: 'MEDIUM',
    label: 'Medium',
    Icon: Minus,
    color: 'text-blue-400',
    activeBg: 'bg-blue-400/10',
  },
  {
    value: 'LOW',
    label: 'Low',
    Icon: ArrowDown,
    color: 'text-slate-400',
    activeBg: 'bg-slate-400/10',
  },
]

export const COLUMNS: Status[] = ['TODO', 'IN_PROGRESS', 'DONE']

export const PROJECTS: string[] = [
  'TeamPoint Frontend',
  'Marketing Site',
  'Mobile App',
  'AuthService',
]

export const ASSIGNEES: string[] = ['Utpal', 'Aman', 'Priya', 'Rahul']

export const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    title: 'Implement workspace selector',
    priority: 'HIGH',
    status: 'TODO',
    dueDate: '2026-06-20',
    project: 'TeamPoint Frontend',
    assignee: 'Utpal',
    avatarUrl:
      'https://ui-avatars.com/api/?name=Utpal&background=6366f1&color=fff&size=40',
    type: 'PROJECT',
    description: 'Implement workspace switching logic for dashboard navigation.',
  },
  {
    id: 2,
    title: 'Fix authentication bug',
    priority: 'URGENT',
    status: 'IN_PROGRESS',
    dueDate: '2026-06-19',
    project: 'AuthService',
    assignee: 'Aman',
    avatarUrl:
      'https://ui-avatars.com/api/?name=Aman&background=f59e0b&color=fff&size=40',
    type: 'PROJECT',
    description: 'Users are being logged out unexpectedly on token refresh.',
  },
  {
    id: 3,
    title: 'Setup analytics tracking',
    priority: 'MEDIUM',
    status: 'DONE',
    dueDate: null,
    project: 'Marketing Site',
    assignee: 'Utpal',
    avatarUrl:
      'https://ui-avatars.com/api/?name=Utpal&background=6366f1&color=fff&size=40',
    type: 'PROJECT',
    description: 'Integrate Mixpanel for user event tracking.',
  },
  {
    id: 4,
    title: 'Design onboarding flow',
    priority: 'HIGH',
    status: 'TODO',
    dueDate: '2026-06-25',
    project: 'Mobile App',
    assignee: 'Priya',
    avatarUrl:
      'https://ui-avatars.com/api/?name=Priya&background=ec4899&color=fff&size=40',
    type: 'PROJECT',
    description: 'Create wireframes for the 3-step onboarding flow.',
  },
  {
    id: 5,
    title: 'Update API documentation',
    priority: 'LOW',
    status: 'TODO',
    dueDate: null,
    project: 'TeamPoint Frontend',
    assignee: 'Rahul',
    avatarUrl:
      'https://ui-avatars.com/api/?name=Rahul&background=10b981&color=fff&size=40',
    type: 'PROJECT',
    description: 'Sync Swagger docs with latest endpoint changes.',
  },
  {
    id: 6,
    title: 'Review pull requests',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    dueDate: '2026-06-18',
    project: null,
    assignee: 'Utpal',
    avatarUrl:
      'https://ui-avatars.com/api/?name=Utpal&background=6366f1&color=fff&size=40',
    type: 'PERSONAL',
    description: 'Review 3 open PRs before end of sprint.',
  },
  {
    id: 7,
    title: 'Write unit tests for auth',
    priority: 'HIGH',
    status: 'DONE',
    dueDate: '2026-06-15',
    project: 'AuthService',
    assignee: 'Aman',
    avatarUrl:
      'https://ui-avatars.com/api/?name=Aman&background=f59e0b&color=fff&size=40',
    type: 'PROJECT',
    description: 'Achieve 80% coverage on auth module.',
  },
  {
    id: 8,
    title: 'Refactor sidebar component',
    priority: 'LOW',
    status: 'TODO',
    dueDate: null,
    project: 'TeamPoint Frontend',
    assignee: 'Priya',
    avatarUrl:
      'https://ui-avatars.com/api/?name=Priya&background=ec4899&color=fff&size=40',
    type: 'PROJECT',
    description: 'Extract sidebar logic into reusable hooks.',
  },
]
