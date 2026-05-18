import { ApiError } from './apiError.js'
import type { OAuthState } from '../types/integration.types.js'

export function encodeState(state: OAuthState): string {
  return Buffer.from(JSON.stringify(state)).toString('base64url')
}

export function decodeState(raw: string): OAuthState {
  try {
    const json = Buffer.from(raw, 'base64url').toString()
    return JSON.parse(json) as OAuthState
  } catch {
    throw new ApiError(400, 'Invalid OAuth state')
  }
}
