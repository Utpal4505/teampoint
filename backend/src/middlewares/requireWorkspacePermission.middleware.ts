import type { RequestHandler } from 'express'
import { prisma } from '../config/db.config.ts'
import type {
  WorkspacePermissionMap,
  WorkspacePermissionOverride,
} from '../types/workspace.types.ts'
import { ApiError } from '../utils/apiError.ts'
import { assertUser } from '../utils/assertUser.ts'
import { asyncHandler } from '../utils/asyncHandler.ts'
import { resolveWorkspacePermission } from '../utils/resolveWorkspacePermission.ts'

export const requireWorkspacePermission = (
  permission: keyof WorkspacePermissionMap,
): RequestHandler => {
  return asyncHandler(async (req, _res, next) => {
    assertUser(req.user)
    const user = req.user

    const workspaceId = Number(req.params.workspaceId)

    if (!workspaceId) {
      throw new ApiError(400, 'Invalid workspace id')
    }

    const memebership = await prisma.workspace_Members.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: workspaceId,
          userId: user.id,
        },
      },
      select: {
        role: true,
        permissions: true,
      },
    })

    if (!memebership) {
      throw new ApiError(403, 'User is not a member of this workspace')
    }

    const overrides = memebership.permissions as WorkspacePermissionOverride | null

    const allowed = resolveWorkspacePermission(memebership.role, overrides, permission)

    if (!allowed) {
      throw new ApiError(403, 'Permission denied')
    }

    next()
  })
}
