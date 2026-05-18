import type { RequestHandler } from 'express'
import { prisma } from '../config/db.config.js'
import type {
  WorkspacePermissionMap,
  WorkspacePermissionOverride,
} from '../types/workspace.types.js'
import { ApiError } from '../utils/apiError.js'
import { assertUser } from '../utils/assertUser.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { resolveWorkspacePermission } from '../utils/resolveWorkspacePermission.js'

export const requireWorkspacePermission = (
  permission: keyof WorkspacePermissionMap,
): RequestHandler => {
  return asyncHandler(async (req, _res, next) => {
    assertUser(req.user)
    const user = req.user

    const workspaceId =
      Number(req.params.workspaceId) ||
      Number(req.body.workspaceId) ||
      Number(req.query.workspaceId)

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
