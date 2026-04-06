import { prisma } from '../../config/db.config.ts'
import type {
  CreateFeedback,
  UpdateFeedbackStatus,
  FeedbackType,
  FeedbackStatus,
} from '../../types/feedback.type.ts'

const feedbackInclude = {
  submitter: {
    select: {
      id: true,
      fullName: true,
      email: true,
    },
  },
  project: {
    select: {
      id: true,
      name: true,
    },
  },
  reviewer: {
    select: {
      id: true,
      fullName: true,
      email: true,
    },
  },
} as const

export const createFeedbackService = async (
  data: CreateFeedback,
  userId: number | undefined,
) => {
  return await prisma.feedback.create({
    data: {
      submittedBy: userId ?? null,
      projectId: data.projectId ?? null,
      type: data.type,
      rating: data.rating ?? null,
      message: data.message ?? null,
      problem: data.problem ?? null,
      solution: data.solution ?? null,
      page: data.page ?? null,
      confusion: data.confusion ?? null,
      slowArea: data.slowArea ?? null,
      status: 'NEW',
    },
    include: feedbackInclude,
  })
}

export const getFeedbackByIdService = async (id: number) => {
  return await prisma.feedback.findUnique({
    where: { id },
    include: feedbackInclude,
  })
}

export const listFeedbackService = async (
  projectId?: number,
  type?: FeedbackType,
  status?: FeedbackStatus,
) => {
  return await prisma.feedback.findMany({
    where: {
      deletedAt: null,
      ...(projectId && { projectId }),
      ...(type && { type }),
      ...(status && { status }),
    },
    include: feedbackInclude,
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export const updateFeedbackStatusService = async (
  data: UpdateFeedbackStatus,
  reviewerId: number,
) => {
  return await prisma.feedback.update({
    where: { id: data.id },
    data: {
      status: data.status,
      ...(data.internalNotes && { internalNotes: data.internalNotes }),
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
    },
    include: feedbackInclude,
  })
}

export const deleteFeedbackService = async (id: number) => {
  return await prisma.feedback.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  })
}
