import type { RequestUser } from '../types/auth.type.ts'
import { ApiError } from './apiError.ts'

export function assertUser(
  user: RequestUser | null | undefined,
): asserts user is RequestUser {
  if (!user) {
    throw new ApiError(401, 'User missing after auth middleware')
  }
}
