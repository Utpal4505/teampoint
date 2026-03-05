import type { UserStatus } from '../generated/prisma/enums.ts'

export type GetUserDTO = {
  id: number
  fullName: string
  avatarUrl: string | null
  status: UserStatus
  is_new: boolean
  created_at: Date
}

export type UserDeletionDTO = {
  id: number
  status: UserStatus
}

export type UpdateUserInput = {
  userId: number
  fullName: string
}

export type UpdateUserDTO = {
  id: number
  fullName: string
  updated_at: Date
}
