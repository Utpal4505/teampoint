import 'dotenv/config'
import { createServer } from 'node:http'
import { app } from './app.ts'
import { initializeSocketServer } from './services/socket.service.ts'

const PORT = process.env.PORT || 3000

const server = createServer(app)

initializeSocketServer(server)

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
