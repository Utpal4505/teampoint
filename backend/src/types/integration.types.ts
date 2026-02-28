import type { z } from 'zod'
import type {
  IntegrationProviderSchema,
  IntegrationStatusSchema,
  OAuthCallbackQuerySchema,
  OAuthCallbackResponseSchema,
  IntegrationConnectResponseSchema,
  IntegrationStatusResponseSchema,
  IntegrationSummarySchema,
  ListIntegrationsResponseSchema,
  IntegrationDisconnectResponseSchema,
  ProviderParamSchema,
} from '../modules/integration/integration.schema.ts'

export type IntegrationProvider = z.infer<typeof IntegrationProviderSchema>
export type IntegrationStatus = z.infer<typeof IntegrationStatusSchema>

export type ProviderParam = z.infer<typeof ProviderParamSchema>
export type OAuthCallbackQuery = z.infer<typeof OAuthCallbackQuerySchema>

export type IntegrationConnectResponse = z.infer<typeof IntegrationConnectResponseSchema>
export type OAuthCallbackResponse = z.infer<typeof OAuthCallbackResponseSchema>
export type IntegrationStatusResponse = z.infer<typeof IntegrationStatusResponseSchema>
export type IntegrationSummary = z.infer<typeof IntegrationSummarySchema>
export type ListIntegrationsResponse = z.infer<typeof ListIntegrationsResponseSchema>
export type IntegrationDisconnectResponse = z.infer<
  typeof IntegrationDisconnectResponseSchema
>

export interface OAuthState {
  userId: number
  provider: IntegrationProvider
  nonce: string
}

export interface ProviderTokens {
  accessToken: string
  refreshToken: string
  idToken: string | null
  expiresAt: Date
  scopes: string[]
  tokenType: string | null
}

export interface RefreshedTokens {
  accessToken: string
  expiresAt: Date
}

export interface ValidAccessToken {
  accessToken: string
  expiresAt: Date
  tokenType: string | null
}

export interface BaseProviderProfile {
  providerUserId: string
  email: string | null
  name: string | null
}

export interface SaveIntegrationInput {
  userId: number
  provider: IntegrationProvider
  providerUserId: string
  scopes: string[]
  accessToken: string
  refreshToken: string
  idToken: string | null
  expiresAt: Date
  tokenType: string | null
}

export interface IntegrationProviderAdapter {
  readonly provider: IntegrationProvider

  generateAuthUrl(state: OAuthState): string
  exchangeCodeForToken(code: string): Promise<ProviderTokens>
  fetchProfile(accessToken: string): Promise<BaseProviderProfile>
  refreshAccessToken(refreshToken: string): Promise<RefreshedTokens>
  revokeTokens?(accessToken: string): Promise<void> 
}
