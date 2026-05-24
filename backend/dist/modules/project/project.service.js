import { prisma } from '../../config/db.config.js';
import { ApiError } from '../../utils/apiError.js';
import { trackPosthogEvent } from '../../utils/posthog.js';
import { PROJECT_ROLE_PERMISSIONS } from './project.permissions.js';
export const createProjectService = async (input) => {
    const { createdBy, name, workspaceId, description } = input;
    const project = await prisma.$transaction(async (tx) => {
        const project = await tx.project.create({
            data: {
                name,
                workspaceId,
                description,
                createdBy,
            },
            select: {
                id: true,
                workspaceId: true,
                name: true,
                description: true,
                status: true,
                createdBy: true,
                createdAt: true,
            },
        });
        await tx.project_Members.create({
            data: {
                userId: createdBy,
                permissions: PROJECT_ROLE_PERMISSIONS.OWNER,
                projectId: project.id,
                role: 'OWNER',
                joinedAt: new Date(),
            },
        });
        return project;
    });
    trackPosthogEvent(createdBy, 'project_created', {
        project_id: project.id,
        workspace_id: project.workspaceId,
        project_name: project.name,
    });
    return project;
};
export const getProjectByIdService = async (projectId) => {
    const project = await prisma.project.findUnique({
        where: {
            id: projectId,
            status: {
                not: 'DELETED',
            },
        },
        select: {
            id: true,
            workspaceId: true,
            name: true,
            description: true,
            status: true,
            createdBy: true,
            projectMembers: {
                select: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            avatarUrl: true,
                        },
                    },
                    role: true,
                    joinedAt: true,
                },
            },
            createdAt: true,
        },
    });
    if (!project) {
        throw new ApiError(404, 'Project not found');
    }
    return project;
};
export const updateProjectService = async (input, userId) => {
    const { projectId, description, name, status } = input;
    const updateData = {};
    if (name)
        updateData.name = name.trim();
    if (description !== undefined)
        updateData.description = description;
    if (status !== undefined)
        updateData.status = status;
    if (!name && description === undefined && status === undefined) {
        throw new ApiError(400, 'No fields to update');
    }
    updateData.updatedAt = new Date();
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            status: 'ACTIVE',
        },
    });
    if (!project) {
        throw new ApiError(404, 'Project not found');
    }
    const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: updateData,
    });
    if (status === 'ARCHIVED' && userId) {
        trackPosthogEvent(userId, 'project_archived', {
            project_id: projectId,
            project_name: project.name,
        });
    }
    return updatedProject;
};
export const deleteProjectService = async (projectId) => {
    const result = await prisma.project.updateMany({
        where: {
            id: projectId,
            status: {
                in: ['ACTIVE', 'ARCHIVED', 'COMPLETED', 'ONHOLD'],
            },
        },
        data: {
            status: 'DELETED',
            deletedAt: new Date(),
        },
    });
    if (result.count === 0) {
        throw new ApiError(404, 'Project not found or cannot be deleted');
    }
    return {
        id: projectId,
        status: 'DELETED',
        deletedAt: new Date(),
    };
};
export const listAllWorkspaceProjectService = async (workspaceId, userId, filters = {}) => {
    const { status, createdBy } = filters;
    const where = {
        workspaceId,
        status: status ? status : { not: 'DELETED' },
        OR: [
            {
                projectMembers: {
                    some: { userId },
                },
            },
            {
                workspace: {
                    workspaceMembers: {
                        some: {
                            userId,
                            role: { in: ['OWNER', 'ADMIN'] },
                        },
                    },
                },
            },
        ],
    };
    if (createdBy) {
        where.createdBy = createdBy;
    }
    const projects = await prisma.project.findMany({
        where,
        select: {
            id: true,
            name: true,
            description: true,
            status: true,
            createdBy: true,
            createdAt: true,
            projectMembers: {
                select: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            avatarUrl: true,
                        },
                    },
                },
            },
            tasks: {
                select: {
                    id: true,
                    status: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return projects.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
        createdBy: project.createdBy,
        createdAt: project.createdAt,
        members: project.projectMembers.map(pm => ({
            id: pm.user.id,
            name: pm.user.fullName,
            avatarUrl: pm.user.avatarUrl,
        })),
        totalTasks: project.tasks.length,
        doneTasks: project.tasks.filter(t => t.status === 'DONE').length,
    }));
};
//# sourceMappingURL=project.service.js.map