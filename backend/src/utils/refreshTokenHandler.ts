import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { ApiError } from './apiError.ts'
import { prisma } from '../config/db.config.ts'
import { env } from '../config/env.ts'
import type { OAuthProvider } from '../generated/prisma/enums.ts'
import { generateAccessAndRefreshTokens } from './generateAccessandRefreshToken.ts'

interface TokenPayload {
  id: number
  iat?: number
  exp?: number
}

const REFRESH_TOKEN_TTL_MS = env.REFRESH_TOKEN_EXPIRY

export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as TokenPayload
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError)
      throw new ApiError(401, 'Refresh token has expired')
    if (error instanceof jwt.JsonWebTokenError)
      throw new ApiError(401, 'Invalid refresh token')
    throw new ApiError(401, 'Token verification failed')
  }
}

export const revokeTokens = async (
  userId: number,
  options: { tokenId?: number } = {},
) => {
  try {
    await prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
        ...(options.tokenId && { id: options.tokenId }),
      },
      data: { revokedAt: new Date() },
    })
  } catch {
    throw new ApiError(500, 'Failed to revoke token(s)')
  }
}

const revokeTokenFamily = async (userId: number) => {
  await revokeTokens(userId)
}

export const handleRefreshToken = async (
  oldRefreshToken: string,
  provider: OAuthProvider,
) => {
  const { id: userId } = verifyRefreshToken(oldRefreshToken)

  const storedToken = await prisma.refreshToken.findFirst({
    where: { userId, provider, revokedAt: null },
    orderBy: { createdAt: 'desc' },
  })

  if (!storedToken) throw new ApiError(401, 'Refresh token not found or revoked')

  const isTokenValid = await bcrypt.compare(oldRefreshToken, storedToken.tokenHash)

  if (!isTokenValid) {
    await revokeTokenFamily(userId)
    throw new ApiError(401, 'Invalid refresh token — possible reuse detected')
  }

  if (new Date() > storedToken.expiredAt) throw new ApiError(401, 'Refresh token expired')

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(userId)
  const newTokenHash = await bcrypt.hash(refreshToken, 10)

  const [newToken] = await prisma.$transaction([
    prisma.refreshToken.create({
      data: {
        userId,
        provider,
        tokenHash: newTokenHash,
        expiredAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      },
    }),
    prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: {
        revokedAt: new Date(),
      },
    }),
  ])

  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { replacedBy: newToken.id },
  })

  return { accessToken, refreshToken }
}
