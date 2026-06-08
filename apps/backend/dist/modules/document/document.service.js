import { prisma } from '../../config/db.config.js';
import { ApiError } from '../../utils/apiError.js';
import { trackPosthogEvent } from '../../utils/posthog.js';
import { assertProjectMember } from '../../utils/assertProjectMember.js';
import { ensureExists } from '../../utils/ensureExists.js';
import { getWorkspaceIdFromProject } from '../../utils/getWorkspaceIdFromProject.js';
export const createDocumentService = async (input, userId) => {
    return prisma.$transaction(async (tx) => {
        await assertProjectMember(input.projectId, userId, tx);
        const upload = await tx.upload.findUnique({
            where: { id: input.uploadId },
        });
        ensureExists(upload, 'Upload');
        if (upload.uploadedBy !== userId)
            throw new ApiError(403, 'Unauthorized upload');
        if (upload.status !== 'UPLOADED')
            throw new ApiError(400, 'Upload not completed');
        if (upload.category !== 'DOCUMENT')
            throw new ApiError(400, 'Invalid upload category');
        if (upload.contextId !== input.projectId)
            throw new ApiError(400, 'Upload project mismatch');
        const document = await tx.document.create({
            data: {
                title: input.title,
                description: input.description ?? null,
                projectId: input.projectId,
                uploadId: upload.id,
                uploadedBy: userId,
            },
            select: {
                id: true,
                projectId: true,
                uploadedBy: true,
                title: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                isArchived: true,
                uploader: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                    },
                },
            },
        });
        const workspaceId = await getWorkspaceIdFromProject(document.projectId, userId, tx);
        await tx.activityLog.create({
            data: {
                action: 'CREATED',
                entityType: 'DOCUMENT',
                entityId: document.id,
                actorId: userId,
                workspaceId,
                projectId: document.projectId,
                content: `Document "${document.title}" was created by ${document.uploader.fullName}`,
            },
        });
        const result = {
            id: document.id,
            projectId: document.projectId,
            title: document.title,
            description: document.description,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
            isArchived: document.isArchived,
            uploadedBy: {
                id: document.uploader.id,
                name: document.uploader.fullName,
                avatarUrl: document.uploader.avatarUrl,
            },
            fileKey: upload.fileKey,
            fileType: upload.contentType,
        };
        trackPosthogEvent(userId, 'document_uploaded', {
            document_id: document.id,
            project_id: document.projectId,
            file_type: upload.contentType,
            file_size_kb: Math.round(upload.size / 1024),
        });
        return result;
    });
};
export const listDocumentsService = async (projectId, userId) => {
    await assertProjectMember(projectId, userId);
    const documents = await prisma.document.findMany({
        where: {
            projectId,
        },
        select: {
            id: true,
            title: true,
            description: true,
            upload: {
                select: {
                    fileKey: true,
                    contentType: true,
                },
            },
            uploader: {
                select: {
                    id: true,
                    fullName: true,
                    avatarUrl: true,
                },
            },
            isArchived: true,
            createdAt: true,
            updatedAt: true,
            links: {
                where: {
                    status: 'LINKED',
                },
                select: {
                    id: true,
                    entityType: true,
                    entityId: true,
                    createdAt: true,
                },
            },
        },
    });
    return documents.map(doc => ({
        id: doc.id,
        createdAt: doc.createdAt,
        description: doc.description,
        fileKey: doc.upload.fileKey,
        fileType: doc.upload.contentType,
        isArchived: doc.isArchived,
        title: doc.title,
        updatedAt: doc.updatedAt,
        uploadedBy: {
            id: doc.uploader.id,
            name: doc.uploader.fullName,
            avatarUrl: doc.uploader.avatarUrl,
        },
        links: (doc.links || []).map(link => ({
            id: link.id,
            entityId: link.entityId,
            entityType: link.entityType,
            createdAt: link.createdAt,
        })),
    }));
};
export const getSingleDocumentByIdService = async (documentId, userId) => {
    const document = await prisma.document.findUnique({
        where: {
            id: documentId,
        },
        select: {
            id: true,
            title: true,
            description: true,
            projectId: true,
            upload: {
                select: {
                    fileKey: true,
                    contentType: true,
                },
            },
            uploader: {
                select: {
                    id: true,
                    fullName: true,
                    avatarUrl: true,
                },
            },
            isArchived: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    ensureExists(document, 'Document');
    await assertProjectMember(document.projectId, userId);
    return {
        createdAt: document.createdAt,
        description: document.description,
        fileKey: document.upload.fileKey,
        fileType: document.upload.contentType,
        id: document.id,
        isArchived: document.isArchived,
        projectId: document.projectId,
        title: document.title,
        updatedAt: document.updatedAt,
        uploadedBy: {
            id: document.uploader.id,
            name: document.uploader.fullName,
            avatarUrl: document.uploader.avatarUrl,
        },
    };
};
export const updateDocumentService = async (input, userId) => {
    return prisma.$transaction(async (tx) => {
        const { documentId, title, description, isArchived } = input;
        const existingDocument = await tx.document.findUnique({
            where: { id: documentId },
            select: {
                id: true,
                title: true,
                description: true,
                isArchived: true,
            },
        });
        ensureExists(existingDocument, 'Document');
        const updateData = {};
        if (title !== undefined) {
            updateData.title = title.trim();
        }
        if (description !== undefined) {
            updateData.description = description;
        }
        if (isArchived !== undefined) {
            updateData.isArchived = isArchived;
        }
        if (Object.keys(updateData).length === 0) {
            throw new Error('No valid fields provided for update');
        }
        updateData.updatedAt = new Date();
        const updatedDocument = await tx.document.update({
            where: { id: documentId },
            data: updateData,
            select: {
                id: true,
                title: true,
                description: true,
                isArchived: true,
                updatedAt: true,
                projectId: true,
            },
        });
        const workspaceId = await getWorkspaceIdFromProject(updatedDocument.projectId, userId, tx);
        const user = await tx.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                fullName: true,
            },
        });
        ensureExists(user, 'User');
        await tx.activityLog.create({
            data: {
                action: 'UPDATED',
                entityId: updatedDocument.id,
                entityType: 'DOCUMENT',
                actorId: userId,
                workspaceId,
                projectId: updatedDocument.projectId,
                content: `Document ${updatedDocument.title} was updated by ${user.fullName}`,
            },
        });
        return updatedDocument;
    });
};
export const deleteDocumentService = async (input) => {
    const { documentId } = input;
    const document = await prisma.document.findUnique({
        where: { id: documentId },
        select: {
            id: true,
            isArchived: true,
            upload: {
                select: {
                    fileKey: true,
                },
            },
        },
    });
    ensureExists(document, 'Document');
    if (document.isArchived) {
        throw new Error('Document already archived');
    }
    const updated = await prisma.document.update({
        where: { id: documentId },
        data: {
            isArchived: true,
        },
        select: {
            id: true,
            updatedAt: true,
            isArchived: true,
            title: true,
        },
    });
    return {
        id: updated.id,
        isArchived: updated.isArchived,
        archivedAt: updated.updatedAt,
        title: updated.title,
    };
};
export const getDocumentDownloadUrlService = async (documentId, userId) => {
    const document = await prisma.document.findUnique({
        where: { id: documentId },
        select: {
            id: true,
            projectId: true,
            upload: {
                select: {
                    fileKey: true,
                },
            },
        },
    });
    ensureExists(document, 'Document');
    await assertProjectMember(document.projectId, userId);
    const { default: storage } = await import('../../modules/upload/storage/index.js');
    const result = await storage.generateSignedDownloadUrl(document.upload.fileKey, 3600);
    return {
        presignedUrl: result.presignedUrl,
        expiresIn: result.expiresIn,
    };
};
//# sourceMappingURL=document.service.js.map