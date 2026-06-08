import { ROLE_PERMISSIONS } from '../modules/workspace/workspace.permissions.js';
export function resolveWorkspacePermission(role, overrides, permission) {
    if (overrides && overrides[permission] !== undefined) {
        return overrides[permission];
    }
    return ROLE_PERMISSIONS[role][permission];
}
//# sourceMappingURL=resolveWorkspacePermission.js.map