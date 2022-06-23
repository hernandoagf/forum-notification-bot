import express from 'express'
import { config } from 'dotenv'

config()

const app = express()
app.use(express.json())
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.status(200).json('Hello world :)')
})

app.post('/', (req, res) => {
  console.log(req)
  res.status(200).end()
})

app.listen(port, () =>
  console.log(`⚡️[server]: Server is running on port ${port}...`)
)

module.exports = app
