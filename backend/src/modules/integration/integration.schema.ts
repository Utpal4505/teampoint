import z from 'zod'

export const IntegrationProviderSchema = z.enum(['GOOGLE'])

export const ProviderParamSchema = z.object({
  provider: IntegrationProviderSchema,
})

export const IntegrationConnectResponseSchema = z.object({
  authorizationUrl: z.string().url(),
})

export const OAuthCallbackQuerySchema = z.object({
  code: z.string().min(1, 'Authorization code is required'),
  state: z.string().min(1, 'State is required'),
})

export const OAuthCallbackResponseSchema = z.object({
  provider: IntegrationProviderSchema,
  status: z.literal('CONNECTED'),
})

export const IntegrationStatusSchema = z.enum(['CONNECTED', 'DISCONNECTED', 'EXPIRED'])

export const IntegrationStatusResponseSchema = z.object({
  provider: IntegrationProviderSchema,
  status: IntegrationStatusSchema,
  scopes: z.array(z.string()),
  connectedAt: z.date().nullable(),
})

export const IntegrationSummarySchema = z.object({
  provider: IntegrationProviderSchema,
  status: IntegrationStatusSchema,
  connectedAt: z.date().nullable(),
})

export const ListIntegrationsResponseSchema = z.object({
  data: z.array(IntegrationSummarySchema),
})

export const IntegrationDisconnectResponseSchema = z.object({
  provider: IntegrationProviderSchema,
  status: z.literal('DISCONNECTED'),
})
