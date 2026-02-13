import passport, { type Profile } from 'passport'
import { Strategy as GoogleStrategy, type VerifyCallback } from 'passport-google-oauth20'
import { env } from '../../../config/env.ts'
import { ApiError } from '../../../utils/apiError.ts'
import { authService } from '../auth.service.ts'

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      try {
        const user = await authService('GOOGLE', profile);

        return done(null, user)
      } catch (error) {
        return done(error as ApiError, false)
      }
    },
  ),
)

export default passport
