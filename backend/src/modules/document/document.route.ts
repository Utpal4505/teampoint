import { Router } from 'express'
import { hardAuth } from '../../middlewares/auth.middlewares.ts'
import { validateRequest } from '../../middlewares/validateRequest.ts'
import {
  CreateDocumentSchema,
  documentIdParamSchema,
  UpdateDocumentSchema,
} from './document.schema.ts'
import {
  createDocumentController,
  deleteDocumentController,
  getSingleDocumentController,
  listDocumentsController,
  updateDocumentController,
} from './document.controller.ts'
import { requireProjectPermission } from '../../middlewares/requireProjectPermission.middleware.ts'
import { projectIdParamSchema } from '../project/project.schema.ts'
import { listDocumentLinksController } from '../documentLinks/documentLinks.controller.ts'

const router = Router({ mergeParams: true })

router.use(hardAuth)

router.use(validateRequest(projectIdParamSchema, 'params'))

router.post(
  '/',
  validateRequest(CreateDocumentSchema, 'body'),
  requireProjectPermission('canCreateDocs'),
  createDocumentController,
)

router.get('/', requireProjectPermission('canViewDocs'), listDocumentsController)

router.get(
  '/:documentId',
  validateRequest(documentIdParamSchema, 'params'),
  requireProjectPermission('canViewDocs'),
  getSingleDocumentController,
)

router.patch(
  '/:documentId',
  validateRequest(documentIdParamSchema, 'params'),
  validateRequest(UpdateDocumentSchema, 'body'),
  requireProjectPermission('canEditAnyDocs'),
  updateDocumentController,
)

router.delete(
  '/:documentId',
  validateRequest(documentIdParamSchema, 'params'),
  requireProjectPermission('canDeleteAnyDocs'),
  deleteDocumentController,
)

router.get(
  '/:documentId/document-links',
  validateRequest(documentIdParamSchema, 'params'),
  listDocumentLinksController,
)

export default router
