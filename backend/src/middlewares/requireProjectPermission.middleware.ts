import type { RequestHandler } from 'express'
import type {
  ProjectPermissionMap,
  ProjectPermissionOverride,
} from '../types/project.type.ts'
import { assertUser } from '../utils/assertUser.ts'
import { asyncHandler } from '../utils/asyncHandler.ts'
import { ApiError } from '../utils/apiError.ts'
import { prisma } from '../config/db.config.ts'
import { resolveProjectPermission } from '../utils/resolveProjectPermission.ts'

export const requireProjectPermission = (
  permission: keyof ProjectPermissionMap,
): RequestHandler => {
  return asyncHandler(async (req, _res, next) => {
    assertUser(req.user)
    const user = req.user

    const projectId =
      Number(req.params?.projectId) ||
      Number(req.body?.projectId) ||
      Number(req.query?.projectId)

    if (!projectId) {
      throw new ApiError(400, 'Invalid project id')
    }

    const memebership = await prisma.project_Members.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: user.id,
        },
      },
      select: {
        role: true,
        permissions: true,
      },
    })

    if (!memebership) {
      throw new ApiError(403, 'User is not a member of this project')
    }

    const overrides = memebership.permissions as ProjectPermissionOverride | null

    const allowed = resolveProjectPermission(memebership.role, overrides, permission)

    if (!allowed) {
      throw new ApiError(403, 'Permission denied')
    }
    next()
  })
}
