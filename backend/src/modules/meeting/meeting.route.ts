import { Router } from 'express'
import { hardAuth } from '../../middlewares/auth.middlewares.ts'
import { validateRequest } from '../../middlewares/validateRequest.ts'
import {
  CreateMeetingSchema,
  UpdateMeetingSchema,
  ListMeetingsQuerySchema,
  MeetingIdParamSchema,
  GetParticipantsQuerySchema,
  ManageParticipantsSchema,
  CompleteMeetingSchema,
} from './meeting.schema.ts'
import {
  createMeetingController,
  listMeetingsController,
  getMeetingController,
  updateMeetingController,
  getParticipantsController,
  manageParticipantsController,
  completeMeetingController,
  cancelMeetingController,
} from './meeting.controller.ts'

const router = Router({ mergeParams: true })

router.use(hardAuth)

router.get('/', validateRequest(ListMeetingsQuerySchema, 'query'), listMeetingsController)

router.post('/', validateRequest(CreateMeetingSchema, 'body'), createMeetingController)

router.get(
  '/:meetingId',
  validateRequest(MeetingIdParamSchema, 'params'),
  getMeetingController,
)

router.patch(
  '/:meetingId',
  validateRequest(MeetingIdParamSchema, 'params'),
  validateRequest(UpdateMeetingSchema, 'body'),
  updateMeetingController,
)

router.get(
  '/:meetingId/participants',
  validateRequest(MeetingIdParamSchema, 'params'),
  validateRequest(GetParticipantsQuerySchema, 'query'),
  getParticipantsController,
)

router.patch(
  '/:meetingId/participants',
  validateRequest(MeetingIdParamSchema, 'params'),
  validateRequest(ManageParticipantsSchema, 'body'),
  manageParticipantsController,
)

router.post(
  '/:meetingId/complete',
  validateRequest(MeetingIdParamSchema, 'params'),
  validateRequest(CompleteMeetingSchema, 'body'),
  completeMeetingController,
)

router.post(
  '/:meetingId/cancel',
  validateRequest(MeetingIdParamSchema, 'params'),
  cancelMeetingController,
)

export default router
