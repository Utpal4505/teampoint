import { ApiResponse } from '../../utils/apiResponse.ts'
import { assertUser } from '../../utils/assertUser.ts'
import { asyncHandler } from '../../utils/asyncHandler.ts'
import { createBugReportService } from './bug-report.service.ts'

export const createBugReportController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const bugReport = await createBugReportService(req.body, req.user.id)

  return res
    .status(201)
    .json(new ApiResponse(201, 'Bug report created successfully', bugReport))
})
