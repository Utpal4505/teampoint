import { Router } from 'express'
import { validateRequest } from '../../middlewares/validateRequest.ts'
import { createBugReportSchema } from './bug-report.schema.ts'
import { createBugReportController } from './bug-report.controller.ts'
import { softAuth } from '../../middlewares/auth.middlewares.ts'

const router = Router()

router.use(softAuth)

router.post('/', validateRequest(createBugReportSchema), createBugReportController)

export default router
