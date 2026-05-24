import { prisma } from '../../config/db.config.js';
import { ApiError } from '../../utils/apiError.js';
import { ensureExists } from '../../utils/ensureExists.js';
import { assertWorkspaceMember } from '../../utils/assertWorkspaceMember.js';
export const createLeaveRequestService = async (input, userId) => {
    const { workspaceId, reason } = input;
    return prisma.$transaction(async (tx) => {
        await assertWorkspaceMember(workspaceId, userId, tx);
        const leaveRequest = await tx.workspaceLeaveRequest.create({
            data: {
                workspaceId,
                userId,
                reason: reason?.trim() ?? null,
                status: 'PENDING',
            },
        });
        return leaveRequest;
    });
};
export const listLeaveRequestsService = async (workspaceId, userId) => {
    await assertWorkspaceMember(workspaceId, userId);
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
    });
    return {
        data: leaveRequests,
    };
};
export const getLeaveRequestService = async (requestId, userId) => {
    const leaveRequest = await prisma.workspaceLeaveRequest.findUnique({
        where: { id: requestId },
    });
    ensureExists(leaveRequest, 'LeaveRequest');
    await assertWorkspaceMember(leaveRequest.workspaceId, userId);
    return leaveRequest;
};
export const reviewLeaveRequestService = async (input, reviewerId) => {
    const { requestId, status } = input;
    return prisma.$transaction(async (tx) => {
        const leaveRequest = await tx.workspaceLeaveRequest.findUnique({
            where: { id: requestId },
        });
        ensureExists(leaveRequest, 'LeaveRequest');
        await assertWorkspaceMember(leaveRequest.workspaceId, reviewerId);
        if (leaveRequest.status !== 'PENDING') {
            throw new ApiError(400, 'LeaveRequest already reviewed');
        }
        const updated = await tx.workspaceLeaveRequest.update({
            where: { id: requestId },
            data: {
                status: status === 'APPROVED' ? 'ACCEPTED' : 'DECLINED',
                reviewedBy: reviewerId,
                reviewedAt: new Date(),
            },
        });
        return {
            id: updated.id,
            status: status,
            reviewedBy: reviewerId,
            reviewedAt: updated.reviewedAt,
        };
    });
};
export const updateLeaveRequestService = async (input, user) => {
    const { requestId, reason, status } = input;
    return prisma.$transaction(async (tx) => {
        const leaveRequest = await tx.workspaceLeaveRequest.findUnique({
            where: { id: requestId },
        });
        ensureExists(leaveRequest, 'LeaveRequest');
        await assertWorkspaceMember(leaveRequest.workspaceId, user.id, tx);
        if (user.role === 'MEMBER') {
            if (leaveRequest.userId !== user.id) {
                throw new ApiError(403, 'Cannot update another member’s leave request');
            }
            if (leaveRequest.status !== 'PENDING') {
                throw new ApiError(400, 'Cannot update a reviewed leave request');
            }
        }
        const updateData = {};
        if (reason !== undefined)
            updateData.reason = reason?.trim() ?? null;
        if (status !== undefined)
            updateData.status = status;
        const updated = await tx.workspaceLeaveRequest.update({
            where: { id: requestId },
            data: updateData,
        });
        return {
            id: updated.id,
            reason: updated.reason,
            status: updated.status,
            updatedAt: updated.updatedAt,
        };
    });
};
//# sourceMappingURL=workspaceLeave.service.js.map