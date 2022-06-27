import { authAxios, discordAxios } from './config'
import { discordEmbed } from './constant'

const CHANNEL_ID = process.env.CHANNEL_ID || ''
const DISCORD_ROLE_ID = process.env.DISCORD_ROLE_ID || ''

export const postReply = async (topic_id: number, raw: string) =>
  await authAxios?.post('/posts.json', {
    topic_id,
    raw,
  })

export const editReply = async (post_id: number, raw: string) =>
  await authAxios?.put(`/posts/${post_id}.json`, {
    edit_reason: 'Impact tag changed',
    raw,
  })

export const postDiscordMessage = async (
  title: string,
  impact: string,
  id: number
) => {
  await discordAxios?.post(`/channels/${CHANNEL_ID}/messages`, {
    content: `<@&${DISCORD_ROLE_ID}>`,
    embeds: [discordEmbed(title, impact, id)],
  })
}
