import { PROJECT_ROLE_PERMISSIONS } from '../modules/project/project.permissions.js';
export function resolveProjectPermission(role, overrides, permission) {
    if (overrides && overrides[permission] !== undefined) {
        return overrides[permission];
    }
    return PROJECT_ROLE_PERMISSIONS[role][permission];
}
//# sourceMappingURL=resolveProjectPermission.js.map