import { ApiResponse } from '../../utils/apiResponse.ts'
import { assertUser } from '../../utils/assertUser.ts'
import { asyncHandler } from '../../utils/asyncHandler.ts'
import type { CreateDocumentInput } from './document.schema.ts'
import { createDocumentService } from './document.service.ts'

export const createDocumentController = asyncHandler(async (req, res) => {
  assertUser(req.user)
  const userId = req.user.id

  const document = await createDocumentService(req.body as CreateDocumentInput, userId)

  return res
    .status(201)
    .json(new ApiResponse(201, 'Document created successfully', document))
})
