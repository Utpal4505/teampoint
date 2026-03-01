import dotenv from 'dotenv'
import { clearDatabase, disconnectDB } from './utils/db.ts'

process.env.NODE_ENV = 'test'
dotenv.config({ path: '.env.test' })

jest.spyOn(console, 'log').mockImplementation(() => {})
jest.spyOn(console, 'error').mockImplementation(() => {})

// clear database between tests to ensure isolation
beforeEach(async () => {
  await clearDatabase()
})

afterAll(async () => {
  await clearDatabase()
  await disconnectDB()
})
