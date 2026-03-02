import type { UploadCategory } from '../generated/prisma/enums.ts'

export interface UploadRequest {
  category: UploadCategory
  contextId: number
  fileName: string
  contentType: string
  fileSize: number
}

export interface UploadResponse {
  uploadId?: number | null
  fileKey: string
  presignedUrl: string
  expiresIn: number
}

export interface UploadCompleteRequest {
  category: UploadCategory
  contextId: number
  fileKey: string
}

export type UploadCompleteRequestDTO = {
  fileKey: string
  uploadId: number
  category: UploadCategory
  contextId: number
}

export interface IStorage {
  generateSignedUploadUrl(input: UploadRequest): Promise<StorageUploadResult>
  generateSignedDownloadUrl(fileKey: string, expiresIn?: number): Promise<StorageUploadResult>
  verifyFileExists(fileKey: string): Promise<boolean>
}

export interface StorageUploadResult {
  fileKey: string
  presignedUrl: string
  publicUrl?: string | undefined
  expiresIn: number
}

export enum AvatarContentType {
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  WEBP = 'image/webp',
  GIF = 'image/gif',
}

export enum DocumentContentType {
  PDF = 'application/pdf',
  DOC = 'application/msword',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLS = 'application/vnd.ms-excel',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  TXT = 'text/plain',
  CSV = 'text/csv',
}
