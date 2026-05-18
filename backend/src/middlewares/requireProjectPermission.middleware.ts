import type { RequestHandler } from 'express'
import type {
  ProjectPermissionMap,
  ProjectPermissionOverride,
} from '../types/project.type.js'
import { assertUser } from '../utils/assertUser.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiError.js'
import { prisma } from '../config/db.config.js'
import { resolveProjectPermission } from '../utils/resolveProjectPermission.js'

export const requireProjectPermission = (
  permission: keyof ProjectPermissionMap,
): RequestHandler => {
  return asyncHandler(async (req, _res, next) => {
    assertUser(req.user)
    const user = req.user

    const projectId = req.params?.projectId
      ? Number(req.params.projectId)
      : req.body?.projectId
        ? Number(req.body.projectId)
        : req.query?.projectId
          ? Number(req.query.projectId)
          : null

    if (!projectId || isNaN(projectId)) {
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
      const workspaceMembership = await prisma.workspace_Members.findFirst({
        where: {
          workspace: {
            projects: {
              some: { id: projectId }
            }
          },
          userId: user.id,
          role: { in: ['OWNER', 'ADMIN'] },
          status: 'ACTIVE'
        }
      })

      if (!workspaceMembership) {
        throw new ApiError(403, 'User is not a member of this project')
      }

      return next()
    }

    const overrides = memebership.permissions as ProjectPermissionOverride | null

    const allowed = resolveProjectPermission(memebership.role, overrides, permission)

    if (!allowed) {
      throw new ApiError(403, 'Permission denied')
    }
    next()
  })
}
