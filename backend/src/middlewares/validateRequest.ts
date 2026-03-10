import { z } from 'zod'
import { asyncHandler } from '../utils/asyncHandler.ts'
import { ApiError } from '../utils/apiError.ts'

export const validateRequest = <T extends z.ZodType>(
  schema: T,
  target: 'body' | 'params' | 'query' = 'body',
) =>
  asyncHandler(async (req, _res, next) => {
    const result = schema.safeParse(req[target])

    const { success, data, error } = result

    if (!success) {
      const errors = error?.issues[0]?.message || 'Invalid request data'
      throw new ApiError(400, errors)
    }

    if (target === 'query') {
      Object.assign(req.query, data)
    } else {
      req[target] = data
    }

    next()
  })
