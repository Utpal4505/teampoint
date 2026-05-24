import { ApiResponse } from '../../utils/apiResponse.js';
import { assertUser } from '../../utils/assertUser.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { createDocumentLinkService, listDocumentLinksService, listEntityDocumentLinksService, unlinkDocumentService, } from './documentLinks.service.js';
export const createDocumentLinkController = asyncHandler(async (req, res) => {
    assertUser(req.user);
    const input = req.body;
    const documentLink = await createDocumentLinkService(input, req.user.id);
    return res
        .status(201)
        .json(new ApiResponse(201, 'Document Linked Sucessfully', documentLink));
});
export const listDocumentLinksController = asyncHandler(async (req, res) => {
    assertUser(req.user);
    const documentId = Number(req.params.documentId);
    const result = await listDocumentLinksService(documentId);
    return res
        .status(200)
        .json(new ApiResponse(200, 'Document links fetched successfully', result));
});
export const listEntityDocumentLinksController = asyncHandler(async (req, res) => {
    assertUser(req.user);
    const entityType = req.params.entityType;
    const entityId = Number(req.params.entityId);
    const result = await listEntityDocumentLinksService(entityType, entityId);
    return res
        .status(200)
        .json(new ApiResponse(200, 'Entity document links fetched successfully', result));
});
export const unlinkDocumentController = asyncHandler(async (req, res) => {
    assertUser(req.user);
    const linkId = Number(req.params.linkId);
    const result = await unlinkDocumentService(linkId, req.user.id);
    return res
        .status(200)
        .json(new ApiResponse(200, 'Document unlinked successfully', result));
});
//# sourceMappingURL=documentLinks.controller.js.map