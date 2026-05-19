import express from 'express'

const app = express()

const PORT = Number(process.env.PORT) || 3000

app.get('/', (_, res) => {
  res.send('Server works')
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})