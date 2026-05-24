import { GoogleProvider } from './providers/google.provider.js';
import { prisma } from '../../config/db.config.js';
import { ApiError } from '../../utils/apiError.js';
import { decodeState } from '../../utils/oauthState.js';
const providers = {
    GOOGLE: new GoogleProvider(),
};
const getProvider = (provider) => {
    return providers[provider];
};
export const listIntegrationsService = async (userId) => {
    const integrations = await prisma.integration.findMany({
        where: {
            userId,
            status: { not: 'DISCONNECTED' },
        },
        select: {
            provider: true,
            status: true,
            connectedAt: true,
        },
        orderBy: { connectedAt: 'desc' },
    });
    const data = integrations.map(i => ({
        provider: i.provider,
        status: i.status,
        connectedAt: i.connectedAt,
    }));
    return { data };
};
export const initiateIntegrationService = async (userId, provider, workspaceId) => {
    const existing = await prisma.integration.findUnique({
        where: { userId_provider: { userId, provider } },
    });
    if (existing?.status === 'CONNECTED') {
        throw new ApiError(409, `${provider} integration is already connected`);
    }
    const membership = await prisma.workspace_Members.findUnique({
        where: { workspaceId_userId: { workspaceId, userId } },
    });
    if (!membership || membership.status !== 'ACTIVE') {
        throw new ApiError(403, 'User is not an active member of this workspace');
    }
    const adapter = getProvider(provider);
    const state = {
        userId,
        workspaceId,
        provider,
        nonce: '',
    };
    const authorizationUrl = adapter.generateAuthUrl(state);
    return { authorizationUrl };
};
export const handleCallbackService = async (code, rawState) => {
    const state = decodeState(rawState);
    const { userId, workspaceId, provider } = state;
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
    });
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    const adapter = getProvider(provider);
    const tokens = await adapter.exchangeCodeForToken(code).catch(() => {
        throw new ApiError(400, 'Failed to exchange authorization code — it may have expired');
    });
    const profile = await adapter.fetchProfile(tokens.accessToken).catch(() => {
        throw new ApiError(502, 'Failed to fetch profile from provider');
    });
    const input = {
        userId,
        provider,
        providerUserId: profile.providerUserId,
        scopes: tokens.scopes,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        idToken: tokens.idToken,
        expiresAt: tokens.expiresAt,
        tokenType: tokens.tokenType,
    };
    await saveIntegration(input);
    return {
        provider,
        status: 'CONNECTED',
        workspaceId,
    };
};
export const getIntegrationStatusService = async (userId, provider) => {
    const integration = await prisma.integration.findUnique({
        where: { userId_provider: { userId, provider } },
        include: { token: true },
    });
    if (!integration || integration.status === 'DISCONNECTED') {
        return {
            provider,
            status: 'DISCONNECTED',
            scopes: [],
            connectedAt: null,
        };
    }
    if (integration.token && integration.token.expiresAt < new Date()) {
        await prisma.integration.update({
            where: { id: integration.id },
            data: { status: 'EXPIRED' },
        });
        return {
            provider,
            status: 'EXPIRED',
            scopes: integration.scopes,
            connectedAt: integration.connectedAt,
        };
    }
    return {
        provider,
        status: integration.status,
        scopes: integration.scopes,
        connectedAt: integration.connectedAt,
    };
};
export const disconnectIntegrationService = async (userId, provider) => {
    const integration = await prisma.integration.findUnique({
        where: { userId_provider: { userId, provider } },
        include: { token: true },
    });
    if (!integration || integration.status === 'DISCONNECTED') {
        throw new ApiError(404, `No active ${provider} integration found`);
    }
    const adapter = getProvider(provider);
    try {
        if (integration.token) {
            await adapter.revokeTokens?.(integration.token.accessToken);
        }
    }
    catch {
    }
    await prisma.$transaction(async (tx) => {
        if (integration.token) {
            await tx.integrationToken.delete({
                where: { integrationId: integration.id },
            });
        }
        await tx.integration.update({
            where: { id: integration.id },
            data: { status: 'DISCONNECTED' },
        });
    });
    return { provider, status: 'DISCONNECTED' };
};
export const getValidAccessTokenService = async (userId, provider) => {
    const integration = await prisma.integration.findUnique({
        where: { userId_provider: { userId, provider } },
        include: { token: true },
    });
    if (!integration || integration.status === 'DISCONNECTED') {
        throw new ApiError(404, `No active ${provider} integration found`);
    }
    if (!integration.token) {
        throw new ApiError(404, `No token found for ${provider} — please reconnect`);
    }
    if (integration.token.expiresAt > new Date()) {
        return {
            accessToken: integration.token.accessToken,
            expiresAt: integration.token.expiresAt,
            tokenType: integration.token.tokenType,
        };
    }
    if (!integration.token.refreshToken) {
        throw new ApiError(401, `${provider} token expired and no refresh token available — please reconnect`);
    }
    const adapter = getProvider(provider);
    const refreshed = await adapter
        .refreshAccessToken(integration.token.refreshToken)
        .catch(() => {
        throw new ApiError(401, `${provider} token could not be refreshed — please reconnect`);
    });
    await prisma.$transaction(async (tx) => {
        await tx.integrationToken.update({
            where: { integrationId: integration.id },
            data: {
                accessToken: refreshed.accessToken,
                expiresAt: refreshed.expiresAt,
            },
        });
        await tx.integration.update({
            where: { id: integration.id },
            data: { status: 'CONNECTED' },
        });
    });
    return {
        accessToken: refreshed.accessToken,
        expiresAt: refreshed.expiresAt,
        tokenType: integration.token.tokenType,
    };
};
const saveIntegration = async (input) => {
    await prisma.$transaction(async (tx) => {
        const integration = await tx.integration.upsert({
            where: {
                userId_provider: {
                    userId: input.userId,
                    provider: input.provider,
                },
            },
            update: {
                providerUserId: input.providerUserId,
                scopes: input.scopes,
                status: 'CONNECTED',
                connectedAt: new Date(),
            },
            create: {
                userId: input.userId,
                provider: input.provider,
                providerUserId: input.providerUserId,
                scopes: input.scopes,
                status: 'CONNECTED',
                connectedAt: new Date(),
            },
        });
        await tx.integrationToken.upsert({
            where: { integrationId: integration.id },
            update: {
                accessToken: input.accessToken,
                refreshToken: input.refreshToken,
                idToken: input.idToken,
                expiresAt: input.expiresAt,
                tokenType: input.tokenType,
            },
            create: {
                integrationId: integration.id,
                accessToken: input.accessToken,
                refreshToken: input.refreshToken,
                idToken: input.idToken,
                expiresAt: input.expiresAt,
                tokenType: input.tokenType,
            },
        });
    });
};
//# sourceMappingURL=integration.service.js.map