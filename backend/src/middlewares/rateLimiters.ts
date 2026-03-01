import rateLimit from 'express-rate-limit'
import { env } from '../config/env.ts'
import type { RequestHandler } from 'express'

const skipLimiter: RequestHandler = (_req, _res, next) => next()

const createLimiter = (options: Parameters<typeof rateLimit>[0]) => {
  if (!env.ENABLE_RATE_LIMIT || process.env.NODE_ENV === 'test') {
    return skipLimiter
  }

  return rateLimit(options)
}

export const globalLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: env.GLOBAL_RATE_LIMIT,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

export const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: env.AUTH_RATE_LIMIT,
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
})

export const loginLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: env.AUTH_RATE_LIMIT,
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

export const uploadLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  max: env.UPLOAD_RATE_LIMIT,
  message: 'Too many uploads, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

export const apiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: env.API_RATE_LIMIT,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: req => {
    if (req.user?.id !== undefined) {
      return String(req.user.id)
    }

    return req.ip ?? '0.0.0.0'
  },
})

export const integrationLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: env.INTEGRATION_RATE_LIMIT,
  message: 'Too many integration requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

export const refreshTokenLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: env.REFRESH_TOKEN_RATE_LIMIT ?? 10,
  message: 'Too many token refresh attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})
