import 'dotenv/config'
import { createServer } from 'node:http'
import { app } from './app.js'
import { initializeSocketServer } from './services/socket.service.js'

const PORT = Number(process.env.PORT) || 3000

const server = createServer(app)

initializeSocketServer(server)

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
