import { Prisma } from '../generated/prisma/index.js';
import { ApiError } from './apiError.js';
export async function handlePrismaNotFound(prsimaOps, notFoundMessage = 'Record not found') {
    try {
        return await prsimaOps;
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new ApiError(404, notFoundMessage);
        }
        throw error;
    }
}
//# sourceMappingURL=handlePrismaNotFound.js.map