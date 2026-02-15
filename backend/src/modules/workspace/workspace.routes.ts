import { Router } from 'express'
import { validateRequest } from '../../middlewares/validateRequest.ts'
import { createWorkspaceSchema, workspaceIdParamSchema } from './workspace.schema.ts'
import { createWorkspaceController, getWorkspaceByIdController } from './workspace.controller.ts'
import { hardAuth } from '../../middlewares/auth.middlewares.ts'

const router = Router()

router.post(
  '/',
  hardAuth,
  validateRequest(createWorkspaceSchema, 'body'),
  createWorkspaceController,
)

router.get(
  "/:workspaceId",
  hardAuth,
  validateRequest(workspaceIdParamSchema, 'params'),
  getWorkspaceByIdController,
)

export default router
