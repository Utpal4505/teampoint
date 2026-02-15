import { ROLE_PERMISSIONS } from '../modules/workspace/workspace.permissions.ts'
import type {
  WorkspacePermissionMap,
  WorkspacePermissionOverride,
} from '../types/workspace.types.ts'

export function resolveWorkspacePermission(
  role: keyof typeof ROLE_PERMISSIONS,
  overrides: WorkspacePermissionOverride | null,
  permission: keyof WorkspacePermissionMap,
): boolean {
  if (overrides && overrides[permission] !== undefined) {
    return overrides[permission]!
  }

  return ROLE_PERMISSIONS[role][permission]
}