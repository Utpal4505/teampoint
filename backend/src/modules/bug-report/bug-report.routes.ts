import { Router } from 'express'
import { validateRequest } from '../../middlewares/validateRequest.js'
import { createBugReportSchema } from './bug-report.schema.js'
import { createBugReportController } from './bug-report.controller.js'
import { softAuth } from '../../middlewares/auth.middlewares.js'

const router = Router()

router.use(softAuth)

router.post('/', validateRequest(createBugReportSchema), createBugReportController)

export default router
