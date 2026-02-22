import { prisma } from '../../config/db.config.ts'
import { env } from '../../config/env.ts'
import type {
  UploadCompleteRequest,
  UploadCompleteRequestDTO,
  UploadRequest,
  UploadResponse,
} from '../../types/upload.types.ts'
import { ensureExists } from '../../utils/ensureExists.ts'
import storage from './storage/index.ts'

export const uploadRequestService = async (
  input: UploadRequest,
): Promise<UploadResponse> => {
  const { category, contentType, contextId, fileName, fileSize } = input

  let uploadData: UploadResponse

  if (category === 'AVATAR') {
    uploadData = await storage.generateAvatarUploadUrl(input)
  } else {
    uploadData = await storage.generateSignedUploadUrl(input)
  }

  await prisma.upload.create({
    data: {
      category: category,
      contentType: contentType,
      contextId: contextId,
      fileKey: uploadData.fileKey,
      size: fileSize,
      fileName,
      status: 'PENDING',
      expiresAt: new Date(Date.now() + uploadData.expiresIn * 1000),
    },
  })

  return uploadData
}

export const uploadCompleteService = async (
  input: UploadCompleteRequest,
): Promise<UploadCompleteRequestDTO> => {
  const { category, contextId, fileKey } = input

  const uploadRecord = await prisma.upload.findFirst({
    where: {
      fileKey,
      contextId,
      category,
    },
  })

  ensureExists(uploadRecord, 'Upload')

  await prisma.upload.update({
    where: {
      id: uploadRecord.id,
    },
    data: {
      status: 'UPLOADED',
    },
  })

  switch (category) {
    case 'AVATAR':
      {
        const publicUrl = `${env.R2_AVATARS_PUBLIC_BASE_URL}/${fileKey}`

        await prisma.user.update({
          where: {
            id: contextId,
          },
          data: {
            avatarUploadId: uploadRecord.id,
            avatarUrl: publicUrl,
          },
        })
      }
      break

    case 'DOCUMENT':
      await prisma.document.update({
        where: {
          id: contextId,
        },
        data: {
          uploadId: uploadRecord.id,
        },
      })
      break
    default:
      break
  }

  return {
    fileKey,
  }
}
