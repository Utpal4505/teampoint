import { prisma } from '../../config/db.config.ts'
import { ApiError } from '../../utils/apiError.ts'
import { assertProjectMember } from '../../utils/assertProjectMember.ts'
import { ensureExists } from '../../utils/ensureExists.ts'
import {
  createGoogleMeetEvent,
  updateGoogleMeetEvent,
  cancelGoogleMeetEvent,
} from './google-calendar.helper.ts'
import type {
  CreateMeetingResponse,
  ListMeetingsResponse,
  GetMeetingResponse,
  UpdateMeetingInput,
  UpdateMeetingResponse,
  GetParticipantsQuery,
  GetParticipantsResponse,
  ManageParticipantsInput,
  ManageParticipantsResponse,
  CompleteMeetingInput,
  CompleteMeetingResponse,
  CancelMeetingInput,
  CancelMeetingResponse,
  CreateMeetingServiceInput,
  ListMeetingsServiceQuery,
} from '../../types/meeting.type.ts'

export const createMeetingService = async (
  input: CreateMeetingServiceInput,
  userId: number,
): Promise<CreateMeetingResponse> => {
  const { projectId, title, description, startTime, endTime, participants } = input

  return prisma.$transaction(async tx => {
    await assertProjectMember(projectId, userId, tx)

    const participantIds = participants.map(p => p.userId)

    const validMembers = await tx.project_Members.findMany({
      where: {
        projectId,
        userId: { in: participantIds },
      },
      select: { userId: true },
    })

    const validMemberIds = new Set(validMembers.map(m => m.userId))
    const invalidIds = participantIds.filter(id => !validMemberIds.has(id))

    if (invalidIds.length > 0) {
      throw new ApiError(
        400,
        `Users [${invalidIds.join(', ')}] are not members of this project`,
      )
    }

    const hasHost = participants.some(p => p.role === 'HOST')
    if (!hasHost) {
      throw new ApiError(400, 'At least one participant must have HOST role')
    }

    const users = await tx.user.findMany({
      where: { id: { in: participantIds } },
      select: { id: true, email: true },
    })

    const attendeeEmails = users.map(u => u.email)

    const { meetingLink, googleEventId } = await createGoogleMeetEvent(userId, {
      title,
      description,
      startTime,
      endTime,
      attendeeEmails,
    })

    const meeting = await tx.meeting.create({
      data: {
        projectId: Number(projectId),
        createdBy: userId,
        title,
        description: description ?? null,
        startTime,
        endTime,
        meetingLink,
        googleEventId,
        status: 'SCHEDULED',
        participants: {
          create: participants.map(p => ({
            userId: p.userId,
            role: p.role,
          })),
        },
      },
    })

    return {
      id: meeting.id,
      status: 'SCHEDULED',
      meetingLink: meeting.meetingLink,
      createdAt: meeting.createdAt,
    }
  })
}

export const listMeetingsService = async (
  query: ListMeetingsServiceQuery,
  userId: number,
): Promise<ListMeetingsResponse> => {
  const { projectId, status, from, to } = query

  await assertProjectMember(projectId, userId)

  const meetings = await prisma.meeting.findMany({
    where: {
      projectId,
      ...(status && { status }),
      ...(from && { startTime: { gte: from } }),
      ...(to && { startTime: { lte: to } }),
    },
    select: {
      id: true,
      title: true,
      status: true,
      startTime: true,
      endTime: true,
      meetingLink: true,
      _count: { select: { participants: true } },
    },
    orderBy: { startTime: 'asc' },
  })

  return {
    data: meetings.map(m => ({
      id: m.id,
      title: m.title,
      status: m.status,
      startTime: m.startTime,
      endTime: m.endTime,
      meetingLink: m.meetingLink,
      participantCount: m._count.participants,
    })),
  }
}

export const getMeetingService = async (
  meetingId: number,
  userId: number,
): Promise<GetMeetingResponse> => {
  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    select: {
      id: true,
      projectId: true,
      title: true,
      description: true,
      status: true,
      startTime: true,
      endTime: true,
      meetingLink: true,
      createdAt: true,
      _count: { select: { participants: true } },
    },
  })

  ensureExists(meeting, 'Meeting')

  await assertProjectMember(meeting.projectId, userId)

  return {
    id: meeting.id,
    projectId: meeting.projectId,
    title: meeting.title,
    description: meeting.description,
    status: meeting.status,
    startTime: meeting.startTime,
    endTime: meeting.endTime,
    meetingLink: meeting.meetingLink,
    participantCount: meeting._count.participants,
    createdAt: meeting.createdAt,
  }
}

export const updateMeetingService = async (
  input: UpdateMeetingInput,
  userId: number,
): Promise<UpdateMeetingResponse> => {
  const { meetingId, title, description, startTime, endTime } = input

  return prisma.$transaction(async tx => {
    const meeting = await tx.meeting.findUnique({
      where: { id: meetingId },
    })

    ensureExists(meeting, 'Meeting')

    if (meeting.status !== 'SCHEDULED') {
      throw new ApiError(400, 'Only scheduled meetings can be updated')
    }

    await assertCanManageMeeting(meeting.projectId, meeting.createdBy, userId, tx)

    const updated = await tx.meeting.update({
      where: { id: meetingId },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(startTime && { startTime }),
        ...(endTime && { endTime }),
      },
    })

    if (meeting.googleEventId) {
      await updateGoogleMeetEvent(meeting.createdBy, {
        googleEventId: meeting.googleEventId,
        title,
        description: description ?? undefined,
        startTime,
        endTime,
      })
    }

    return {
      id: updated.id,
      title: updated.title,
      startTime: updated.startTime,
      endTime: updated.endTime,
      updatedAt: updated.updatedAt,
    }
  })
}

