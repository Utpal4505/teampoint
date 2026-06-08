import { ApiError } from './apiError.js';
export function encodeState(state) {
    return Buffer.from(JSON.stringify(state)).toString('base64url');
}
export function decodeState(raw) {
    try {
        const json = Buffer.from(raw, 'base64url').toString();
        return JSON.parse(json);
    }
    catch {
        throw new ApiError(400, 'Invalid OAuth state');
    }
}
//# sourceMappingURL=oauthState.js.map