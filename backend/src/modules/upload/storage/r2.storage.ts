import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'crypto'
import { env } from '../../../config/env.ts'
import type { UploadRequest, UploadResponse } from '../../../types/upload.types.ts'

const r2 = new S3Client({
  region: 'auto',
  endpoint: env.R2_ENDPOINT,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
})

export class R2Storage {
  private bucketName = env.R2_BUCKET_NAME

  private generateFileKey(category: string, contextId: number, fileName: string) {
    const timestamp = Date.now()
    const randomHash = crypto.randomBytes(6).toString('hex')
    return `${category}/${contextId}/${timestamp}-${randomHash}-${fileName}`
  }

  async generateSignedUploadUrl(input: UploadRequest): Promise<UploadResponse> {
    const { category, contentType, contextId, fileName } = input

    const fileKey = this.generateFileKey(category, contextId, fileName)

    const expiresIn = 1800

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      ContentType: contentType,
    })

    const signedUrl = await getSignedUrl(r2, command, { expiresIn })

    return {
      fileKey,
      signedUrl,
      expiresIn,
    }
  }

  async generateSignedDownloadUrl(
    fileKey: string,
    expiresIn = 1800,
  ): Promise<UploadResponse> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    })

    const signedUrl = await getSignedUrl(r2, command, { expiresIn })

    return { fileKey, signedUrl, expiresIn }
  }

  async generateAvatarUploadUrl(input: UploadRequest): Promise<{
    fileKey: string
    signedUrl: string
    publicUrl: string
    expiresIn: number
  }> {
    const { category, contentType, contextId, fileName } = input

    const fileKey = this.generateFileKey(category, contextId, fileName)

    const expiresIn = 1800

    const command = new PutObjectCommand({
      Bucket: env.R2_AVATAR_BUCKET_NAME,
      Key: fileKey,
      ContentType: contentType,
    })

    const signedUrl = await getSignedUrl(r2, command, { expiresIn })

    const publicUrl = `${env.R2_AVATARS_PUBLIC_BASE_URL}/${fileKey}`

    return {
      fileKey,
      signedUrl,
      publicUrl,
      expiresIn,
    }
  }
}
