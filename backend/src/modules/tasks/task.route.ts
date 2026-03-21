import { Router } from 'express'
import { hardAuth } from '../../middlewares/auth.middlewares.ts'
import { validateRequest } from '../../middlewares/validateRequest.ts'
import {
  changeTaskStatusController,
  cancelTaskController,
  createTaskController,
  createPersonalTaskController,
  getTaskByIdController,
  listTasksController,
  updateTaskController,
} from './task.controller.ts'
import {
  changeTaskStatusSchema,
  createTaskSchema,
  createPersonalTaskSchema,
  listTasksQuerySchema,
  taskIdParamSchema,
  updateTaskSchema,
} from './task.schema.ts'
import { requireProjectPermission } from '../../middlewares/requireProjectPermission.middleware.ts'
import { projectIdParamSchema } from '../project/project.schema.ts'

const router = Router({ mergeParams: true })

router.use(hardAuth)

router.use(validateRequest(projectIdParamSchema, 'params'))

router.post(
  '/',
  validateRequest(createTaskSchema, 'body'),
  requireProjectPermission('canCreateTasks'),
  createTaskController,
)

router.get(
  '/',
  validateRequest(listTasksQuerySchema, 'query'),
  requireProjectPermission('canViewTasks'),
  listTasksController,
)

router.get(
  '/:taskId',
  validateRequest(taskIdParamSchema, 'params'),
  getTaskByIdController,
)

router.patch(
  '/:taskId',
  validateRequest(taskIdParamSchema, 'params'),
  validateRequest(updateTaskSchema, 'body'),
  updateTaskController,
)

router.patch(
  '/:taskId/status',
  validateRequest(taskIdParamSchema, 'params'),
  validateRequest(changeTaskStatusSchema, 'body'),
  changeTaskStatusController,
)

router.post(
  '/:taskId/cancel',
  validateRequest(taskIdParamSchema, 'params'),
  cancelTaskController,
)

const personalTaskRouter = Router()

personalTaskRouter.use(hardAuth)

personalTaskRouter.post(
  '/',
  validateRequest(createPersonalTaskSchema, 'body'),
  createPersonalTaskController,
)

export default router
export { personalTaskRouter }
