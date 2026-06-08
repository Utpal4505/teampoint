import { Router } from 'express'
import passport from 'passport'
import { asyncHandler } from '../../../utils/asyncHandler.js'
import { ApiError } from '../../../utils/apiError.js'
import {
  generateAccessAndRefreshTokens,
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from '../../../utils/generateAccessandRefreshToken.js'
import { prisma } from '../../../config/db.config.js'
import { trackPosthogEvent } from '../../../utils/posthog.js'
import bcrypt from 'bcrypt'
import { env } from '../../../config/env.js'
import { assertUser } from '../../../utils/assertUser.js'

const router = Router()

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }))

router.get(
  '/github/callback',
  (req, res, next) => {
    passport.authenticate(
      'github',
      { session: false },
      (err: Error | null, user: Express.User | false, info: object) => {
        if (err || !user) {
          console.error('GitHub OAuth Error:', err?.message || info)
          return res.redirect(`${env.CLIENT_URL}/login?error=github_auth_failed`)
        }
        req.user = user
        next()
      },
    )(req, res, next)
  },
  asyncHandler(async (req, res) => {
    assertUser(req.user)

    const user = req.user
    if (!user) throw new ApiError(401, 'User not authenticated')

    const userId = user?.id

    await prisma.refreshToken.deleteMany({
      where: { userId, provider: 'GITHUB' },
    })

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(userId)
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10)

    await prisma.refreshToken.create({
      data: {
        userId,
        provider: 'GITHUB',
        tokenHash: refreshTokenHash,
        expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    })

    trackPosthogEvent(userId, 'user_logged_in', { auth_provider: 'GITHUB' })

    return res
      .cookie('accessToken', accessToken, accessTokenCookieOptions)
      .cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
      .redirect(`${env.CLIENT_URL}/auth-callback`)
  }),
)

export default router
