import { asyncHandler } from '../../utils/asyncHandler.ts'
import { assertUser } from '../../utils/assertUser.ts'
import { ApiResponse } from '../../utils/apiResponse.ts'
import type {
  CreateMeetingServiceInput,
  ListMeetingsServiceQuery,
  ManageParticipantsInput,
  CompleteMeetingInput,
  CancelMeetingInput,
  GetParticipantsQuery,
  UpdateMeetingInput,
} from '../../types/meeting.type.ts'
import {
  createMeetingService,
  listMeetingsService,
  getMeetingService,
  updateMeetingService,
  getParticipantsService,
  manageParticipantsService,
  completeMeetingService,
  cancelMeetingService,
} from './meeting.service.ts'

export const createMeetingController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const input: CreateMeetingServiceInput = {
    projectId: Number(req.params.projectId),
    ...req.body,
  }

  const meeting = await createMeetingService(input, req.user.id)

  return res
    .status(201)
    .json(new ApiResponse(201, 'Meeting created successfully', meeting))
})

export const listMeetingsController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const query: ListMeetingsServiceQuery = {
    projectId: Number(req.params.projectId),
    ...req.query,
  }

  const result = await listMeetingsService(query, req.user.id)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Meetings fetched successfully', result))
})

export const getMeetingController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const meetingId = Number(req.params.meetingId)

  const meeting = await getMeetingService(meetingId, req.user.id)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Meeting fetched successfully', meeting))
})

export const updateMeetingController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const input: UpdateMeetingInput = {
    meetingId: Number(req.params.meetingId),
    ...req.body,
  }

  const updated = await updateMeetingService(input, req.user.id)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Meeting updated successfully', updated))
})

export const getParticipantsController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const meetingId = Number(req.params.meetingId)
  const query: GetParticipantsQuery = req.query as unknown as GetParticipantsQuery

  const result = await getParticipantsService(meetingId, query, req.user.id)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Participants fetched successfully', result))
})

export const manageParticipantsController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const input: ManageParticipantsInput = {
    meetingId: Number(req.params.meetingId),
    ...req.body,
  }

  const result = await manageParticipantsService(input, req.user.id)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Participants updated successfully', result))
})

export const completeMeetingController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const input: CompleteMeetingInput = {
    meetingId: Number(req.params.meetingId),
    ...req.body,
  }

  const result = await completeMeetingService(input, req.user.id)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Meeting completed successfully', result))
})

export const cancelMeetingController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const input: CancelMeetingInput = {
    meetingId: Number(req.params.meetingId),
  }

  const result = await cancelMeetingService(input, req.user.id)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Meeting cancelled successfully', result))
})
