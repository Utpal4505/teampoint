import { z } from 'zod';
import { sanitizeText } from '../../utils/sanitize.js';
import { AvatarContentType, BugAttachmentContentType, DocumentContentType, } from '../../types/upload.types.js';
export const UploadRequestSchema = z.object({
    category: z.enum(['AVATAR', 'DOCUMENT', 'BUG_ATTACHMENT']),
    contextId: z.number().int().positive().transform(Number),
    fileName: z
        .string()
        .trim()
        .min(2, 'FileName name must be at least 2 characters long')
        .max(100, 'FileName name must be less than 100 characters long')
        .transform(sanitizeText),
    contentType: z.union([
        z.nativeEnum(AvatarContentType),
        z.nativeEnum(BugAttachmentContentType),
        z.nativeEnum(DocumentContentType),
    ]),
    fileSize: z
        .number()
        .int()
        .positive()
        .max(50 * 1024 * 1024, 'File size exceeds the limit of 50MB')
        .transform(Number),
});
export const AvatarCompleteSchema = z.object({
    uploadId: z.number().int().positive({
        message: 'uploadId must be a positive integer',
    }),
});
//# sourceMappingURL=upload.schema.js.map