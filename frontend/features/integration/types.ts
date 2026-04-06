export type IntegrationProvider = 'GOOGLE'

export type IntegrationStatus = 'CONNECTED' | 'DISCONNECTED' | 'EXPIRED' | 'ERROR'

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
