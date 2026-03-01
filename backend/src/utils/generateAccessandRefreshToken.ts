import jwt from 'jsonwebtoken'
import { ApiError } from './apiError.ts'
import { env } from '../config/env.ts'
import { type CookieOptions } from 'express'

export const accessTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 30 * 60 * 1000,
}

export const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

export const generateAccessAndRefreshTokens = async (userId: number) => {
  try {
    const accessToken = jwt.sign({ id: userId }, env.ACCESS_TOKEN_SECRET, {
      expiresIn: '30m',
    })

    const refreshToken = jwt.sign({ id: userId }, env.REFRESH_TOKEN_SECRET, {
      expiresIn: '7d',
    })

    return { accessToken, refreshToken }
  } catch (error) {
    throw new ApiError(500, `Something went wrong while generating tokens: ${error}`)
  }
}
