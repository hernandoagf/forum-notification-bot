import express from 'express'
import { config } from 'dotenv'
import { HmacSHA256 } from 'crypto-js'
import axios from 'axios'

import { HIGH_IMPACT, MEDIUM_IMPACT } from './constant'

config()

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || ''
const DISCOURSE_URL = process.env.DISCOURSE_URL || ''
const DISCOURSE_API_KEY = process.env.DISCOURSE_API_KEY || ''
const DISCOURSE_API_USERNAME = process.env.DISCOURSE_API_USERNAME || ''

const app = express()
app.use(express.json())
const port = process.env.PORT || 5000

app.post('/', async (req, res) => {
  const body = req.body
  const headers = req.headers
  const headerHash = headers['x-discourse-event-signature']
  const eventType = headers['x-discourse-event']

  // Perform security verifications
  if (!headerHash) {
    res.status(400).end()
    return
  }

  const hmac = HmacSHA256(JSON.stringify(body), WEBHOOK_SECRET)
  const hash = `sha256=${hmac}`

  if (hash !== headerHash) {
    res.status(403).end()
    return
  }

  if (!DISCOURSE_URL || !DISCOURSE_API_KEY || !DISCOURSE_API_USERNAME) {
    res.status(200).end()
    return
  }

  // Check if webhook is of interest
  if (eventType === 'topic_created') {
    await axios.post(
      DISCOURSE_URL + '/posts.json',
      {
        topic_id: body.topic.id,
        raw: 'Attention @impact-alerts this proposal has been given an Impact tag, please consider reviewing it.',
      },
      {
        headers: {
          'Api-Key': DISCOURSE_API_KEY,
          'Api-Username': DISCOURSE_API_USERNAME,
        },
      }
    )

    // Push topic ID to DB

    res.status(200).end()
    return
  }

  if (eventType === 'topic_edited') {
    const topicRes = await axios.get(DISCOURSE_URL + `/t/${body.topic.id}.json`)
    const topicData = topicRes.data
    const firstPostId = topicData.post_stream.posts[0].id

    const changelogRes = await axios.get(
      DISCOURSE_URL + `/posts/${firstPostId}/revisions/latest.json`
    )
    const changelogData = changelogRes.data
    const { previous: previousTags, current: currentTags } =
      changelogData.tags_changes
    const impactTagsBefore = previousTags.some(
      (tag: string) => tag === HIGH_IMPACT || tag === MEDIUM_IMPACT
    )
    const impactTagsNow = currentTags.some(
      (tag: string) => tag === HIGH_IMPACT || tag === MEDIUM_IMPACT
    )

    if (!impactTagsBefore && impactTagsNow) {
      await axios.post(
        DISCOURSE_URL + '/posts.json',
        {
          topic_id: body.topic.id,
          raw: 'Attention @impact-alerts this proposal has been given an Impact tag, please consider reviewing it.',
        },
        {
          headers: {
            'Api-Key': DISCOURSE_API_KEY,
            'Api-Username': DISCOURSE_API_USERNAME,
          },
        }
      )

      // Push topic ID to DB
    }

    res.status(200).end()
    return
  }

  res.status(200).end()
})

app.listen(port, () =>
  console.log(`⚡️[server]: Server is running on port ${port}...`)
)

module.exports = app
