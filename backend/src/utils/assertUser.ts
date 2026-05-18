import type { RequestUser } from '../types/types.js'
import { ApiError } from './apiError.js'

export function assertUser(
  user: RequestUser | null | undefined,
): asserts user is RequestUser {
  if (!user) {
    throw new ApiError(401, 'User missing after auth middleware')
  }
}
