import api from '@/lib/api'
import type {
  ListIntegrationsResponse,
  IntegrationProvider,
  IntegrationStatusResponse,
  IntegrationConnectResponse,
  IntegrationDisconnectResponse,
} from './types'

export const listIntegrations = async (): Promise<ListIntegrationsResponse> => {
  const res = await api.get<{ data: ListIntegrationsResponse }>('/integrations')
  return res.data.data
}

export const initiateIntegration = async (
  provider: IntegrationProvider,
): Promise<IntegrationConnectResponse> => {
  const res = await api.post<{ data: IntegrationConnectResponse }>(
    `/integrations/${provider}/connect`,
  )
  return res.data.data
}

export const getIntegrationStatus = async (
  provider: IntegrationProvider,
): Promise<IntegrationStatusResponse> => {
  const res = await api.get<{ data: IntegrationStatusResponse }>(
    `/integrations/${provider}/status`,
  )
  return res.data.data
}

export const disconnectIntegration = async (
  provider: IntegrationProvider,
): Promise<IntegrationDisconnectResponse> => {
  const res = await api.post<{ data: IntegrationDisconnectResponse }>(
    `/integrations/${provider}/disconnect`,
  )
  return res.data.data
}
