import crypto from 'crypto'
import { encodeState } from '../../../utils/oauthState.ts'
import type {
  IntegrationProviderAdapter,
  IntegrationProvider,
  OAuthState,
} from '../../../types/integration.types.ts'

export abstract class BaseProvider implements IntegrationProviderAdapter {
  abstract readonly provider: IntegrationProvider

  protected generateNonce(): string {
    return crypto.randomBytes(16).toString('hex')
  }

  protected encodeState(state: OAuthState): string {
    return encodeState(state)
  }

  abstract generateAuthUrl(state: OAuthState): string
  abstract exchangeCodeForToken(
    code: string,
  ): Promise<import('../../../types/integration.types.ts').ProviderTokens>
  abstract fetchProfile(
    accessToken: string,
  ): Promise<import('../../../types/integration.types.ts').BaseProviderProfile>
  abstract refreshAccessToken(
    refreshToken: string,
  ): Promise<import('../../../types/integration.types.ts').RefreshedTokens>
}
