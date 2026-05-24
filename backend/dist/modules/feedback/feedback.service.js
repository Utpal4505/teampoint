import { prisma } from '../../config/db.config.js';
import { trackPosthogEvent } from '../../utils/posthog.js';
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
};
export const createFeedbackService = async (data, userId) => {
    const feedback = await prisma.feedback.create({
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
    });
    if (userId) {
        trackPosthogEvent(userId, 'feedback_submitted', {
            feedback_id: feedback.id,
            feedback_type: data.type,
            rating: data.rating ?? undefined,
            project_id: data.projectId ?? undefined,
        });
    }
    return feedback;
};
export const getFeedbackByIdService = async (id) => {
    return await prisma.feedback.findUnique({
        where: { id },
        include: feedbackInclude,
    });
};
export const listFeedbackService = async (projectId, type, status) => {
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
    });
};
export const updateFeedbackStatusService = async (data, reviewerId) => {
    return await prisma.feedback.update({
        where: { id: data.id },
        data: {
            status: data.status,
            ...(data.internalNotes && { internalNotes: data.internalNotes }),
            reviewedBy: reviewerId,
            reviewedAt: new Date(),
        },
        include: feedbackInclude,
    });
};
export const deleteFeedbackService = async (id) => {
    return await prisma.feedback.update({
        where: { id },
        data: {
            deletedAt: new Date(),
        },
    });
};
//# sourceMappingURL=feedback.service.js.map