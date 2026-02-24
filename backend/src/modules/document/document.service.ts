import { prisma } from '../../config/db.config.ts'
import type { CreateDocumentDTO, CreateDocumentInput } from '../../types/document.type.ts'
import { ApiError } from '../../utils/apiError.ts'
import { assertProjectMember } from '../../utils/assertProjectMember.ts'
import { ensureExists } from '../../utils/ensureExists.ts'

export const createDocumentService = async (
  input: CreateDocumentInput,
  userId: number,
): Promise<CreateDocumentDTO> => {
  await assertProjectMember(input.projectId, userId)

  const upload = await prisma.upload.findUnique({
    where: { id: input.uploadId },
  })

  ensureExists(upload, 'Upload')

  if (upload.uploadedBy !== userId) throw new ApiError(403, 'Unauthorized upload')

  if (upload.status !== 'UPLOADED') throw new ApiError(400, 'Upload not completed')

  if (upload.category !== 'DOCUMENT') throw new ApiError(400, 'Invalid upload category')

  if (upload.contextId !== input.projectId)
    throw new ApiError(400, 'Upload project mismatch')

  const document = await prisma.document.create({
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
    },
  })

  return {
    ...document,
    fileKey: upload.fileKey,
    fileType: upload.contentType,
  }
}
