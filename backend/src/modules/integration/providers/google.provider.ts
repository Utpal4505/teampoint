import { OAuth2Client } from 'google-auth-library'
import { BaseProvider } from './base.provider.ts'
import type {
  OAuthState,
  ProviderTokens,
  BaseProviderProfile,
  RefreshedTokens,
} from '../../../types/integration.types.ts'
import { env } from '../../../config/env.ts'

export class GoogleProvider extends BaseProvider {
  readonly provider = 'GOOGLE' as const

  private readonly client: OAuth2Client

  private readonly scopes = [
    'openid',
    'email',
    'profile',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/meetings.space.created',
  ]

  constructor() {
    super()
    this.client = new OAuth2Client(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      env.GOOGLE_INTEGRATION_CALLBACK_URL,
    )
  }

  generateAuthUrl(state: OAuthState): string {
    const encodedState = this.encodeState({
      ...state,
      nonce: this.generateNonce(),
    })

    return this.client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: this.scopes,
      state: encodedState,
    })
  }

  async exchangeCodeForToken(code: string): Promise<ProviderTokens> {
    const { tokens } = await this.client.getToken(code)

    if (!tokens.access_token) {
      throw new Error('Google did not return an access token')
    }

    if (!tokens.refresh_token) {
      throw new Error('Google did not return a refresh token')
    }

    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      idToken: tokens.id_token ?? null,
      expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : this.defaultExpiry(),
      scopes: tokens.scope ? tokens.scope.split(' ') : this.scopes,
      tokenType: tokens.token_type ?? null,
    }
  }

  async fetchProfile(accessToken: string): Promise<BaseProviderProfile> {
    const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch Google profile: ${res.status} ${res.statusText}`)
    }

    const data = (await res.json()) as {
      id: string
      email?: string
      name?: string
    }

    return {
      providerUserId: data.id,
      email: data.email ?? null,
      name: data.name ?? null,
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<RefreshedTokens> {
    this.client.setCredentials({ refresh_token: refreshToken })

    const { credentials } = await this.client.refreshAccessToken()

    if (!credentials.access_token) {
      throw new Error('Google did not return a new access token during refresh')
    }

    return {
      accessToken: credentials.access_token,
      expiresAt: credentials.expiry_date
        ? new Date(credentials.expiry_date)
        : this.defaultExpiry(),
    }
  }

  private defaultExpiry(): Date {
    const date = new Date()
    date.setHours(date.getHours() + 1)
    return date
  }
}
