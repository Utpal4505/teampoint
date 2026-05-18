import { PROJECT_ROLE_PERMISSIONS } from '../modules/project/project.permissions.js'
import type {
  ProjectPermissionMap,
  ProjectPermissionOverride,
} from '../types/project.type.js'

export function resolveProjectPermission(
  role: keyof typeof PROJECT_ROLE_PERMISSIONS,
  overrides: ProjectPermissionOverride | null,
  permission: keyof ProjectPermissionMap,
): boolean {
  if (overrides && overrides[permission] !== undefined) {
    return overrides[permission]!
  }

  return PROJECT_ROLE_PERMISSIONS[role][permission]
}
