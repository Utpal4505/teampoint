import { prisma } from '../../config/db.config.ts'
import { Prisma } from '../../generated/prisma/client.ts'
import type { GetUserDTO, UserDeletionDTO } from '../../types/user.types.ts'
import { ApiError } from '../../utils/apiError.ts'

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
      avatar_url: true,
      status: true,
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
  try {
    const user = await prisma.$transaction(async prisma => {
      const updatedUser = await prisma.user.update({
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
      })

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

    return user
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new ApiError(404, 'User not found')
      }

      if (error.code === 'P2002') {
        throw new ApiError(409, 'Duplicate value conflict')
      }
    }

    throw error
  }
}
