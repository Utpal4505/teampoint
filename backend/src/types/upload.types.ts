import type { UploadCategory } from '../generated/prisma/enums.ts'

export interface UploadRequest {
  category: UploadCategory
  contextId: number
  fileName: string
  contentType: string
  fileSize: number
}

export interface UploadResponse {
  fileKey: string
  signedUrl: string
  expiresIn: number
}

export interface UploadCompleteRequest {
  category: UploadCategory
  contextId: number
  fileKey: string
}

export type UploadCompleteRequestDTO = {
  fileKey: string
}

export interface IStorage {
  generateSignedUploadUrl(input: UploadRequest): Promise<UploadResponse>
  generateSignedDownloadUrl(fileKey: string, expiresIn?: number): Promise<UploadResponse>
  generateAvatarUploadUrl(input: UploadRequest): Promise<{
    fileKey: string
    signedUrl: string
    publicUrl: string
    expiresIn: number
  }>
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
