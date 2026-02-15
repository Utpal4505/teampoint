import { Prisma } from '../generated/prisma/client.ts'
import { ApiError } from './apiError.ts'

export async function handlePrismaNotFound<T>(
  prsimaOps: Promise<T>,
  notFoundMessage = 'Record not found',
): Promise<T> {
  try {
    return await prsimaOps
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new ApiError(404, notFoundMessage)
    }
    throw error
  }
}
