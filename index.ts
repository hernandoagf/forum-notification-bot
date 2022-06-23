import express from 'express'
import { config } from 'dotenv'
import { HmacSHA256 } from 'crypto-js'
import Base64 from 'crypto-js/enc-base64'

config()

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || ''

const app = express()
app.use(express.json())
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.status(200).json('Hello world :)')
})

app.post('/', (req, res) => {
  const body = req.body
  const headers = req.headers

  if (!headers['x-discourse-event-signature']) {
    res.status(400).end()
    return
  }

  const hmac = HmacSHA256(JSON.stringify(body), WEBHOOK_SECRET)
  const hash = `sha256=${hmac}`

  console.log(headers['x-discourse-event-signature'])
  console.log(hash)
  console.log(`sha256=${Base64.stringify(hmac)}`)

  res.status(200).end()
})

app.listen(port, () =>
  console.log(`⚡️[server]: Server is running on port ${port}...`)
)

module.exports = app
