import type { RequestUser } from "./types.js"

declare global {
  namespace Express {
    interface Request {
      id?: string
    }

    interface User extends RequestUser {}
  }
}

export {}
