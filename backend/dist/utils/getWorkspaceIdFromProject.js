import { prisma } from '../config/db.config.js';
export const getWorkspaceIdFromProject = async (projectId, userId, tx) => {
    const db = tx ?? prisma;
    if (!projectId) {
        const workspace = await db.workspace.findFirst({
            where: { createdBy: userId },
            select: { id: true },
        });
        if (!workspace)
            throw new Error('No workspace found for user');
        return workspace.id;
    }
    const project = await db.project.findUnique({
        where: { id: projectId },
        select: { workspaceId: true },
    });
    if (!project)
        throw new Error('Project not found');
    return project.workspaceId;
};
//# sourceMappingURL=getWorkspaceIdFromProject.js.map