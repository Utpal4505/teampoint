import type { LeaveRequestStatus } from '../generated/prisma/enums.ts'

export type CreateLeaveRequestInput = {
  workspaceId: number
  userId: number
  reason?: string
}

export type CreateLeaveRequestDTO = {
  id: number
  workspaceId: number
  userId: number
  status: LeaveRequestStatus
  reason: string | null
  createdAt: Date
}

export type LeaveRequestListItemDTO = {
  id: number
  userId: number
  status: LeaveRequestStatus
  reason: string | null
  createdAt: Date
}

export type ListLeaveRequestsDTO = {
  data: LeaveRequestListItemDTO[]
}

export type GetLeaveRequestDTO = {
  id: number
  workspaceId: number
  userId: number
  status: LeaveRequestStatus
  reason: string | null
  reviewedBy?: number | null
  reviewedAt?: Date | null
  createdAt: Date
}

export type ReviewLeaveRequestInput = {
  requestId: number
  status: 'APPROVED' | 'REJECTED'
  reviewedBy: number
}

export type ReviewLeaveRequestDTO = {
  id: number
  status: 'APPROVED' | 'REJECTED'
  reviewedBy: number
  reviewedAt: Date
}

export type UpdateLeaveRequestInput = {
  requestId: number
  reason?: string | null
  status?: LeaveRequestStatus
}

export type UpdateLeaveRequestDTO = {
  id: number
  reason: string | null
  status: LeaveRequestStatus
  updatedAt: Date
}
