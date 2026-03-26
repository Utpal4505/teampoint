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
  getDocumentDownloadUrlController,
} from './document.controller.ts'
import { requireProjectPermission } from '../../middlewares/requireProjectPermission.middleware.ts'
import { projectIdParamSchema } from '../project/project.schema.ts'
import { listDocumentLinksController } from '../documentLinks/documentLinks.controller.ts'

const router = Router({ mergeParams: true })

router.use(hardAuth)

router.use(validateRequest(projectIdParamSchema, 'params'))

router.post(
  '/:documentId/download-url',
  requireProjectPermission('canViewDocs'),
  validateRequest(documentIdParamSchema, 'params'),
  getDocumentDownloadUrlController,
)

router.post(
  '/',
  validateRequest(CreateDocumentSchema, 'body'),
  requireProjectPermission('canCreateDocs'),
  createDocumentController,
)

router.get('/', requireProjectPermission('canViewDocs'), listDocumentsController)

router.get(
  '/:documentId',
  requireProjectPermission('canViewDocs'),
  validateRequest(documentIdParamSchema, 'params'),
  getSingleDocumentController,
)

router.patch(
  '/:documentId',
  requireProjectPermission('canEditAnyDocs'),
  validateRequest(documentIdParamSchema, 'params'),
  validateRequest(UpdateDocumentSchema, 'body'),
  updateDocumentController,
)

router.delete(
  '/:documentId',
  requireProjectPermission('canDeleteAnyDocs'),
  validateRequest(documentIdParamSchema, 'params'),
  deleteDocumentController,
)

router.get(
  '/:documentId/document-links',
  requireProjectPermission('canViewDocs'),
  validateRequest(documentIdParamSchema, 'params'),
  listDocumentLinksController,
)

export default router
