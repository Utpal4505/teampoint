import { Router } from 'express';
import { hardAuth } from '../../middlewares/auth.middlewares.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { changeTaskStatusController, cancelTaskController, createTaskController, getTaskByIdController, listTasksController, updateTaskController, } from './task.controller.js';
import { changeTaskStatusSchema, createTaskSchema, listTasksQuerySchema, taskIdParamSchema, updateTaskSchema, } from './task.schema.js';
import { requireProjectPermission } from '../../middlewares/requireProjectPermission.middleware.js';
const router = Router({ mergeParams: true });
router.use(hardAuth);
router.post('/', validateRequest(createTaskSchema, 'body'), createTaskController);
router.get('/', validateRequest(listTasksQuerySchema, 'query'), requireProjectPermission('canViewTasks'), listTasksController);
router.get('/:taskId', validateRequest(taskIdParamSchema, 'params'), getTaskByIdController);
router.patch('/:taskId', validateRequest(taskIdParamSchema, 'params'), validateRequest(updateTaskSchema, 'body'), updateTaskController);
router.patch('/:taskId/status', validateRequest(taskIdParamSchema, 'params'), validateRequest(changeTaskStatusSchema, 'body'), changeTaskStatusController);
router.post('/:taskId/cancel', validateRequest(taskIdParamSchema, 'params'), cancelTaskController);
export default router;
//# sourceMappingURL=task.route.js.map