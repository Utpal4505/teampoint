import { Router } from 'express';
import { hardAuth } from '../../middlewares/auth.middlewares.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { CreateDocumentLinkSchema, DocumentEntityTypeSchema, idParam, } from './documentLinks.schema.js';
import { createDocumentLinkController, listEntityDocumentLinksController, unlinkDocumentController, } from './documentLinks.controller.js';
const router = Router();
router.use(hardAuth);
router.post('/', validateRequest(CreateDocumentLinkSchema, 'body'), createDocumentLinkController);
router.get('/:entityType/:entityId', validateRequest(DocumentEntityTypeSchema, 'params'), listEntityDocumentLinksController);
router.patch('/:linkId/unlink', validateRequest(idParam, 'params'), unlinkDocumentController);
export default router;
//# sourceMappingURL=documentLinks.route.js.map