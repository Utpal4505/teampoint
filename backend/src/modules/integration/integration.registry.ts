import type {
  IntegrationProviderAdapter,
  IntegrationProvider,
} from '../../types/integration.types.js'
import { GoogleProvider } from './providers/google.provider.js'

const providerRegistry: Record<IntegrationProvider, IntegrationProviderAdapter> = {
  GOOGLE: new GoogleProvider(),
}

export function getProvider(provider: IntegrationProvider): IntegrationProviderAdapter {
  const adapter = providerRegistry[provider]

  if (!adapter) {
    throw new Error(`Provider "${provider}" is not registered`)
  }

  return adapter
}
