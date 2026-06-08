import { ApiError } from "./apiError.js";
export function ensureExists(value, entityName) {
    if (value == null) {
        throw new ApiError(404, `${entityName} not found`);
    }
}
//# sourceMappingURL=ensureExists.js.map