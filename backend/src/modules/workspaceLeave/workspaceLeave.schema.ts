import z from 'zod'
import { idParam } from '../documentLinks/documentLinks.schema.ts'

export const LeaveRequestStatusSchema = z.enum([
  'PENDING',
  'ACCEPTED',
  'DECLINED',
  'CANCELLED',
] as const)

export const ReviewStatusSchema = z.enum(['APPROVED', 'REJECTED'] as const)

export const CreateLeaveRequestSchema = z.object({
  workspaceId: idParam,
  userId: idParam,
  reason: z.string().trim().max(2000).optional(),
})

export const CreateLeaveRequestResponseSchema = z.object({
  id: idParam,
  workspaceId: idParam,
  userId: idParam,
  status: LeaveRequestStatusSchema,
  reason: z.string().nullable(),
  createdAt: z.date(),
})

export const LeaveRequestListItemSchema = z.object({
  id: idParam,
  userId: idParam,
  status: LeaveRequestStatusSchema,
  reason: z.string().nullable(),
  createdAt: z.date(),
})

export const ListLeaveRequestsResponseSchema = z.object({
  data: z.array(LeaveRequestListItemSchema),
  nextCursor: idParam.optional(),
  hasMore: z.boolean(),
})

export const GetLeaveRequestResponseSchema = z.object({
  id: idParam,
  workspaceId: idParam,
  userId: idParam,
  status: LeaveRequestStatusSchema,
  reason: z.string().nullable(),
  reviewedBy: idParam.optional().nullable(),
  reviewedAt: z.date().optional().nullable(),
  createdAt: z.date(),
})

export const ReviewLeaveRequestSchema = z.object({
  requestId: idParam,
  status: ReviewStatusSchema,
  reviewedBy: idParam,
})

export const ReviewLeaveRequestResponseSchema = z.object({
  id: idParam,
  status: ReviewStatusSchema,
  reviewedBy: idParam,
  reviewedAt: z.date(),
})

export const UpdateLeaveRequestSchema = z.object({
  requestId: idParam,
  reason: z.string().trim().max(2000).nullable().optional(),
  status: LeaveRequestStatusSchema.optional(),
})

export const UpdateLeaveRequestResponseSchema = z.object({
  id: idParam,
  reason: z.string().nullable(),
  status: LeaveRequestStatusSchema,
  updatedAt: z.date(),
})