export const getParticipantsService = async (
  meetingId: number,
  query: GetParticipantsQuery,
  userId: number,
): Promise<GetParticipantsResponse> => {
  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    select: { projectId: true },
  })

  ensureExists(meeting, 'Meeting')

  await assertProjectMember(meeting.projectId, userId)

  const { page, limit } = query
  const skip = (page - 1) * limit

  const [total, participants] = await Promise.all([
    prisma.meetingParticipant.count({ where: { meetingId } }),
    prisma.meetingParticipant.findMany({
      where: { meetingId },
      skip,
      take: limit,
      select: {
        role: true,
        user: { select: { id: true, fullName: true } },
      },
    }),
  ])

  return {
    total,
    page,
    limit,
    data: participants.map(p => ({
      userId: p.user.id,
      name: p.user.fullName,
      role: p.role,
    })),
  }
}

export const manageParticipantsService = async (
  input: ManageParticipantsInput,
  userId: number,
): Promise<ManageParticipantsResponse> => {
  const { meetingId, add = [], remove = [] } = input

  return prisma.$transaction(async tx => {
    const meeting = await tx.meeting.findUnique({
      where: { id: meetingId },
    })

    ensureExists(meeting, 'Meeting')

    if (meeting.status !== 'SCHEDULED') {
      throw new ApiError(400, 'Cannot manage participants of a non-scheduled meeting')
    }

    await assertCanManageMeeting(meeting.projectId, meeting.createdBy, userId, tx)

    let added = 0
    if (add.length > 0) {
      const result = await tx.meetingParticipant.createMany({
        data: add.map(p => ({
          meetingId,
          userId: p.userId,
          role: p.role,
        })),
        skipDuplicates: true,
      })
      added = result.count
    }

    let removed = 0
    if (remove.length > 0) {
      const result = await tx.meetingParticipant.deleteMany({
        where: {
          meetingId,
          userId: { in: remove },
        },
      })
      removed = result.count
    }

    return { meetingId, added, removed }
  })
}

export const completeMeetingService = async (
  input: CompleteMeetingInput,
  userId: number,
): Promise<CompleteMeetingResponse> => {
  const { meetingId, keyDecisions, actionItems = [] } = input

  return prisma.$transaction(async tx => {
    const meeting = await tx.meeting.findUnique({
      where: { id: meetingId },
    })

    ensureExists(meeting, 'Meeting')

    if (meeting.status !== 'SCHEDULED') {
      throw new ApiError(400, 'Only scheduled meetings can be completed')
    }

    await assertCanManageMeeting(meeting.projectId, meeting.createdBy, userId, tx)

    await tx.meeting.update({
      where: { id: meetingId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        keyDecisions: keyDecisions ?? null,
      },
    })

    const createdTaskIds: number[] = []

    for (const item of actionItems) {
      const task = await tx.tasks.create({
        data: {
          projectId: meeting.projectId,
          createdBy: userId,
          assignedTo: item.assignedTo,
          title: item.title,
          taskType: 'PROJECT',
          status: 'TODO',
          priority: 'MEDIUM',
          dueDate: item.dueDate ?? null,
        },
      })

      await tx.meetingActionItem.create({
        data: {
          meetingId,
          title: item.title,
          assignedToId: item.assignedTo,
          dueDate: item.dueDate ?? null,
          convertedTaskId: task.id,
        },
      })

      createdTaskIds.push(task.id)
    }

    return {
      id: meetingId,
      status: 'COMPLETED',
      completedAt: new Date(),
      createdTasks: createdTaskIds,
    }
  })
}

export const cancelMeetingService = async (
  input: CancelMeetingInput,
  userId: number,
): Promise<CancelMeetingResponse> => {
  const { meetingId } = input

  return prisma.$transaction(async tx => {
    const meeting = await tx.meeting.findUnique({
      where: { id: meetingId },
    })

    ensureExists(meeting, 'Meeting')

    if (meeting.status !== 'SCHEDULED') {
      throw new ApiError(400, 'Only scheduled meetings can be cancelled')
    }

    await assertCanManageMeeting(meeting.projectId, meeting.createdBy, userId, tx)

    const cancelled = await tx.meeting.update({
      where: { id: meetingId },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    })

    if (meeting.googleEventId) {
      await cancelGoogleMeetEvent(meeting.createdBy, meeting.googleEventId)
    }

    return {
      id: cancelled.id,
      status: 'CANCELLED',
      cancelledAt: cancelled.cancelledAt!,
    }
  })
}

const assertCanManageMeeting = async (
  projectId: number,
  createdBy: number,
  userId: number,
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
): Promise<void> => {
  if (createdBy === userId) return

  const member = await tx.project_Members.findUnique({
    where: { projectId_userId: { projectId, userId } },
    select: { role: true },
  })

  if (!member || !['OWNER', 'ADMIN'].includes(member.role)) {
    throw new ApiError(
      403,
      'Only the meeting creator or project admin can perform this action',
    )
  }
}
