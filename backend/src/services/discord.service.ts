import { EmbedBuilder, WebhookClient } from 'discord.js'
import {
  DISCORD_ALERT_COLORS,
  DISCORD_WEBHOOKS,
  type DiscordAlertColor,
  type DiscordWebhookKey,
} from '../config/discord.config.ts'

const webhookClients: Record<DiscordWebhookKey, WebhookClient> = {
  alerts: new WebhookClient({ url: DISCORD_WEBHOOKS.alerts }),
}

type DiscordField = {
  name: string
  value: string
  inline?: boolean
}

type SendDiscordAlertOptions = {
  webhookKey: DiscordWebhookKey
  color: DiscordAlertColor
  title: string
  description?: string | null
  fields?: DiscordField[]
  footer?: string
  thumbnail?: string
}

const getMention = (color: DiscordAlertColor): string | null => {
  if (color === 'CRITICAL' || color === 'HIGH') return '@everyone'
  return null
}

export const sendDiscordAlert = async (
  options: SendDiscordAlertOptions,
): Promise<void> => {
  const client = webhookClients[options.webhookKey]
  const color = DISCORD_ALERT_COLORS[options.color]
  const mention = getMention(options.color)

  const embed = new EmbedBuilder()
    .setTitle(options.title)
    .setColor(color)
    .setTimestamp()
    .setFooter({ text: options.footer ?? '🤖 TeamPoint Bug System' })

  if (options.description) embed.setDescription(options.description)
  if (options.fields?.length) embed.addFields(options.fields)
  if (options.thumbnail) embed.setThumbnail(options.thumbnail)

  await client.send({
    ...(mention && { content: mention }),
    embeds: [embed],
  })
}
