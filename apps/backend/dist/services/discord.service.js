import { EmbedBuilder, WebhookClient } from 'discord.js';
import { DISCORD_ALERT_COLORS, DISCORD_WEBHOOKS, } from '../config/discord.config.js';
const webhookClients = {
    alerts: new WebhookClient({ url: DISCORD_WEBHOOKS.alerts }),
};
const getMention = (color) => {
    if (color === 'CRITICAL' || color === 'HIGH')
        return '@everyone';
    return null;
};
export const sendDiscordAlert = async (options) => {
    const client = webhookClients[options.webhookKey];
    const color = DISCORD_ALERT_COLORS[options.color];
    const mention = getMention(options.color);
    const embed = new EmbedBuilder()
        .setTitle(options.title)
        .setColor(color)
        .setTimestamp()
        .setFooter({ text: options.footer ?? '🤖 TeamPoint Bug System' });
    if (options.description)
        embed.setDescription(options.description);
    if (options.fields?.length)
        embed.addFields(options.fields);
    if (options.thumbnail)
        embed.setThumbnail(options.thumbnail);
    await client.send({
        ...(mention && { content: mention }),
        embeds: [embed],
    });
};
//# sourceMappingURL=discord.service.js.map