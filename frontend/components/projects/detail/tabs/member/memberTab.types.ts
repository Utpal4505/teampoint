import type { ProjectMemberDTO } from '@/features/projects/detail/types'

export type MemberWithStats = ProjectMemberDTO & {
  id: number
  taskTotal: number
  taskDone: number
}
