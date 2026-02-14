import { prisma } from '../../config/db.config.ts'
import { ApiError } from '../../utils/apiError.ts'
import { ApiResponse } from '../../utils/apiResponse.ts'
import { assertUser } from '../../utils/assertUser.ts'
import { asyncHandler } from '../../utils/asyncHandler.ts'
import { createWorkspaceService } from '../workspace/workspace.service.ts'
import { getUserById } from './user.service.ts'

export const getUserByIdController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const user = await getUserById({ userId: req.user.id })

  return res.status(200).json(new ApiResponse(200, 'User retrieved successfully', user))
})

export const onboardingController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const user = req.user

  const { workspaceName, description } = req.body

  if (!user.is_new) {
    throw new ApiError(400, 'User already onboarded')
  }

  const workspace = await createWorkspaceService({
    name: workspaceName,
    ownerId: req.user.id,
    description: description,
  })

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      is_new: false,
    },
  })

  return res
    .status(201)
    .json(
      new ApiResponse(201, 'Workspace created successfully', {
        workspaceId: workspace.id,
      }),
    )
})
