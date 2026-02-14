import { Router } from 'express'
import { validateRequest } from '../../middlewares/validateRequest.ts'
import { createWorkspaceSchema } from './workspace.schema.ts'
import { createWorkspaceController } from './workspace.controller.ts'
import { hardAuth } from '../../middlewares/auth.middlewares.ts'

const router = Router()

router.post(
  '/',
  hardAuth,
  validateRequest(createWorkspaceSchema, 'body'),
  createWorkspaceController,
)

export default router
