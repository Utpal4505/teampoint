import type { Request } from 'express'
import { asyncHandler } from '../utils/asyncHandler.ts'
import { ApiError } from '../utils/apiError.ts'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.ts'
import { prisma } from '../config/db.config.ts'
import { assertUser } from '../utils/assertUser.ts'
import type { jwtPayload, RequestUser } from '../types/types.ts'

const extractToken = (req: Request): string | null => {
  const cookieToken = req.cookies?.accessToken
  const headerToken = req.header('Authorization')

  if (headerToken?.startsWith('Bearer ')) {
    return headerToken.slice(7)
  }

  if (typeof cookieToken === 'string') {
    return cookieToken
  }

  return null
}

const allowedRoutesForNewUser = [
  '/users/onboarding',
  '/users/me',
  '/auth/logout',
  '/workspaces/invites/accept',
  '/bug-reports/*',
]

export const restrictNewUserRoutes = asyncHandler((req, _res, next) => {
  assertUser(req.user)

  if (!req.user.is_new) return next()

  const path = req.path

  const allowed = allowedRoutesForNewUser.some(
    route => path === route || path.startsWith(route + '/'),
  )

  if (!allowed) {
    throw new ApiError(403, 'New users can only access onboarding routes')
  }

  next()
})

export const hardAuth = asyncHandler(async (req, _res, next) => {
  const token = extractToken(req)

  if (!token) {
    throw new ApiError(401, '⚠️ Your session has expired. Please login again.')
  }

  const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as jwtPayload

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
    select: {
      id: true,
      email: true,
      status: true,
      is_new: true,
    },
  })

  if (!user) {
    throw new ApiError(401, 'User not found')
  }

  if (user.status === 'INACTIVE') {
    throw new ApiError(403, 'User account has been deleted')
  }

  const safeUser: RequestUser = user

  req.user = safeUser

  next()
})

export const softAuth = asyncHandler(async (req, _res, next) => {
  const token = extractToken(req)

  if (!token) {
    req.user = null
    return next()
  }

  const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as jwtPayload

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
    select: {
      id: true,
      email: true,
      status: true,
      is_new: true,
    },
  })

  if (!user) {
    throw new ApiError(401, 'User not found')
  }

  if (user.status === 'INACTIVE') {
    throw new ApiError(403, 'User account has been deleted')
  }

  const safeUser: RequestUser = user

  req.user = safeUser

  next()
})
