import { z } from 'zod';
import { sanitizeText } from '../../utils/sanitize.js';
import { AvatarContentType, BugAttachmentContentType, DocumentContentType, } from '../../types/upload.types.js';
const allowedExtensionMap = {
    AVATAR: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    DOCUMENT: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'csv'],
    BUG_ATTACHMENT: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
};
const allowedMimeMap = {
    AVATAR: new Set(Object.values(AvatarContentType)),
    DOCUMENT: new Set(Object.values(DocumentContentType)),
    BUG_ATTACHMENT: new Set(Object.values(BugAttachmentContentType)),
};
export const normalizeUploadFileName = (fileName) => {
    const rawInput = sanitizeText(fileName).trim();
    if (!rawInput ||
        rawInput.length < 2 ||
        rawInput.length > 100 ||
        rawInput.includes('..') ||
        rawInput.includes('/') ||
        rawInput.includes('\\') ||
        rawInput.startsWith('.')) {
        throw new Error('Unsafe file name');
    }
    const safeName = rawInput.replace(/[<>:"|?*\u0000-\u001F]+/g, '-');
    const finalName = safeName.replace(/\.+$/, '').replace(/\.{2,}/g, '.');
    if (!finalName || finalName.includes('..') || finalName.startsWith('.')) {
        throw new Error('Unsafe file name');
    }
    return finalName;
};
export const validateUploadType = (category, fileName, contentType) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension || !allowedExtensionMap[category].includes(extension)) {
        throw new Error(`Invalid file extension for ${category}. Allowed extensions: ${allowedExtensionMap[category].join(', ')}`);
    }
    if (!allowedMimeMap[category].has(contentType)) {
        throw new Error(`Unsupported content type for ${category}: ${contentType}`);
    }
};
export const UploadRequestSchema = z
    .object({
    category: z.enum(['AVATAR', 'DOCUMENT', 'BUG_ATTACHMENT']),
    contextId: z.number().int().positive().transform(Number),
    fileName: z
        .string()
        .trim()
        .min(2, 'FileName name must be at least 2 characters long')
        .max(100, 'FileName name must be less than 100 characters long'),
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
})
    .superRefine((value, ctx) => {
    try {
        const safeFileName = normalizeUploadFileName(value.fileName);
        validateUploadType(value.category, safeFileName, value.contentType);
        value.fileName = safeFileName;
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Invalid upload data';
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['fileName'],
            message,
        });
    }
})
    .transform(data => ({
    ...data,
    fileName: normalizeUploadFileName(data.fileName),
}));
export const AvatarCompleteSchema = z.object({
    uploadId: z.number().int().positive({
        message: 'uploadId must be a positive integer',
    }),
});
//# sourceMappingURL=upload.schema.js.map