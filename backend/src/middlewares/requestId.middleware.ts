import type { Request, Response, NextFunction } from 'express'
import { v4 as uuid } from 'uuid'

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = uuid()

  req.id = requestId
  res.setHeader('X-Request-Id', requestId)

  next()
}
