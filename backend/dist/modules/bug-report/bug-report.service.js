import { prisma } from '../../config/db.config.js';
import { trackPosthogEvent } from '../../utils/posthog.js';
import { eventBus } from '../../utils/eventBus.js';
import { ApiError } from '../../utils/apiError.js';
import crypto from 'crypto';
function generateFingerprint({ consoleLog, page, apiRoute, title, }) {
    const cleanedLogs = consoleLog
        .map(log => log.replace(/\[\d{4}-\d{2}-\d{2}T[\d:.]+Z\]\s*/g, '').trim())
        .filter(Boolean)
        .sort();
    const combinedString = [
        title.toLowerCase().trim(),
        ...cleanedLogs,
        page ? new URL(page).pathname : '',
        apiRoute?.toLowerCase() ?? '',
    ].join('\n');
    return crypto.createHash('sha256').update(combinedString).digest('hex');
}
async function normalizeBugAttachments(attachments, userId, projectId) {
    if (!attachments?.length)
        return null;
    if (!userId) {
        throw new ApiError(401, 'Please login before uploading bug images');
    }
    const uploadIds = attachments.map(attachment => attachment.uploadId);
    const uploads = await prisma.upload.findMany({
        where: {
            id: { in: uploadIds },
            uploadedBy: userId,
            category: 'BUG_ATTACHMENT',
            status: 'UPLOADED',
        },
    });
    if (uploads.length !== uploadIds.length) {
        throw new ApiError(400, 'One or more bug images were not uploaded correctly');
    }
    const expectedContextId = projectId ?? userId;
    const uploadById = new Map(uploads.map(upload => [upload.id, upload]));
    return attachments.map(attachment => {
        const upload = uploadById.get(attachment.uploadId);
        if (!upload) {
            throw new ApiError(400, 'Invalid bug image attachment');
        }
        if (upload.contextId !== expectedContextId) {
            throw new ApiError(400, 'Bug image context does not match this report');
        }
        if (upload.fileKey !== attachment.fileKey ||
            upload.fileName !== attachment.fileName ||
            upload.contentType !== attachment.contentType ||
            upload.size !== attachment.size) {
            throw new ApiError(400, 'Bug image metadata does not match the upload');
        }
        return {
            uploadId: upload.id,
            fileKey: upload.fileKey,
            fileName: upload.fileName,
            contentType: upload.contentType,
            size: upload.size,
        };
    });
}
export const createBugReportService = async (data, userId) => {
    const consoleLogsArray = Array.isArray(data.consoleLog)
        ? data.consoleLog
        : data.consoleLog
            ? [data.consoleLog]
            : [];
    const fingerprint = generateFingerprint({
        consoleLog: consoleLogsArray,
        page: data.page ?? null,
        apiRoute: data.apiRoute ?? null,
        title: data.title,
    });
    const existingBug = await prisma.bugReport.findFirst({
        where: {
            fingerprint,
        },
    });
    if (existingBug) {
        const updatedBug = await prisma.bugReport.update({
            where: {
                id: existingBug.id,
            },
            data: {
                reportCount: {
                    increment: 1,
                },
                status: 'DUPLICATE',
            },
        });
        setImmediate(() => {
            eventBus.emit('BUG_REPORT_DUPLICATE', updatedBug.id, userId);
        });
        return updatedBug;
    }
    const attachments = await normalizeBugAttachments(data.attachments, userId, data.projectId);
    const newBug = await prisma.bugReport.create({
        data: {
            reportedBy: userId ?? null,
            projectId: data.projectId ?? null,
            page: data.page ?? null,
            description: data.description ?? null,
            consoleLog: data.consoleLog ?? null,
            apiRoute: data.apiRoute ?? null,
            ...(attachments ? { attachments } : {}),
            metadata: data.metadata ?? null,
            fingerprint: fingerprint,
            severityLevel: data.severityLevel ?? 'LOW',
            status: 'PENDING',
            processStartTime: new Date(),
            title: data.title,
            stepToReproduce: data.stepsToReproduce ?? null,
        },
    });
    if (userId) {
        trackPosthogEvent(userId, 'bug_reported', {
            bug_id: newBug.id,
            severity: newBug.severityLevel,
            project_id: newBug.projectId ?? undefined,
        });
    }
    setImmediate(() => {
        eventBus.emit('BUG_REPORT_CREATED', newBug.id, newBug.reportedBy);
    });
    return newBug;
};
//# sourceMappingURL=bug-report.service.js.map