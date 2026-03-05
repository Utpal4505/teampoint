import { Router } from 'express'
import { asyncHandler } from '../../../utils/asyncHandler.ts'
import { ApiError } from '../../../utils/apiError.ts'
import { handleRefreshToken, revokeTokens } from '../../../utils/refreshTokenHandler.ts'
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from '../../../utils/generateAccessandRefreshToken.ts'
import { assertUser } from '../../../utils/assertUser.ts'
import { hardAuth } from '../../../middlewares/auth.middlewares.ts'

const router = Router()

router.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) throw new ApiError(401, 'Refresh token not provided')

    const { accessToken, refreshToken: newRefreshToken } =
      await handleRefreshToken(refreshToken)

    return res
      .cookie('accessToken', accessToken, accessTokenCookieOptions)
      .cookie('refreshToken', newRefreshToken, refreshTokenCookieOptions)
      .json({ success: true, message: 'Tokens refreshed successfully' })
  }),
)

router.post(
  '/logout',
  hardAuth,
  asyncHandler(async (req, res) => {
    assertUser(req.user)
    await revokeTokens(req.user.id)
    return res
      .clearCookie('accessToken', accessTokenCookieOptions)
      .clearCookie('refreshToken', refreshTokenCookieOptions)
      .json({ success: true, message: 'Logged out successfully' })
  }),
)

router.post(
  '/logout-all',
  hardAuth,
  asyncHandler(async (req, res) => {
    assertUser(req.user)
    await revokeTokens(req.user.id)
    return res
      .clearCookie('accessToken', accessTokenCookieOptions)
      .clearCookie('refreshToken', refreshTokenCookieOptions)
      .json({ success: true, message: 'Logged out from all devices successfully' })
  }),
)

export default router
