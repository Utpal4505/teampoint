import { ApiResponse } from '../../utils/apiResponse.js'
import { assertUser } from '../../utils/assertUser.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import {
  addProjectMemberSchema,
  exitProjectSchema,
  projectIdAndUserIdParamSchema,
  projectIdParamSchema,
  updateProjectMemberSchema,
} from './projectMember.schema.js'
import {
  addProjectMemberService,
  canManageProjectMembersService,
  listProjectMembersService,
  removeProjectMemberService,
  selfExitProjectService,
  updateProjectMemberService,
} from './projectMember.service.js'
import type { UpdateProjectMemberRoleInput } from '../../types/projectMember.type.js'
import { ApiError } from '../../utils/apiError.js'
import type { WorkspaceMemberStatus } from '../../generated/prisma/index.js'

export const addProjectMemberController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { projectId } = projectIdParamSchema.parse(req.params)
  const { userId, role } = addProjectMemberSchema.parse(req.body)

  const canManage = await canManageProjectMembersService(projectId, req.user.id)
  if (!canManage) {
    throw new ApiError(403, 'You do not have permission to add members to this project')
  }

  const projectMember = await addProjectMemberService({
    projectId,
    userId,
    role,
  })

  return res
    .status(201)
    .json(new ApiResponse(201, 'Member added to project successfully', projectMember))
})

export const listProjectMembersController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { projectId } = projectIdParamSchema.parse(req.params)

  const members = await listProjectMembersService(projectId)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Project members retrieved successfully', members))
})

export const updateProjectMemberController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { projectId, userId } = projectIdAndUserIdParamSchema.parse(req.params)
  const { role, status } = updateProjectMemberSchema.parse(req.body)

  if (role) {
    const canManage = await canManageProjectMembersService(projectId, req.user.id)
    if (!canManage) {
      throw new ApiError(403, 'You do not have permission to update member roles')
    }
  }

  const input: UpdateProjectMemberRoleInput = {
    projectId,
    userId,
    role,
    status: status as WorkspaceMemberStatus | null | undefined,
  }

  const updatedMember = await updateProjectMemberService(input)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Member updated successfully', updatedMember))
})

export const removeProjectMemberController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { projectId, userId } = projectIdAndUserIdParamSchema.parse(req.params)

  const canManage = await canManageProjectMembersService(projectId, req.user.id)
  if (!canManage) {
    throw new ApiError(
      403,
      'You do not have permission to remove members from this project',
    )
  }

  const removedMember = await removeProjectMemberService(projectId, userId)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Member removed from project successfully', removedMember))
})

export const exitProjectController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { projectId } = projectIdParamSchema.parse(req.params)
  const { userId } = exitProjectSchema.parse(req.body)

  const targetUserId = userId || req.user.id

  if (targetUserId !== req.user.id) {
    const canManage = await canManageProjectMembersService(projectId, req.user.id)
    if (!canManage) {
      throw new ApiError(403, 'You can only remove yourself from the project')
    }
  }

  const exitedMember = await selfExitProjectService(projectId, targetUserId)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Successfully exited project', exitedMember))
})
