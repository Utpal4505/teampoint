import 'dotenv/config'
import { createServer } from 'node:http'
import { app } from './app.js'
import { initializeSocketServer } from './services/socket.service.js'

const PORT = Number(process.env.PORT) || 3000

const server = createServer(app)

console.log("Starting server...")

console.log("Before socket init")
initializeSocketServer(server)
console.log("After socket init")

server.listen(PORT, () => {
  console.log(`RUNNING ON ${PORT}`)
})