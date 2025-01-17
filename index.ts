import express from 'express'
import { config } from 'dotenv'
import { HmacSHA256 } from 'crypto-js'

import {
  HIGH_IMPACT,
  regularReplyText,
  increasedImpactReplyText,
} from './constant'
import {
  postReply,
  editReply,
  postDiscordMessage,
  findDiscordMessage,
  editDiscordMessage,
} from './helpers'
import { authAxios, unAuthAxios } from './config'

config()

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || ''
const DISCOURSE_API_USERNAME = process.env.DISCOURSE_API_USERNAME || ''

const app = express()
app.use(express.json())
const port = process.env.PORT || 5000

app.post('/', async (req, res) => {
  const body = req.body
  if (body.ping) {
    res.status(200).json({ msg: 'Breaking first' }).end()
    return
  }
  const headers = req.headers
  const headerHash = headers['x-discourse-event-signature']
  const eventType = headers['x-discourse-event']
  const impactType = body.topic?.tags.includes(HIGH_IMPACT) ? 'High' : 'Medium'

  const hmac = HmacSHA256(JSON.stringify(body), WEBHOOK_SECRET)
  const hash = `sha256=${hmac}`

  // Perform security verifications
  if (!headerHash) res.status(400).end()
  else if (hash !== headerHash) res.status(403).end()
  else if (!authAxios) res.status(200).json({ msg: 'Breaking second' }).end()
  // Check if webhook is of interest
  else if (eventType === 'topic_created') {
    await postReply(body.topic.id, regularReplyText(impactType))
    await postDiscordMessage(body.topic.title, impactType, body.topic.id)
  } else if (eventType === 'topic_edited') {
    const topicRes = await unAuthAxios.get(`/t/${body.topic.id}.json`)
    const topicData = topicRes.data
    const latestsBotReply = topicData.post_stream.posts
      .reverse()
      .find((post: any) => post.username === DISCOURSE_API_USERNAME)

    if (!latestsBotReply) {
      await postReply(body.topic.id, regularReplyText(impactType))
      await postDiscordMessage(body.topic.title, impactType, body.topic.id)
    } else {
      const replyImpactType = latestsBotReply.cooked.includes('High Impact tag')
        ? 'High'
        : 'Medium'

      if (impactType !== replyImpactType) {
        if (impactType === 'Medium') {
          await editReply(latestsBotReply.id, regularReplyText(impactType))
          const discordMessageId = await findDiscordMessage(body.topic.id)
          if (discordMessageId)
            await editDiscordMessage(
              discordMessageId,
              body.topic.title,
              impactType,
              body.topic.id
            )
        } else {
          const timeDiff =
            Date.now() - new Date(latestsBotReply.updated_at).getTime()

          if (timeDiff < 1000 * 60 * 60) {
            await editReply(latestsBotReply.id, regularReplyText(impactType))
            const discordMessageId = await findDiscordMessage(body.topic.id)
            if (discordMessageId)
              await editDiscordMessage(
                discordMessageId,
                body.topic.title,
                impactType,
                body.topic.id
              )
          } else {
            await postReply(body.topic.id, increasedImpactReplyText)
            await postDiscordMessage(
              body.topic.title,
              impactType,
              body.topic.id,
              true
            )
          }
        }
      }
    }
  }

  res.status(200).json({ msg: 'Breaking third' }).end()
})

app.listen(port, () =>
  console.log(`⚡️[server]: Server is running on port ${port}...`)
)

module.exports = app
