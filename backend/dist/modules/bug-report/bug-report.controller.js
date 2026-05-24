import { ApiResponse } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { createBugReportService } from './bug-report.service.js';
export const createBugReportController = asyncHandler(async (req, res) => {
    const bugReport = await createBugReportService(req.body, req.user?.id);
    return res
        .status(201)
        .json(new ApiResponse(201, 'Bug report created successfully', bugReport));
});
//# sourceMappingURL=bug-report.controller.js.map