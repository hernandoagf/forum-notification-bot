import { authAxios, discordAxios } from './config'
import { discordEmbed } from './constant'

const CHANNEL_ID = process.env.CHANNEL_ID || ''
const DISCORD_ROLE_ID = process.env.DISCORD_ROLE_ID || ''

export const postReply = async (
  topic_id: number,
  raw: string
): Promise<void> => {
  await authAxios?.post('/posts.json', {
    topic_id,
    raw,
  })
}

export const editReply = async (
  post_id: number,
  raw: string
): Promise<void> => {
  await authAxios?.put(`/posts/${post_id}.json`, {
    edit_reason: 'Impact tag changed',
    raw,
  })
}

export const postDiscordMessage = async (
  title: string,
  impact: string,
  id: number,
  upgraded: boolean = false
): Promise<void> => {
  await discordAxios?.post(`/channels/${CHANNEL_ID}/messages`, {
    content: `<@&${DISCORD_ROLE_ID}>`,
    embeds: [discordEmbed(title, impact, id, upgraded)],
  })
}

export const findDiscordMessage = async (
  topicId: string
): Promise<string | undefined> => {
  const discordRes = await discordAxios?.get(`/channels/${CHANNEL_ID}/messages`)
  const discordData = discordRes?.data

  console.log(discordData)

  const foundMessage = discordData.find(
    (message: any) => message.embeds[0].url.split('/').at(-1) === topicId
  )

  if (!foundMessage) return

  return foundMessage.id
}

export const editDiscordMessage = async (
  messageId: string,
  title: string,
  impact: string,
  id: number
): Promise<void> => {
  await discordAxios?.patch(`/channels/${CHANNEL_ID}/messages/${messageId}`, {
    content: `<@&${DISCORD_ROLE_ID}>`,
    embeds: [discordEmbed(title, impact, id, false)],
  })
}
