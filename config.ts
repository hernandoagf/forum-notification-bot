import axios from 'axios'

const DISCOURSE_URL = process.env.DISCOURSE_URL || ''
const DISCOURSE_API_KEY = process.env.DISCOURSE_API_KEY || ''
const DISCOURSE_API_USERNAME = process.env.DISCOURSE_API_USERNAME || ''
const DISCORD_URL = process.env.DISCORD_URL || ''
const BOT_TOKEN = process.env.BOT_TOKEN || ''

export const authAxios =
  !DISCOURSE_URL || !DISCOURSE_API_KEY || !DISCOURSE_API_USERNAME
    ? undefined
    : axios.create({
        baseURL: DISCOURSE_URL,
        headers: {
          'Api-Key': DISCOURSE_API_KEY,
          'Api-Username': DISCOURSE_API_USERNAME,
        },
      })

export const unAuthAxios = axios.create({
  baseURL: DISCOURSE_URL,
})

export const discordAxios =
  !DISCORD_URL || !BOT_TOKEN
    ? undefined
    : axios.create({
        baseURL: DISCORD_URL,
        headers: {
          Authorization: `Bot ${BOT_TOKEN}`,
        },
      })
