import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand, } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import { env } from '../../../config/env.js';
const r2 = new S3Client({
    region: 'auto',
    endpoint: env.R2_ENDPOINT,
    credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
});
export class R2Storage {
    defaultBucket = env.R2_BUCKET_NAME;
    avatarBucket = env.R2_AVATAR_BUCKET_NAME;
    resolveBucket(fileKey) {
        if (fileKey.startsWith('AVATAR/')) {
            return this.avatarBucket;
        }
        return this.defaultBucket;
    }
    generateFileKey(category, contextId, fileName) {
        const timestamp = Date.now();
        const randomHash = crypto.randomBytes(6).toString('hex');
        return `${category}/${contextId}/${timestamp}-${randomHash}-${fileName}`;
    }
    async generateSignedUploadUrl(input) {
        const { category, contextId, fileName } = input;
        const fileKey = this.generateFileKey(category, contextId, fileName);
        const expiresIn = 1800;
        const bucket = category === 'AVATAR' ? this.avatarBucket : this.defaultBucket;
        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: fileKey,
        });
        const presignedUrl = await getSignedUrl(r2, command, { expiresIn });
        return {
            fileKey,
            presignedUrl,
            expiresIn,
            publicUrl: category === 'AVATAR'
                ? `${env.R2_AVATARS_PUBLIC_BASE_URL}/${fileKey}`
                : undefined,
        };
    }
    async generateSignedDownloadUrl(fileKey, expiresIn = 1800) {
        const bucket = this.resolveBucket(fileKey);
        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: fileKey,
        });
        const presignedUrl = await getSignedUrl(r2, command, { expiresIn });
        return { fileKey, presignedUrl, expiresIn };
    }
    async verifyFileExists(fileKey) {
        try {
            const bucket = this.resolveBucket(fileKey);
            const command = new HeadObjectCommand({
                Bucket: bucket,
                Key: fileKey,
            });
            await r2.send(command);
            return true;
        }
        catch (err) {
            if (err instanceof Error && err.name === 'NotFound') {
                return false;
            }
            throw err;
        }
    }
    async directUploadToR2(input, fileBuffer) {
        const { category, contextId, fileName, contentType } = input;
        const fileKey = this.generateFileKey(category, contextId, fileName);
        const bucket = category === 'AVATAR' ? this.avatarBucket : this.defaultBucket;
        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: fileKey,
            Body: fileBuffer,
            ContentType: contentType,
        });
        await r2.send(command);
        return {
            fileKey,
            presignedUrl: '',
            expiresIn: 0,
            publicUrl: category === 'AVATAR'
                ? `${env.R2_AVATARS_PUBLIC_BASE_URL}/${fileKey}`
                : undefined,
        };
    }
}
//# sourceMappingURL=r2.storage.js.map