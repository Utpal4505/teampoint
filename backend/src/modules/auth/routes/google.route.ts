import { Router } from 'express'
import passport from 'passport'
import { asyncHandler } from '../../../utils/asyncHandler.ts'
import { ApiError } from '../../../utils/apiError.ts'
import {
  generateAccessAndRefreshTokens,
  accessTokenCookieOptions, refreshTokenCookieOptions,
} from '../../../utils/generateAccessandRefreshToken.ts'
import { prisma } from '../../../config/db.config.ts'
import bcrypt from 'bcrypt'
import { env } from '../../../config/env.ts'
import { assertUser } from '../../../utils/assertUser.ts'

const router = Router()

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  asyncHandler(async (req, res) => {
    assertUser(req.user)

    const user = req.user

    if (!user) throw new ApiError(401, 'User not authenticated')

    const userId = user?.id

    await prisma.refreshToken.deleteMany({
      where: {
        userId: userId,
        provider: 'GOOGLE',
      },
    })

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(userId)

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10)

    await prisma.refreshToken.create({
      data: {
        userId: userId,
        provider: 'GOOGLE',
        tokenHash: refreshTokenHash,
        expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    })

    const redirectUrl = user.is_new
      ? `${env.CLIENT_URL}/onboarding`
      : `${env.CLIENT_URL}/dashboard`

    return res
      .cookie('accessToken', accessToken, accessTokenCookieOptions)
      .cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
      .redirect(redirectUrl)
  }),
)

export default router
