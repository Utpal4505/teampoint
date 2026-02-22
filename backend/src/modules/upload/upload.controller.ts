import { prisma } from '../../config/db.config.ts'
import { ApiError } from '../../utils/apiError.ts'
import { ApiResponse } from '../../utils/apiResponse.ts'
import { assertUser } from '../../utils/assertUser.ts'
import { asyncHandler } from '../../utils/asyncHandler.ts'
import { UploadCompleteSchema, UploadRequestSchema } from './upload.schema.ts'
import { uploadCompleteService, uploadRequestService } from './upload.service.ts'

export const uploadRequestController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const user = req.user

  const input = UploadRequestSchema.parse(req.body)

  let finalInput = input

  switch (input.category) {
    case 'AVATAR':
      {
        if (user.id !== input.contextId) {
          throw new ApiError(403, 'You can only upload your own avatar')
        }

        finalInput = {
          ...input,
          contextId: user.id,
        }
      }
      break

    case 'DOCUMENT':
      {
        const membership = await prisma.project_Members.findFirst({
          where: {
            projectId: input.contextId,
            userId: user.id,
            status: 'ACTIVE',
          },
        })
        if (!membership) {
          throw new ApiError(403, 'You are not a member of this project')
        }
      }
      break
    default:
      throw new ApiError(400, 'Invalid category')
  }

  const response = await uploadRequestService(finalInput)

  return res
    .status(201)
    .json(new ApiResponse(201, 'Upload URL generated successfully', response))
})

export const uploadCompleteController = asyncHandler(async (req, res) => {
  assertUser(req.user)
  const input = UploadCompleteSchema.parse(req.body)

  switch (input.category) {
    case 'AVATAR':
      {
        if (req.user.id !== input.contextId) {
          throw new ApiError(403, 'You can only complete your own avatar upload')
        }
      }
      break

    case 'DOCUMENT':
      {
        const membership = await prisma.project_Members.findFirst({
          where: {
            projectId: input.contextId,
            userId: req.user.id,
            status: 'ACTIVE',
          },
        })

        if (!membership) {
          throw new ApiError(403, 'You are not a member of this project')
        }
      }
      break
    default:
      throw new ApiError(400, 'Invalid category')
  }

  const response = await uploadCompleteService(input)

  return res
    .status(200)
    .json(new ApiResponse(200, 'File uploaded successfully', response))
})
