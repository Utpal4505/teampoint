import { ApiResponse } from '../../utils/apiResponse.ts'
import { assertUser } from '../../utils/assertUser.ts'
import { asyncHandler } from '../../utils/asyncHandler.ts'
import { createWorkspaceService } from './workspace.service.ts'

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
