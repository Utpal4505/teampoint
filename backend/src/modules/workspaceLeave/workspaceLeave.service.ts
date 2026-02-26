import { prisma } from '../../config/db.config.ts'
import type { Prisma, WorkspaceRole } from '../../generated/prisma/client.ts'
import type {
  CreateLeaveRequestDTO,
  CreateLeaveRequestInput,
  GetLeaveRequestDTO,
  ListLeaveRequestsDTO,
  ReviewLeaveRequestDTO,
  ReviewLeaveRequestInput,
  UpdateLeaveRequestDTO,
  UpdateLeaveRequestInput,
  LeaveRequestListItemDTO,
} from '../../types/workspaceLeave.type.ts'
import { ApiError } from '../../utils/apiError.ts'
import { ensureExists } from '../../utils/ensureExists.ts'
import { assertWorkspaceMember } from '../../utils/assertWorkspaceMember.ts'

export const createLeaveRequestService = async (
  input: CreateLeaveRequestInput,
  userId: number,
): Promise<CreateLeaveRequestDTO> => {
  const { workspaceId, reason } = input

  return prisma.$transaction(async tx => {
    await assertWorkspaceMember(workspaceId, userId, tx)

    const leaveRequest = await tx.workspaceLeaveRequest.create({
      data: {
        workspaceId,
        userId,
        reason: reason?.trim() ?? null,
        status: 'PENDING',
      },
    })

    return leaveRequest
  })
}

export const listLeaveRequestsService = async (
  workspaceId: number,
  userId: number,
): Promise<ListLeaveRequestsDTO> => {
  await assertWorkspaceMember(workspaceId, userId)

  const leaveRequests = await prisma.workspaceLeaveRequest.findMany({
    where: {
      id: workspaceId,
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      userId: true,
      status: true,
      reason: true,
      createdAt: true,
    },
  })

  return {
    data: leaveRequests as LeaveRequestListItemDTO[],
  }
}

export const getLeaveRequestService = async (
  requestId: number,
  userId: number,
): Promise<GetLeaveRequestDTO> => {
  const leaveRequest = await prisma.workspaceLeaveRequest.findUnique({
    where: { id: requestId },
  })

  ensureExists(leaveRequest, 'LeaveRequest')

  await assertWorkspaceMember(leaveRequest.workspaceId, userId)

  return leaveRequest
}

export const reviewLeaveRequestService = async (
  input: ReviewLeaveRequestInput,
  reviewerId: number,
): Promise<ReviewLeaveRequestDTO> => {
  const { requestId, status } = input

  return prisma.$transaction(async tx => {
    const leaveRequest = await tx.workspaceLeaveRequest.findUnique({
      where: { id: requestId },
    })

    ensureExists(leaveRequest, 'LeaveRequest')

    await assertWorkspaceMember(leaveRequest.workspaceId, reviewerId)

    if (leaveRequest.status !== 'PENDING') {
      throw new ApiError(400, 'LeaveRequest already reviewed')
    }

    const updated = await tx.workspaceLeaveRequest.update({
      where: { id: requestId },
      data: {
        status: status === 'APPROVED' ? 'ACCEPTED' : 'DECLINED',
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
      },
    })

    return {
      id: updated.id,
      status: status,
      reviewedBy: reviewerId,
      reviewedAt: updated.reviewedAt!,
    }
  })
}

export const updateLeaveRequestService = async (
  input: UpdateLeaveRequestInput,
  user: { id: number; role: WorkspaceRole},
): Promise<UpdateLeaveRequestDTO> => {
  const { requestId, reason, status } = input

  return prisma.$transaction(async tx => {
    const leaveRequest = await tx.workspaceLeaveRequest.findUnique({
      where: { id: requestId },
    })

    ensureExists(leaveRequest, 'LeaveRequest')

    await assertWorkspaceMember(leaveRequest.workspaceId, user.id, tx);

    if (user.role === 'MEMBER') {
      if (leaveRequest.userId !== user.id) {
        throw new ApiError(403, 'Cannot update another member’s leave request')
      }
      if (leaveRequest.status !== 'PENDING') {
        throw new ApiError(400, 'Cannot update a reviewed leave request')
      }
    }

    const updateData: Prisma.WorkspaceLeaveRequestUpdateInput = {}
    if (reason !== undefined) updateData.reason = reason?.trim() ?? null
    if (status !== undefined) updateData.status = status

    const updated = await tx.workspaceLeaveRequest.update({
      where: { id: requestId },
      data: updateData,
    })

    return {
      id: updated.id,
      reason: updated.reason,
      status: updated.status,
      updatedAt: updated.updatedAt,
    }
  })
}
