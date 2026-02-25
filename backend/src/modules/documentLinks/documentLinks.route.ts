import { Router } from 'express'
import { hardAuth } from '../../middlewares/auth.middlewares.ts'
import { validateRequest } from '../../middlewares/validateRequest.ts'

import {
  CreateDocumentLinkSchema,
  DocumentEntityTypeSchema,
  idParam,
} from './documentLinks.schema.ts'

import {
  createDocumentLinkController,
  listEntityDocumentLinksController,
  unlinkDocumentController,
} from './documentLinks.controller.ts'

const router = Router()

router.use(hardAuth)

router.post(
  '/',
  validateRequest(CreateDocumentLinkSchema, 'body'),
  createDocumentLinkController,
)

router.get(
  '/:entityType/:entityId',
  validateRequest(DocumentEntityTypeSchema, 'params'),
  listEntityDocumentLinksController,
)

router.patch(
  '/:linkId/unlink',
  validateRequest(idParam, 'params'),
  unlinkDocumentController,
)

export default router
