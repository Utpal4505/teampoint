import type { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger.ts'

export const requestLoggerMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (process.env.NODE_ENV !== 'production') {
    logger.info('Incoming request', {
      requestId: req.id,
      method: req.method,
      path: req.originalUrl,
      query: req.query,
      body: req.body,
    })
    next()
  }
}
