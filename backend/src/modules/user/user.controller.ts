import { prisma } from '../../config/db.config.ts'
import { ApiError } from '../../utils/apiError.ts'
import { ApiResponse } from '../../utils/apiResponse.ts'
import { assertUser } from '../../utils/assertUser.ts'
import { asyncHandler } from '../../utils/asyncHandler.ts'
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from '../../utils/generateAccessandRefreshToken.ts'
import { revokeTokens } from '../../utils/refreshTokenHandler.ts'
import { AvatarCompleteSchema } from '../upload/upload.schema.ts'
import { createWorkspaceService } from '../workspace/workspace.service.ts'
import {
  avatarCompleteService,
  deleteUserService,
  getCurrentUserService,
  updateUserService,
} from './user.service.ts'

export const getCurrentUserController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const user = await getCurrentUserService({ userId: req.user.id })

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

  return res.status(201).json(
    new ApiResponse(201, 'Workspace created successfully', {
      workspaceId: workspace.id,
    }),
  )
})

export const deleteUserController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  await revokeTokens(req.user.id)
  const deletedUser = await deleteUserService({ userId: req.user.id })

  return res
    .status(200)
    .clearCookie('accessToken', accessTokenCookieOptions)
    .clearCookie('refreshToken', refreshTokenCookieOptions)
    .json(new ApiResponse(200, 'User account deactivated', deletedUser))
})

export const loggedOutController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  await revokeTokens(req.user.id)

  return res
    .status(200)
    .clearCookie('accessToken', accessTokenCookieOptions)
    .clearCookie('refreshToken', refreshTokenCookieOptions)
    .json(new ApiResponse(200, 'Logged out successfully'))
})

export const updateUserController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const updatedUser = await updateUserService({
    fullName: req.body.fullName,
    userId: req.user.id,
  })

  return res
    .status(200)
    .json(new ApiResponse(200, 'User updated sucessfully', updatedUser))
})

export const avatarCompleteController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const input = AvatarCompleteSchema.parse(req.body)

  const uploadId = input.uploadId

  const avatar = await avatarCompleteService(uploadId, req.user.id)

  return res.status(200).json(new ApiResponse(200, 'Avatar updated successfully', avatar))
})
