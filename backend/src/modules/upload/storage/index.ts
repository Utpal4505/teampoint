import { env } from '../../../config/env.ts'
import type { IStorage } from '../../../types/upload.types.ts'
import { R2Storage } from './r2.storage.ts'

let storage: IStorage

switch (env.STORAGE_PROVIDER) {
  case 'R2':
    storage = new R2Storage()
    break
  default:
    throw new Error(`Unsupported STORAGE_PROVIDER: ${env.STORAGE_PROVIDER}`)
}

export default storage
