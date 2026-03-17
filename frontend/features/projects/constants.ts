import { ProjectRole, ProjectStatus } from './schemas'
import { Project } from './types'

export const MOCK_WORKSPACE_MEMBERS = [
  {
    userId: 'u1',
    fullName: 'Rahul Sharma',
    email: 'rahul@acme.com',
    avatarColor: 'bg-primary/15 text-primary',
  },
  {
    userId: 'u2',
    fullName: 'Aman Verma',
    email: 'aman@acme.com',
    avatarColor: 'bg-[oklch(0.52_0.15_145/0.15)] text-[oklch(0.58_0.14_145)]',
  },
  {
    userId: 'u3',
    fullName: 'Neha Gupta',
    email: 'neha@acme.com',
    avatarColor: 'bg-[oklch(0.7_0.15_55/0.15)] text-[oklch(0.7_0.13_55)]',
  },
  {
    userId: 'u4',
    fullName: 'Priya Mehta',
    email: 'priya@acme.com',
    avatarColor: 'bg-destructive/15 text-destructive',
  },
  {
    userId: 'u5',
    fullName: 'Vikram Singh',
    email: 'vikram@acme.com',
    avatarColor: 'bg-[oklch(0.62_0.1_300/0.15)] text-[oklch(0.65_0.1_300)]',
  },
  {
    userId: 'u6',
    fullName: 'Divya Kapoor',
    email: 'divya@acme.com',
    avatarColor: 'bg-[oklch(0.6_0.14_180/0.15)] text-[oklch(0.6_0.14_180)]',
  },
  {
    userId: 'u7',
    fullName: 'Arjun Nair',
    email: 'arjun@acme.com',
    avatarColor: 'bg-[oklch(0.65_0.12_310/0.15)] text-[oklch(0.65_0.12_310)]',
  },
  {
    userId: 'u8',
    fullName: 'Simran Kaur',
    email: 'simran@acme.com',
    avatarColor: 'bg-[oklch(0.7_0.15_55/0.15)] text-[oklch(0.68_0.13_55)]',
  },
]

export type WorkspaceMember = (typeof MOCK_WORKSPACE_MEMBERS)[number]

export const ROLE_OPTIONS: {
  value: Exclude<ProjectRole, 'OWNER'>
  label: string
  desc: string
}[] = [
  { value: 'ADMIN', label: 'Admin', desc: 'Manage members & settings' },
  { value: 'MEMBER', label: 'Member', desc: 'Normal project access' },
]

export const STATUS_OPTIONS: {
  value: ProjectStatus
  label: string
  dot: string
  desc: string
}[] = [
  {
    value: 'ACTIVE',
    label: 'Active',
    dot: 'bg-[oklch(0.52_0.15_145)]',
    desc: 'Ready to work on',
  },
  {
    value: 'ONHOLD',
    label: 'On Hold',
    dot: 'bg-[oklch(0.7_0.15_55)]',
    desc: 'Paused for now',
  },
]

export function initials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export const STATUS_CONFIG: Record<
  ProjectStatus,
  {
    label: string
    color: string
    bg: string
    border: string
    dot: string
    barColor: string
  }
> = {
  ACTIVE: {
    label: 'Active',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    dot: 'bg-emerald-400',
    barColor: 'bg-emerald-500',
  },
  ONHOLD: {
    label: 'On Hold',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    dot: 'bg-amber-400',
    barColor: 'bg-amber-500',
  },
  COMPLETED: {
    label: 'Completed',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    dot: 'bg-blue-400',
    barColor: 'bg-blue-500',
  },
  DELETED: {
    label: 'Archived',
    color: 'text-muted-foreground',
    bg: 'bg-muted/40',
    border: 'border-border',
    dot: 'bg-muted-foreground',
    barColor: 'bg-muted-foreground',
  },
}

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Design Engineering',
    description: 'Website redesign & component library overhaul',
    status: 'ACTIVE',
    totalTasks: 40,
    doneTasks: 18,
    createdAt: '2024-01-23',
    members: [
      {
        id: 'm1',
        name: 'Utpal',
        avatarUrl:
          'https://ui-avatars.com/api/?name=Utpal&background=6366f1&color=fff&size=40',
      },
      {
        id: 'm2',
        name: 'Priya',
        avatarUrl:
          'https://ui-avatars.com/api/?name=Priya&background=ec4899&color=fff&size=40',
      },
      {
        id: 'm3',
        name: 'Aman',
        avatarUrl:
          'https://ui-avatars.com/api/?name=Aman&background=f59e0b&color=fff&size=40',
      },
      {
        id: 'm4',
        name: 'Rahul',
        avatarUrl:
          'https://ui-avatars.com/api/?name=Rahul&background=10b981&color=fff&size=40',
      },
    ],
  },
  {
    id: 'p2',
    name: 'Sales & Marketing',
    description: 'Q2 campaign planning and lead pipeline setup',
    status: 'ONHOLD',
    totalTasks: 24,
    doneTasks: 9,
    createdAt: '2024-02-11',
    members: [
      {
        id: 'm2',
        name: 'Priya',
        avatarUrl:
          'https://ui-avatars.com/api/?name=Priya&background=ec4899&color=fff&size=40',
      },
      {
        id: 'm4',
        name: 'Rahul',
        avatarUrl:
          'https://ui-avatars.com/api/?name=Rahul&background=10b981&color=fff&size=40',
      },
    ],
  },
  {
    id: 'p3',
    name: 'Mobile App v2',
    description: 'iOS & Android rewrite with new onboarding flow',
    status: 'ACTIVE',
    totalTasks: 61,
    doneTasks: 61,
    createdAt: '2023-11-05',
    members: [
      {
        id: 'm1',
        name: 'Utpal',
        avatarUrl:
          'https://ui-avatars.com/api/?name=Utpal&background=6366f1&color=fff&size=40',
      },
      {
        id: 'm3',
        name: 'Aman',
        avatarUrl:
          'https://ui-avatars.com/api/?name=Aman&background=f59e0b&color=fff&size=40',
      },
    ],
  },
  {
    id: 'p4',
    name: 'AuthService Rewrite',
    description: 'JWT refresh, RBAC, and SSO integration',
    status: 'COMPLETED',
    totalTasks: 33,
    doneTasks: 33,
    createdAt: '2023-09-14',
    members: [
      {
        id: 'm3',
        name: 'Aman',
        avatarUrl:
          'https://ui-avatars.com/api/?name=Aman&background=f59e0b&color=fff&size=40',
      },
      {
        id: 'm4',
        name: 'Rahul',
        avatarUrl:
          'https://ui-avatars.com/api/?name=Rahul&background=10b981&color=fff&size=40',
      },
    ],
  },
  {
    id: 'p5',
    name: 'Marketing Site',
    description: 'Landing page refresh and SEO improvements',
    status: 'ACTIVE',
    totalTasks: 19,
    doneTasks: 4,
    createdAt: '2024-03-01',
    members: [
      {
        id: 'm2',
        name: 'Priya',
        avatarUrl:
          'https://ui-avatars.com/api/?name=Priya&background=ec4899&color=fff&size=40',
      },
    ],
  },
  {
    id: 'p6',
    name: 'Data Pipeline',
    description: 'ETL jobs and analytics warehouse migration',
    status: 'DELETED',
    totalTasks: 15,
    doneTasks: 7,
    createdAt: '2023-06-20',
    members: [
      {
        id: 'm1',
        name: 'Utpal',
        avatarUrl:
          'https://ui-avatars.com/api/?name=Utpal&background=6366f1&color=fff&size=40',
      },
    ],
  },
]
