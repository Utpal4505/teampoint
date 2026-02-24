import { prisma } from '../../config/db.config.ts'
import type { Prisma } from '../../generated/prisma/client.ts'
import type {
  UploadCompleteRequestDTO,
  UploadRequest,
  UploadResponse,
} from '../../types/upload.types.ts'
import { ApiError } from '../../utils/apiError.ts'
import { assertProjectMember } from '../../utils/assertProjectMember.ts'
import { ensureExists } from '../../utils/ensureExists.ts'
import storage from './storage/index.ts'

export const uploadRequestService = async (
  input: UploadRequest,
  userId: number,
): Promise<UploadResponse> => {
  const { category, contentType, contextId, fileName, fileSize } = input

  if (category === 'AVATAR') {
    if (contextId !== userId) {
      throw new ApiError(403, 'You can only upload your own avatar')
    }
  }

  if (category === 'DOCUMENT') {
    await assertProjectMember(contextId, userId)
  }

  const uploadData = await storage.generateUploadUrl(input)

  const upload = await prisma.upload.create({
    data: {
      category,
      contextId,
      fileName,
      size: fileSize,
      contentType,
      fileKey: uploadData.fileKey,
      status: 'PENDING',
      uploadedBy: userId,
      expiresAt: new Date(Date.now() + uploadData.expiresIn * 1000),
    },
  })

  return {
    uploadId: upload.id,
    presignedUrl: uploadData.presignedUrl,
    expiresIn: uploadData.expiresIn,
    fileKey: uploadData.fileKey,
  }
}

export const uploadCompleteService = async (
  uploadId: number,
  userId: number,
  tx?: Prisma.TransactionClient,
): Promise<UploadCompleteRequestDTO> => {
  const db = tx ?? prisma

  const upload = await db.upload.findUnique({
    where: { id: uploadId },
  })

  ensureExists(upload, 'Upload')

  if (upload.uploadedBy !== userId) {
    throw new ApiError(403, 'Unauthorized')
  }

  if (upload.status !== 'PENDING') {
    throw new ApiError(400, 'Invalid upload state')
  }

  if (upload.expiresAt && upload.expiresAt < new Date()) {
    throw new ApiError(400, 'Upload expired')
  }

  await storage.verifyFileExists(upload.fileKey)

  const updated = await db.upload.update({
    where: { id: upload.id },
    data: { status: 'UPLOADED' },
  })

  return {
    uploadId: updated.id,
    fileKey: updated.fileKey,
    category: updated.category,
    contextId: updated.contextId,
  }
}
