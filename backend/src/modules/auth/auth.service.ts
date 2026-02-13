import type { Profile } from 'passport'
import type { OAuthProvider } from '../../generated/prisma/enums.ts'
import { prisma } from '../../config/db.config.ts'
import { ApiError } from '../../utils/apiError.ts'

export const authService = async (provider: OAuthProvider, profile: Profile) => {
  const email = profile.emails?.[0]?.value
  const avatarUrl = profile.photos?.[0]?.value ?? null

  if (!email) throw new ApiError(400, 'OAuth provider did not return an email')

  const existingAuth = await prisma.authProvider.findUnique({
    where: {
      provider_providerUserId: {
        provider: provider,
        providerUserId: profile.id,
      },
    },
    include: {
      user: true,
    },
  })

  if (existingAuth) return existingAuth.user

  let user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: email,
        fullName: profile.displayName,
        is_new: true,
        avatar_url: avatarUrl,
        status: 'ACTIVE',
      },
    })
  }

  await prisma.authProvider.create({
    data: {
      provider: provider,
      providerUserId: profile.id,
      userId: user.id,
    },
  })

  return user
}
