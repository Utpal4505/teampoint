import 'dotenv/config'
import type { Application, Request, Response } from 'express'
import express from 'express'

const app: Application = express()

const PORT = process.env.PORT || 3000

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, app is running!! 🥷')
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
