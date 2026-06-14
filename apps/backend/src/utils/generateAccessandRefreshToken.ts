import jwt from 'jsonwebtoken'
import { ApiError } from './apiError.js'
import { env } from '../config/env.js'
import { type CookieOptions } from 'express'

const isProduction = process.env.NODE_ENV === 'production'

export const accessTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 30 * 60 * 1000,
}
export const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
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
