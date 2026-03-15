import type { MemberWithStats } from './memberTab.types'

export const FAKE_MEMBERS: MemberWithStats[] = [
  {
    id: 1,
    user: { id: 1, fullName: 'Utpal Kumar',  email: 'utpal@teampoint.app',  avatarUrl: null },
    role: 'OWNER',
    joinedAt: '2025-01-05T00:00:00.000Z',
    taskTotal: 10, taskDone: 8,
  },
  {
    id: 2,
    user: { id: 2, fullName: 'Rahul Sharma', email: 'rahul@teampoint.app',  avatarUrl: null },
    role: 'ADMIN',
    joinedAt: '2025-01-10T00:00:00.000Z',
    taskTotal: 12, taskDone: 6,
  },
  {
    id: 3,
    user: { id: 3, fullName: 'Aman Verma',   email: 'aman@teampoint.app',   avatarUrl: null },
    role: 'MEMBER',
    joinedAt: '2025-02-01T00:00:00.000Z',
    taskTotal: 8,  taskDone: 4,
  },
  {
    id: 4,
    user: { id: 4, fullName: 'Neha Singh',   email: 'neha@teampoint.app',   avatarUrl: null },
    role: 'MEMBER',
    joinedAt: '2025-02-14T00:00:00.000Z',
    taskTotal: 6,  taskDone: 6,
  },
  {
    id: 5,
    user: { id: 5, fullName: 'Dev Patel',    email: 'dev@teampoint.app',    avatarUrl: null },
    role: 'MEMBER',
    joinedAt: '2025-03-01T00:00:00.000Z',
    taskTotal: 4,  taskDone: 1,
  },
]