import { ApiResponse } from '../../utils/apiResponse.ts'
import { assertUser } from '../../utils/assertUser.ts'
import { asyncHandler } from '../../utils/asyncHandler.ts'
import {
  archiveWorkspaceService,
  createWorkspaceService,
  deleteWorkspaceService,
  getWorkspaceByIdService,
  updateWorkspaceService,
} from './workspace.service.ts'

export const createWorkspaceController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { workspaceName, description } = req.body

  const workspace = await createWorkspaceService({
    name: workspaceName,
    ownerId: req.user.id,
    description: description,
  })

  return res
    .status(201)
    .json(new ApiResponse(201, 'Workspace created successfully', workspace))
})

export const getWorkspaceByIdController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { workspaceId } = req.params

  const workspace = await getWorkspaceByIdService(Number(workspaceId))

  return res
    .status(200)
    .json(new ApiResponse(200, 'Workspace retrieved successfully', workspace))
})

export const updateWorkspaceController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { workspaceId } = req.params
  const { name, description } = req.body

  const updatedWorkspace = await updateWorkspaceService({
    workspaceId: Number(workspaceId),
    name,
    description,
  })

  return res
    .status(200)
    .json(new ApiResponse(200, 'Workspace updated successfully', updatedWorkspace))
})

export const archiveWorkspaceController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { workspaceId } = req.params

  const archivedWorkspace = await archiveWorkspaceService({
    workspaceId: Number(workspaceId),
  })

  return res
    .status(200)
    .json(new ApiResponse(200, 'Workspace archived successfully', archivedWorkspace))
})

export const deleteWorkspaceController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const { workspaceId } = req.params

  const deletedWorkspace = await deleteWorkspaceService({
    workspaceId: Number(workspaceId),
  })

  return res
    .status(200)
    .json(new ApiResponse(200, 'Workspace deleted successfully', deletedWorkspace))
})
