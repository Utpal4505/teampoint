import { Router } from 'express'
import { hardAuth } from '../../middlewares/auth.middlewares.ts'
import { validateRequest } from '../../middlewares/validateRequest.ts'
import { requireWorkspacePermission } from '../../middlewares/requireWorkspacePermission.middleware.ts'
import {
  createProjectSchema,
  projectIdParamSchema,
  updateProjectSchema,
} from './project.schema.ts'
import {
  createProjectController,
  deleteProjectController,
  getProjectByIdController,
  updateProjectController,
} from './project.controller.ts'

const router = Router()

router.use(hardAuth)

router.post(
  '/',
  validateRequest(createProjectSchema, 'body'),
  requireWorkspacePermission('canCreateProjects'),
  createProjectController,
)

router.get(
  '/:projectId',
  validateRequest(projectIdParamSchema, 'params'),
  getProjectByIdController,
)

router.patch(
  '/:projectId',
  validateRequest(projectIdParamSchema, 'params'),
  validateRequest(updateProjectSchema, 'body'),
  requireWorkspacePermission('canEditProject'),
  updateProjectController,
)

router.delete(
  '/:projectId',
  validateRequest(projectIdParamSchema, 'params'),
  requireWorkspacePermission('canDeleteProject'),
  deleteProjectController,
)

export default router
