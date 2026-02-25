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
  userId: number
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

    // add activityLog

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
): Promise<UnlinkDocumentResponse> => {
  const result = await prisma.documentLink.updateMany({
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

  const updated = await prisma.documentLink.findUnique({
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

  return {
    id: updated.id,
    status: updated.status,
    unlinkedAt: updated.unlinkedAt,
  }
}
