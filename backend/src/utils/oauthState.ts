import { ApiError } from './apiError.ts'
import type { OAuthState } from '../types/integration.types.ts'

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
