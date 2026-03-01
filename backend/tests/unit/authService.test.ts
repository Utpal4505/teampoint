import { authService } from '../../src/modules/auth/auth.service.ts'
import { getPrisma } from '../utils/db.ts'
import type { Profile } from 'passport'

const mockProfile = (overrides = {}): Profile => ({
  id: 'google_123',
  displayName: 'Test User',
  emails: [{ value: 'test@gmail.com' }],
  photos: [{ value: 'https://photo.url' }],
  provider: 'google',
  ...overrides,
})

describe('authService', () => {
  let prisma: Awaited<ReturnType<typeof getPrisma>>

  beforeAll(async () => {
    prisma = await getPrisma()
  })

  it('should create new user on first login', async () => {
    const profile = mockProfile()

    const user = await authService('GOOGLE', profile)

    expect(user.email).toBe('test@gmail.com')
    expect(user.is_new).toBe(true)

    const dbUser = await prisma.user.findUnique({
      where: { email: 'test@gmail.com' },
    })
    expect(dbUser).not.toBeNull()
  })

  it('should create authProvider record on first login', async () => {
    const profile = mockProfile({ id: 'google_456' })
    await authService('GOOGLE', profile)

    const authProvider = await prisma.authProvider.findUnique({
      where: {
        provider_providerUserId: {
          provider: 'GOOGLE',
          providerUserId: 'google_456',
        },
      },
    })

    expect(authProvider).not.toBeNull()
  })

  it('should return existing user on second login', async () => {
    const profile = mockProfile({ id: 'google_789' })

    const firstLogin = await authService('GOOGLE', profile)
    const secondLogin = await authService('GOOGLE', profile)

    expect(firstLogin.id).toBe(secondLogin.id)

    const users = await prisma.user.findMany({
      where: { email: 'test@gmail.com' },
    })
    expect(users.length).toBe(1)
  })

  it('should link provider to existing user with same email', async () => {
    const googleProfile = mockProfile({ id: 'google_abc', provider: 'google' })
    const googleUser = await authService('GOOGLE', googleProfile)

    const githubProfile = mockProfile({ id: 'github_abc', provider: 'github' })
    const githubUser = await authService('GITHUB', githubProfile)

    expect(googleUser.id).toBe(githubUser.id)
  })

  it('should throw if email not provided', async () => {
    const profile = mockProfile({ emails: [] })

    await expect(authService('GOOGLE', profile)).rejects.toThrow(
      'OAuth provider did not return an email',
    )
  })

  it('should throw if user is INACTIVE', async () => {
    await prisma.user.create({
      data: {
        email: 'inactive@gmail.com',
        fullName: 'Inactive User',
        status: 'INACTIVE',
        is_new: false,
      },
    })

    const profile = mockProfile({
      id: 'google_inactive',
      emails: [{ value: 'inactive@gmail.com' }],
    })

    await expect(authService('GOOGLE', profile)).rejects.toThrow(
      'User account has been deleted',
    )
  })
})
