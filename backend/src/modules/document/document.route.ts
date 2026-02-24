import { Router } from 'express'
import { hardAuth } from '../../middlewares/auth.middlewares.ts'
import { validateRequest } from '../../middlewares/validateRequest.ts'
import { CreateDocumentSchema } from './document.schema.ts'
import { createDocumentController } from './document.controller.ts'
import { requireProjectPermission } from '../../middlewares/requireProjectPermission.middleware.ts'

const router = Router()

router.use(hardAuth)

router.post(
  '/',
  validateRequest(CreateDocumentSchema, 'body'),
  requireProjectPermission('canCreateDocs'),
  createDocumentController,
)

export default router
