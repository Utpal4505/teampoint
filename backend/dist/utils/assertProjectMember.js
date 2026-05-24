import { prisma } from '../config/db.config.js';
import { ApiError } from './apiError.js';
export const assertProjectMember = async (projectId, userId, tx) => {
    const db = tx ?? prisma;
    const member = await db.project_Members.findFirst({
        where: {
            projectId,
            userId,
            status: 'ACTIVE',
        },
        select: {
            id: true,
            role: true,
            status: true,
            permissions: true,
        },
    });
    if (!member) {
        const workspaceMember = await db.workspace_Members.findFirst({
            where: {
                workspace: {
                    projects: {
                        some: { id: projectId }
                    }
                },
                userId,
                role: { in: ['OWNER', 'ADMIN'] },
                status: 'ACTIVE'
            },
            select: {
                id: true,
                role: true,
                status: true,
            }
        });
        if (!workspaceMember) {
            throw new ApiError(403, 'Not a project member');
        }
        return {
            id: workspaceMember.id,
            role: workspaceMember.role,
            status: 'ACTIVE',
            permissions: null
        };
    }
    if (member.status !== 'ACTIVE') {
        throw new ApiError(403, 'Inactive project member');
    }
    return member;
};
//# sourceMappingURL=assertProjectMember.js.map