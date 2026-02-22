import { Router } from 'express'
import { hardAuth } from '../../middlewares/auth.middlewares.ts'
import { validateRequest } from '../../middlewares/validateRequest.ts'
import { UploadCompleteSchema, UploadRequestSchema } from './upload.schema.ts'
import { uploadCompleteController, uploadRequestController } from './upload.controller.ts'

const router = Router()

router.use(hardAuth)

router.post(
  'request',
  validateRequest(UploadRequestSchema, 'body'),
  uploadRequestController,
)
router.post(
  'complete',
  validateRequest(UploadCompleteSchema, 'body'),
  uploadCompleteController,
)

export default router
