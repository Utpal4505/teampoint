import type { UserStatus } from '../generated/prisma/enums.ts'

export type GetUserDTO = {
  id: number
  fullName: string
  avatar_url: string | null
  status: UserStatus
}

export type UserDeletionDTO = {
  id: number
  status: UserStatus
}
