export type ProjectRole = 'OWNER' | 'ADMIN' | 'MEMBER'

export interface MemberUser {
  id: number
  fullName: string
  email: string
  avatarUrl: string | null
}

export interface MemberWithStats {
  id: number
  user: MemberUser
  role: ProjectRole
  joinedAt: string
  taskTotal: number
  taskDone: number
}
