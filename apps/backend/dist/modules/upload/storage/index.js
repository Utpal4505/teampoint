import { env } from '../../../config/env.js';
import { R2Storage } from './r2.storage.js';
let storage;
switch (env.STORAGE_PROVIDER) {
    case 'R2':
        storage = new R2Storage();
        break;
    default:
        throw new Error(`Unsupported STORAGE_PROVIDER: ${env.STORAGE_PROVIDER}`);
}
export default storage;
//# sourceMappingURL=index.js.map