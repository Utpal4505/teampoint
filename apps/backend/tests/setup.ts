import dotenv from 'dotenv'
import { jest } from '@jest/globals'
import { clearDatabase, disconnectDB } from './utils/db.ts'

process.env.NODE_ENV = 'test'
dotenv.config({ path: '.env.test' })

jest.spyOn(console, 'log').mockImplementation(() => {})
jest.spyOn(console, 'error').mockImplementation(() => {})

beforeAll(async () => {
  await clearDatabase()
})

afterEach(async () => {
  await clearDatabase()
})

afterAll(async () => {
  await clearDatabase()
  await disconnectDB()
})