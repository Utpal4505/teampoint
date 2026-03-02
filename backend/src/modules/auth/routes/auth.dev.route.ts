import { Router } from 'express'
import { asyncHandler } from '../../../utils/asyncHandler.ts'
import { prisma } from '../../../config/db.config.ts'
import { generateAccessAndRefreshTokens } from '../../../utils/generateAccessandRefreshToken.ts'
import { ApiError } from '../../../utils/apiError.ts'
import { env } from '../../../config/env.ts'

const router = Router()

router.post(
  '/dev-login',
  asyncHandler(async (req, res) => {
    if (env.NODE_ENV !== 'development') {
      throw new ApiError(403, 'Not allowed')
    }

    const secret = req.headers['x-dev-secret']
    if (!secret || secret !== env.DEV_AUTH_SECRET) {
      throw new ApiError(403, 'Invalid dev secret')
    }

    const { email } = req.body

    if (!email) {
      throw new ApiError(400, 'Email is required')
    }

    let user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          fullName: 'Dev User',
          status: 'ACTIVE',
          is_new: false,
        },
      })
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.id)

    return res.status(200).json({
      message: 'Dev login successful',
      accessToken,
      refreshToken,
    })
  }),
)

export default router
