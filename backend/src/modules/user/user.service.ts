import { prisma } from '../../config/db.config.ts'
import { ApiError } from '../../utils/apiError.ts'

export const getUserById = async ({ userId }: { userId: number }) => {
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

  if (!user) {
    throw new ApiError(404, 'User not found.')
  }

  if (user.status === 'INACTIVE') {
    throw new ApiError(403, 'User account has been deleted.')
  }

  return user
}
