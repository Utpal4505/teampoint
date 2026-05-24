import { ApiResponse } from '../../utils/apiResponse.js';
import { assertUser } from '../../utils/assertUser.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { createDocumentService, deleteDocumentService, getSingleDocumentByIdService, listDocumentsService, updateDocumentService, getDocumentDownloadUrlService, } from './document.service.js';
export const createDocumentController = asyncHandler(async (req, res) => {
    assertUser(req.user);
    const userId = req.user.id;
    const document = await createDocumentService(req.body, userId);
    return res
        .status(201)
        .json(new ApiResponse(201, 'Document created successfully', document));
});
export const listDocumentsController = asyncHandler(async (req, res) => {
    assertUser(req.user);
    const userId = req.user.id;
    const projectId = Number(req.params.projectId);
    const documents = await listDocumentsService(projectId, userId);
    return res
        .status(200)
        .json(new ApiResponse(200, 'Documents fetched successfully', documents));
});
export const getSingleDocumentController = asyncHandler(async (req, res) => {
    assertUser(req.user);
    const userId = req.user.id;
    const documentId = Number(req.params.documentId);
    const document = await getSingleDocumentByIdService(documentId, userId);
    return res
        .status(200)
        .json(new ApiResponse(200, 'Document fetched successfully', document));
});
export const updateDocumentController = asyncHandler(async (req, res) => {
    assertUser(req.user);
    const userId = req.user.id;
    const documentId = Number(req.params.documentId);
    const document = await updateDocumentService({
        ...req.body,
        documentId,
    }, userId);
    return res
        .status(200)
        .json(new ApiResponse(200, 'Document updated successfully', document));
});
export const deleteDocumentController = asyncHandler(async (req, res) => {
    assertUser(req.user);
    const documentId = Number(req.params.documentId);
    const document = await deleteDocumentService({
        documentId,
    });
    return res
        .status(200)
        .json(new ApiResponse(200, 'Document archived successfully', document));
});
export const getDocumentDownloadUrlController = asyncHandler(async (req, res) => {
    assertUser(req.user);
    const userId = req.user.id;
    const documentId = Number(req.params.documentId);
    const downloadUrl = await getDocumentDownloadUrlService(documentId, userId);
    return res
        .status(200)
        .json(new ApiResponse(200, 'Download URL generated successfully', downloadUrl));
});
//# sourceMappingURL=document.controller.js.map