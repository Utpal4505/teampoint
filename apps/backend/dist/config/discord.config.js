import { env } from './env.js';
export const DISCORD_WEBHOOKS = {
    alerts: env.DISCORD_ALERT_WEBHOOK_URL,
};
export const DISCORD_ALERT_COLORS = {
    LOW: 0x0075ca,
    MEDIUM: 0xe4e669,
    HIGH: 0xff8c00,
    CRITICAL: 0xd73a4a,
    DUPLICATE: 0x8b5cf6,
    SUCCESS: 0x22c55e,
    FAILED: 0xef4444,
};
//# sourceMappingURL=discord.config.js.map