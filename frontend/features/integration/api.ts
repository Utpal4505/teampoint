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
  workspaceId: number,
): Promise<IntegrationConnectResponse> => {
  const res = await api.post<{ data: IntegrationConnectResponse }>(
    `/integrations/${provider}/connect`,
    { workspaceId },
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
  const res = await api.delete<{ data: IntegrationDisconnectResponse }>(
    `/integrations/${provider}`,
  )
  return res.data.data
}
