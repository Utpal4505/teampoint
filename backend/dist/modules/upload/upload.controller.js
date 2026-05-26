import { ApiError } from '../../utils/apiError.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { assertUser } from '../../utils/assertUser.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { UploadRequestSchema } from './upload.schema.js';
import { uploadCompleteService, uploadRequestService, directUploadService, } from './upload.service.js';
export const uploadRequestController = asyncHandler(async (req, res) => {
    assertUser(req.user);
    const input = UploadRequestSchema.parse(req.body);
    const response = await uploadRequestService(input, req.user.id);
    return res
        .status(201)
        .json(new ApiResponse(201, 'Upload URL generated successfully', response));
});
export const uploadCompleteController = asyncHandler(async (req, res) => {
    assertUser(req.user);
    const uploadId = Number(req.params.uploadId);
    if (!Number.isInteger(uploadId) || uploadId <= 0) {
        throw new ApiError(400, 'Invalid upload id');
    }
    const response = await uploadCompleteService(uploadId, req.user.id);
    return res
        .status(200)
        .json(new ApiResponse(200, 'File uploaded successfully', response));
});
export const directUploadController = asyncHandler(async (req, res) => {
    assertUser(req.user);
    if (!req.file) {
        throw new ApiError(400, 'No file provided');
    }
    const { category, contextId, fileName, contentType } = req.body;
    if (!category || !contextId || !fileName || !contentType) {
        throw new ApiError(400, 'Missing required fields: category, contextId, fileName, contentType');
    }
    const inputResult = UploadRequestSchema.safeParse({
        category,
        contextId: Number(contextId),
        fileName,
        contentType,
        fileSize: req.file.size,
    });
    if (!inputResult.success) {
        throw new ApiError(400, inputResult.error.issues[0]?.message || 'Invalid upload data');
    }
    const input = inputResult.data;
    const response = await directUploadService(input, req.file.buffer, req.user.id);
    return res
        .status(201)
        .json(new ApiResponse(201, 'File uploaded successfully', response));
});
//# sourceMappingURL=upload.controller.js.map