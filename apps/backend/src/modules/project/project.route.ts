import { Router } from 'express'
import { hardAuth } from '../../middlewares/auth.middlewares.js'
import { validateRequest } from '../../middlewares/validateRequest.js'
import { requireWorkspacePermission } from '../../middlewares/requireWorkspacePermission.middleware.js'
import {
  createProjectSchema,
  projectIdParamSchema,
  updateProjectSchema,
} from './project.schema.js'
import {
  createProjectController,
  deleteProjectController,
  getProjectByIdController,
  updateProjectController,
} from './project.controller.js'
import { workspaceIdParamSchema } from '../workspace/workspace.schema.js'

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
  validateRequest(workspaceIdParamSchema, 'body'),
  requireWorkspacePermission('canDeleteProject'),
  deleteProjectController,
)

export default router
