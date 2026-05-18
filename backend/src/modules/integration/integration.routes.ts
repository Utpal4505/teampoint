import { Router } from 'express'
import { hardAuth } from '../../middlewares/auth.middlewares.js'
import { validateRequest } from '../../middlewares/validateRequest.js'

import {
  ProviderParamSchema,
  OAuthCallbackQuerySchema,
} from './integration.schema.js'

import {
  listIntegrationsController,
  initiateIntegrationController,
  handleCallbackController,
  getIntegrationStatusController,
  disconnectIntegrationController,
} from './integration.controller.js'

const router = Router()

router.get(
  '/',
  hardAuth,
  listIntegrationsController,
)

router.post(
  '/:provider/connect',
  hardAuth,
  validateRequest(ProviderParamSchema, 'params'),
  initiateIntegrationController,
)

router.get(
  '/:provider/callback',
  validateRequest(OAuthCallbackQuerySchema, 'query'),
  handleCallbackController,
)

router.get(
  '/:provider',
  hardAuth,
  validateRequest(ProviderParamSchema, 'params'),
  getIntegrationStatusController,
)

router.delete(
  '/:provider',
  hardAuth,
  validateRequest(ProviderParamSchema, 'params'),
  disconnectIntegrationController,
)

export default router