import { env } from 'node:process'
import { prisma } from '../../config/db.config.ts'
import type {
  GetUserDTO,
  UpdateUserDTO,
  UpdateUserInput,
  UserDeletionDTO,
} from '../../types/user.types.ts'
import { ApiError } from '../../utils/apiError.ts'
import { handlePrismaNotFound } from '../../utils/handlePrismaNotFound.ts'
import { uploadCompleteService } from '../upload/upload.service.ts'
import { ensureExists } from '../../utils/ensureExists.ts'

export const getCurrentUserService = async ({
  userId,
}: {
  userId: number
}): Promise<GetUserDTO> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      fullName: true,
      avatarUrl: true,
      email: true,
      status: true,
      is_new: true,
      created_at: true,
    },
  })

  if (!user || user.status === 'INACTIVE') {
    throw new ApiError(404, 'User not found.')
  }

  return user
}

export const deleteUserService = async ({
  userId,
}: {
  userId: number
}): Promise<UserDeletionDTO> => {
  return prisma.$transaction(async prisma => {
    const updatedUser = handlePrismaNotFound(
      prisma.user.update({
        where: {
          id: userId,
          status: 'ACTIVE',
        },
        data: {
          status: 'INACTIVE',
          deleted_at: new Date(),
        },
        select: {
          id: true,
          status: true,
        },
      }),
    )

    await prisma.refreshToken.updateMany({
      where: {
        userId: userId,
      },
      data: {
        revokedAt: new Date(),
      },
    })

    return updatedUser
  })
}

export const updateUserService = async (
  input: UpdateUserInput,
): Promise<UpdateUserDTO> => {
  const { fullName, userId } = input

  return handlePrismaNotFound(
    prisma.user.update({
      where: {
        id: userId,
        status: 'ACTIVE',
      },
      data: {
        fullName,
      },
      select: {
        id: true,
        fullName: true,
        updated_at: true,
      },
    }),
    'User not found',
  )
}

export const avatarCompleteService = async (
  uploadId: number,
  userId: number,
): Promise<{
  id: number
  avatarUrl: string | null
}> => {
  return prisma.$transaction(async tx => {
    const upload = await tx.upload.findUnique({
      where: { id: uploadId },
    })

    ensureExists(upload, 'Upload')

    if (upload.category !== 'AVATAR') {
      throw new ApiError(400, 'Invalid upload category')
    }

    const completedUpload = await uploadCompleteService(upload.id, userId, tx)

    const publicUrl = `${env.R2_AVATARS_PUBLIC_BASE_URL}/${completedUpload.fileKey}`

    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        avatarUploadId: completedUpload.uploadId,
        avatarUrl: publicUrl,
      },
      select: {
        id: true,
        avatarUrl: true,
      },
    })

    return updatedUser
  })
}
