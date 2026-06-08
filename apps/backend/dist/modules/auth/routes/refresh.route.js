import { Router } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { ApiError } from '../../../utils/apiError.js';
import { handleRefreshToken, revokeTokens } from '../../../utils/refreshTokenHandler.js';
import { accessTokenCookieOptions, refreshTokenCookieOptions, } from '../../../utils/generateAccessandRefreshToken.js';
import { assertUser } from '../../../utils/assertUser.js';
import { hardAuth } from '../../../middlewares/auth.middlewares.js';
const router = Router();
router.post('/refresh', asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
        throw new ApiError(401, 'Refresh token not provided');
    const { accessToken, refreshToken: newRefreshToken } = await handleRefreshToken(refreshToken);
    return res
        .cookie('accessToken', accessToken, accessTokenCookieOptions)
        .cookie('refreshToken', newRefreshToken, refreshTokenCookieOptions)
        .json({ success: true, message: 'Tokens refreshed successfully' });
}));
router.post('/logout', hardAuth, asyncHandler(async (req, res) => {
    assertUser(req.user);
    await revokeTokens(req.user.id);
    return res
        .clearCookie('accessToken', accessTokenCookieOptions)
        .clearCookie('refreshToken', refreshTokenCookieOptions)
        .json({ success: true, message: 'Logged out successfully' });
}));
router.post('/logout-all', hardAuth, asyncHandler(async (req, res) => {
    assertUser(req.user);
    await revokeTokens(req.user.id);
    return res
        .clearCookie('accessToken', accessTokenCookieOptions)
        .clearCookie('refreshToken', refreshTokenCookieOptions)
        .json({ success: true, message: 'Logged out from all devices successfully' });
}));
export default router;
//# sourceMappingURL=refresh.route.js.map