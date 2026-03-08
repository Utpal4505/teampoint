import type { ProjectStatus, ProjectRole } from './schemas'

export const MOCK_WORKSPACE_MEMBERS = [
  { userId: 'u1', fullName: 'Rahul Sharma',  email: 'rahul@acme.com',   avatarColor: 'bg-primary/15 text-primary'                                 },
  { userId: 'u2', fullName: 'Aman Verma',    email: 'aman@acme.com',    avatarColor: 'bg-[oklch(0.52_0.15_145/0.15)] text-[oklch(0.58_0.14_145)]' },
  { userId: 'u3', fullName: 'Neha Gupta',    email: 'neha@acme.com',    avatarColor: 'bg-[oklch(0.7_0.15_55/0.15)] text-[oklch(0.7_0.13_55)]'     },
  { userId: 'u4', fullName: 'Priya Mehta',   email: 'priya@acme.com',   avatarColor: 'bg-destructive/15 text-destructive'                          },
  { userId: 'u5', fullName: 'Vikram Singh',  email: 'vikram@acme.com',  avatarColor: 'bg-[oklch(0.62_0.1_300/0.15)] text-[oklch(0.65_0.1_300)]'   },
  { userId: 'u6', fullName: 'Divya Kapoor',  email: 'divya@acme.com',   avatarColor: 'bg-[oklch(0.6_0.14_180/0.15)] text-[oklch(0.6_0.14_180)]'   },
  { userId: 'u7', fullName: 'Arjun Nair',    email: 'arjun@acme.com',   avatarColor: 'bg-[oklch(0.65_0.12_310/0.15)] text-[oklch(0.65_0.12_310)]' },
  { userId: 'u8', fullName: 'Simran Kaur',   email: 'simran@acme.com',  avatarColor: 'bg-[oklch(0.7_0.15_55/0.15)] text-[oklch(0.68_0.13_55)]'    },
] as const

export type WorkspaceMember = (typeof MOCK_WORKSPACE_MEMBERS)[number]

export const ROLE_OPTIONS: {
  value: Exclude<ProjectRole, 'OWNER'>
  label: string
  desc:  string
}[] = [
  { value: 'ADMIN',  label: 'Admin',  desc: 'Manage members & settings' },
  { value: 'MEMBER', label: 'Member', desc: 'Normal project access'     },
]

export const STATUS_OPTIONS: {
  value: ProjectStatus
  label: string
  dot:   string
  desc:  string
}[] = [
  { value: 'ACTIVE', label: 'Active',  dot: 'bg-[oklch(0.52_0.15_145)]', desc: 'Ready to work on' },
  { value: 'ONHOLD', label: 'On Hold', dot: 'bg-[oklch(0.7_0.15_55)]',   desc: 'Paused for now'   },
]

export function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}