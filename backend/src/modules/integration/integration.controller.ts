import { asyncHandler } from '../../utils/asyncHandler.ts'
import { assertUser } from '../../utils/assertUser.ts'
import { ApiResponse } from '../../utils/apiResponse.ts'
import { ApiError } from '../../utils/apiError.ts'
import { env } from '../../config/env.ts'
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
  const { workspaceId } = req.body as { workspaceId: number }

  if (!workspaceId) {
    throw new ApiError(400, 'Workspace ID is required')
  }

  const result = await initiateIntegrationService(req.user.id, provider, workspaceId)

  return res.status(200).json(new ApiResponse(200, 'Authorization URL generated', result))
})

export const handleCallbackController = asyncHandler(async (req, res) => {
  const { code, state } = req.query as { code: string; state: string }

  if (!code || !state) {
    throw new ApiError(400, 'Missing authorization code or state')
  }

  const result = await handleCallbackService(code, state)

  const redirectUrl = new URL(
    `${env.CLIENT_URL}/workspace/${result.workspaceId}/settings/personal`,
  )

  return res.redirect(redirectUrl.toString())
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
