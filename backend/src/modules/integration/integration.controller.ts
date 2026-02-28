import { asyncHandler } from '../../utils/asyncHandler.ts'
import { assertUser } from '../../utils/assertUser.ts'
import { ApiResponse } from '../../utils/apiResponse.ts'
import type { IntegrationProvider } from '../../types/integration.types.ts'
import {
  listIntegrationsService,
  initiateIntegrationService,
  handleCallbackService,
  getIntegrationStatusService,
  disconnectIntegrationService,
} from './integration.service.ts'

export const listIntegrationsController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const result = await listIntegrationsService(req.user.id)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Integrations fetched successfully', result))
})

export const initiateIntegrationController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const provider = req.params.provider as IntegrationProvider

  const result = await initiateIntegrationService(req.user.id, provider)

  return res.status(200).json(new ApiResponse(200, 'Authorization URL generated', result))
})

export const handleCallbackController = asyncHandler(async (req, res) => {
  const { code, state } = req.query as { code: string; state: string }

  const result = await handleCallbackService(code, state)

  return res
    .status(200)
    .json(new ApiResponse(200, 'Integration connected successfully', result))
})

export const getIntegrationStatusController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const provider = req.params.provider as IntegrationProvider

  const result = await getIntegrationStatusService(req.user.id, provider)

  return res.status(200).json(new ApiResponse(200, 'Integration status fetched', result))
})

export const disconnectIntegrationController = asyncHandler(async (req, res) => {
  assertUser(req.user)

  const provider = req.params.provider as IntegrationProvider

  const result = await disconnectIntegrationService(req.user.id, provider)

  return res
    .status(200)
    .json(new ApiResponse(200, `${provider} integration disconnected`, result))
})
