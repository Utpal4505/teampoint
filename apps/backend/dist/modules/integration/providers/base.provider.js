import crypto from 'crypto';
import { encodeState } from '../../../utils/oauthState.js';
export class BaseProvider {
    generateNonce() {
        return crypto.randomBytes(16).toString('hex');
    }
    encodeState(state) {
        return encodeState(state);
    }
}
//# sourceMappingURL=base.provider.js.map