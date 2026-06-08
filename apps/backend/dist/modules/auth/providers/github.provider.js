import passport, {} from 'passport';
import { Strategy as GithubStrategy } from 'passport-github2';
import { env } from '../../../config/env.js';
import { ApiError } from '../../../utils/apiError.js';
import { authService } from '../auth.service.js';
passport.use(new GithubStrategy({
    clientID: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    callbackURL: env.GITHUB_CALLBACK_URL,
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        const user = await authService('GITHUB', profile);
        return done(null, user);
    }
    catch (error) {
        return done(error, false);
    }
}));
export default passport;
//# sourceMappingURL=github.provider.js.map