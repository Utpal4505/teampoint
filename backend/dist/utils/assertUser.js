import { ApiError } from './apiError.js';
export function assertUser(user) {
    if (!user) {
        throw new ApiError(401, 'User missing after auth middleware');
    }
}
//# sourceMappingURL=assertUser.js.map