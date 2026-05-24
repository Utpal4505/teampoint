import { prisma } from '../config/db.config.js';
import { ApiError } from './apiError.js';
export const assertWorkspaceMember = async (workspaceId, userId, tx) => {
    const db = tx ?? prisma;
    const member = await db.workspace_Members.findFirst({
        where: {
            workspaceId,
            userId,
            status: 'ACTIVE',
        },
        select: {
            id: true,
            role: true,
            status: true,
        },
    });
    if (!member) {
        throw new ApiError(403, 'Not a workspace member');
    }
    if (member.status !== 'ACTIVE') {
        throw new ApiError(403, 'Inactive workspace member');
    }
    return member;
};
//# sourceMappingURL=assertWorkspaceMember.js.map