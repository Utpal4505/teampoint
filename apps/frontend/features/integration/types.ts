import type { IntegrationProvider, IntegrationStatus } from '@teampoint/shared-types'
export type { IntegrationProvider, IntegrationStatus }

export interface Integration {
  provider: IntegrationProvider
  status: IntegrationStatus
  connectedAt: Date | null
}

export interface ListIntegrationsResponse {
  data: Integration[]
}

export interface IntegrationConnectResponse {
  authorizationUrl: string
}

export interface IntegrationStatusResponse {
  provider: IntegrationProvider
  status: IntegrationStatus
  connectedAt: Date | null
}

export interface IntegrationDisconnectResponse {
  provider: IntegrationProvider
  status: string
}
