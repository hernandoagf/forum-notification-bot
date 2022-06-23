import express from 'express'
import { config } from 'dotenv'

config()

const app = express()
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.status(200).json('Hello world :)')
})

app.post('/', (req, res) => {
  console.log(req.Headers)
  console.log(req.headers)
  console.log(req.body)
  console.log(req.payload)
  console.log(req.Payload)
  console.log(req.data)
  console.log(req.formData)
  res.status(200).end()
})

app.listen(port, () =>
  console.log(`⚡️[server]: Server is running on port ${port}...`)
)

module.exports = app
