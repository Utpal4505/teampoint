import { prisma } from '../../config/db.config.ts'
import type { DocumentEntityType, Prisma } from '../../generated/prisma/client.ts'
import type {
  CreateDocumentLinkInput,
  CreateDocumentLinkResponse,
  ListDocumentLinksResponse,
  ListEntityDocumentLinksResponse,
  UnlinkDocumentResponse,
} from '../../types/documentLink.type.ts'
import { ApiError } from '../../utils/apiError.ts'
import { assertProjectMember } from '../../utils/assertProjectMember.ts'
import { ensureExists } from '../../utils/ensureExists.ts'
import { getWorkspaceIdFromProject } from '../../utils/getWorkspaceIdFromProject.ts'

const validateEntityAndProject = async (
  tx: Prisma.TransactionClient,
  entityType: string,
  entityId: number,
  projectId: number,
) => {
  switch (entityType) {
    case 'TASK':
      return tx.tasks.findFirst({
        where: { id: entityId, projectId },
        select: { id: true },
      })

    case 'DISCUSSION':
      return tx.discussion.findFirst({
        where: { id: entityId, projectId },
        select: { id: true },
      })

    case 'MILESTONE':
      return tx.milestone.findFirst({
        where: { id: entityId, projectId },
        select: { id: true },
      })

    case 'MEETING':
      return tx.meeting.findFirst({
        where: { id: entityId, projectId },
        select: { id: true },
      })

    default:
      return null
  }
}

export const createDocumentLinkService = async (
  input: CreateDocumentLinkInput,
  userId: number,
): Promise<CreateDocumentLinkResponse> => {
  const { documentId, entityType, entityId } = input

  return prisma.$transaction(async tx => {
    const document = await tx.document.findUnique({
      where: { id: documentId },
      select: {
        id: true,
        projectId: true,
        uploadedBy: true,
      },
    })

    ensureExists(document, 'Document')

    const entity = await validateEntityAndProject(
      tx,
      entityType,
      entityId,
      document.projectId,
    )

    ensureExists(entity, 'Entity')

    assertProjectMember(document.projectId, userId, tx)

    const existing = await tx.documentLink.findFirst({
      where: {
        documentId,
        entityType,
        entityId,
        status: 'LINKED',
      },
    })

    if (existing) {
      throw new ApiError(409, 'Document already linked to this entity')
    }

    const link = await tx.documentLink.create({
      data: {
        documentId,
        entityType,
        entityId,
        status: 'LINKED',
      },
    })

    const workspaceId = await getWorkspaceIdFromProject(document.projectId, userId, tx)

    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { fullName: true },
    })

    const linkedDoc = await tx.document.findUnique({
      where: { id: documentId },
      select: { title: true },
    })

    await tx.activityLog.create({
      data: {
        action: 'CREATED',
        entityType: 'DOCUMENT',
        entityId: link.id,
        actorId: userId,
        workspaceId,
        projectId: document.projectId,
        content: `Document "${linkedDoc?.title}" was linked to ${entityType.toLowerCase()} ${entityId} by ${user?.fullName || 'Unknown'}`,
      },
    })

    return link
  })
}

export const listDocumentLinksService = async (
  documentId: number,
): Promise<ListDocumentLinksResponse> => {
  const links = await prisma.documentLink.findMany({
    where: {
      documentId,
      status: 'LINKED',
    },
    select: {
      id: true,
      entityType: true,
      entityId: true,
      createdAt: true,
    },
  })

  return {
    data: links,
  }
}

export const listEntityDocumentLinksService = async (
  entityType: DocumentEntityType,
  entityId: number,
): Promise<ListEntityDocumentLinksResponse> => {
  const links = await prisma.documentLink.findMany({
    where: {
      entityType,
      entityId,
      status: 'LINKED',
    },
  })

  return {
    data: links,
  }
}

export const unlinkDocumentService = async (
  linkId: number,
  userId?: number,
): Promise<UnlinkDocumentResponse> => {
  return prisma.$transaction(async tx => {
    const linkData = await tx.documentLink.findUnique({
      where: { id: linkId },
      select: {
        id: true,
        documentId: true,
        entityType: true,
        entityId: true,
      },
    })

    if (!linkData) {
      throw new ApiError(404, 'Link not found')
    }

    const result = await tx.documentLink.updateMany({
      where: {
        id: linkId,
        status: 'LINKED',
      },
      data: {
        status: 'UNLINKED',
        unlinkedAt: new Date(),
      },
    })

    if (result.count === 0) {
      throw new ApiError(404, 'Link not found or already unlinked')
    }

    const updated = await tx.documentLink.findUnique({
      where: { id: linkId },
      select: {
        id: true,
        status: true,
        unlinkedAt: true,
      },
    })

    if (!updated || !updated.unlinkedAt) {
      throw new ApiError(500, 'Failed to unlink document')
    }

    // Add activity log if userId is provided
    if (userId) {
      const document = await tx.document.findUnique({
        where: { id: linkData.documentId },
        select: { title: true, projectId: true },
      })

      if (document) {
        const workspaceId = await getWorkspaceIdFromProject(
          document.projectId,
          userId,
          tx,
        )

        const user = await tx.user.findUnique({
          where: { id: userId },
          select: { fullName: true },
        })

        await tx.activityLog.create({
          data: {
            action: 'DELETED',
            entityType: 'DOCUMENT',
            entityId: linkData.id,
            actorId: userId,
            workspaceId,
            projectId: document.projectId,
            content: `Document "${document.title}" was unlinked from ${linkData.entityType.toLowerCase()} ${linkData.entityId} by ${user?.fullName || 'Unknown'}`,
          },
        })
      }
    }

    return {
      id: updated.id,
      status: updated.status,
      unlinkedAt: updated.unlinkedAt,
    }
  })
}
