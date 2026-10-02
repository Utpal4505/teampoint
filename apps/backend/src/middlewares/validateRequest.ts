import { z } from 'zod'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiError.js'

export const validateRequest = <T extends z.ZodType>(
  schema: T,
  target: 'body' | 'params' | 'query' = 'body',
) =>
  asyncHandler(async (req, _res, next) => {
    const result = schema.safeParse(req[target])
    const { success, data, error } = result

    if (!success) {
      const issues = error?.issues ?? []
      const message =
        issues.length > 0
          ? issues
              .map(issue => {
                const path = issue.path.length > 0 ? issue.path.join('.') : 'value'
                return `${path}: ${issue.message}`
              })
              .join('; ')
          : 'Invalid request data'

      throw new ApiError(400, message)
    }

    if (target === 'query') {
      Object.assign(req.query, data)
    } else if (target === 'params') {
      Object.assign(req.params, data)
    } else {
      req[target] = data
    }

    next()
  })
