import { Router } from 'express';
import multer from 'multer';
import { hardAuth } from '../../middlewares/auth.middlewares.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { UploadRequestSchema } from './upload.schema.js';
import { uploadCompleteController, uploadRequestController, directUploadController, } from './upload.controller.js';
const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024,
    },
});
router.use(hardAuth);
router.post('/request', validateRequest(UploadRequestSchema, 'body'), uploadRequestController);
router.post('/complete/:uploadId', uploadCompleteController);
router.post('/direct', upload.single('file'), directUploadController);
export default router;
//# sourceMappingURL=upload.routes.js.map