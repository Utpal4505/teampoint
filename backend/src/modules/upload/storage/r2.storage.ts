import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'crypto'
import { env } from '../../../config/env.ts'
import type { StorageUploadResult, UploadRequest } from '../../../types/upload.types.ts'

const r2 = new S3Client({
  region: 'auto',
  endpoint: env.R2_ENDPOINT,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
})

export class R2Storage {
  private defaultBucket = env.R2_BUCKET_NAME
  private avatarBucket = env.R2_AVATAR_BUCKET_NAME

  private resolveBucket(fileKey: string): string {
    if (fileKey.startsWith('AVATAR/')) {
      return this.avatarBucket
    }
    return this.defaultBucket
  }

  private generateFileKey(category: string, contextId: number, fileName: string) {
    const timestamp = Date.now()
    const randomHash = crypto.randomBytes(6).toString('hex')
    return `${category}/${contextId}/${timestamp}-${randomHash}-${fileName}`
  }

  async generateSignedUploadUrl(input: UploadRequest): Promise<StorageUploadResult> {
    const { category, contentType, contextId, fileName } = input

    const fileKey = this.generateFileKey(category, contextId, fileName)

    const expiresIn = 1800

    const bucket = category === 'AVATAR' ? this.avatarBucket : this.defaultBucket

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: fileKey,
      ContentType: contentType,
    })

    const presignedUrl = await getSignedUrl(r2, command, { expiresIn })

    return {
      fileKey,
      presignedUrl,
      expiresIn,
      publicUrl:
        category === 'AVATAR'
          ? `${env.R2_AVATARS_PUBLIC_BASE_URL}/${fileKey}`
          : undefined,
    }
  }

  async generateSignedDownloadUrl(
    fileKey: string,
    expiresIn = 1800,
  ): Promise<StorageUploadResult> {
    const bucket = this.resolveBucket(fileKey)

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: fileKey,
    })

    const presignedUrl = await getSignedUrl(r2, command, { expiresIn })

    return { fileKey, presignedUrl, expiresIn }
  }

  async verifyFileExists(fileKey: string): Promise<boolean> {
    try {
      const bucket = this.resolveBucket(fileKey)
      const command = new HeadObjectCommand({
        Bucket: bucket,
        Key: fileKey,
      })
      await r2.send(command)
      return true
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'NotFound') {
        return false
      }
      throw err
    }
  }
}
