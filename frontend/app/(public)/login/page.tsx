'use client'

import {
  AuthBackground,
  AuthButton,
  AuthCard,
  AuthFooter,
  AuthLogo,
} from '@/components/auth'
import { loginWithGithub, loginWithGoogle } from '@/features/auth/api'
import api from '@/lib/api'
import { useUserStore } from '@/store/user.store'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

function GithubIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function GoogleIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" className={className}>
      <path
        d="M17.64 9.2045c0-.638-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.6150z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9087-2.2581c-.8059.54-1.8368.859-3.0477.859-2.344 0-4.3282-1.5836-5.036-3.7104H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71C3.7841 10.17 3.6818 9.5932 3.6818 9c0-.5932.1023-1.17.2822-1.71V4.9582H.9574C.3477 6.1732 0 7.5477 0 9c0 1.4523.3477 2.8268.9574 4.0418L3.964 10.71z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4627.8918 11.4255 0 9 0 5.4818 0 2.4382 2.0168.9574 4.9582L3.964 7.29C4.6718 5.1632 6.656 3.5795 9 3.5795z"
        fill="#EA4335"
      />
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)
  const setUser = useUserStore(state => state.setUser)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.post('/auth/refresh', {}, { withCredentials: true })

        const res = await api.get('/users/me', {
          withCredentials: true,
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        })

        const user = res.data.data

        setUser(user)

        if (user.is_new) {
          router.replace('/onboarding/step-1')
        } else {
          router.replace('/dashboard')
        }
      } catch (err) {
        console.log('Something went wrong while checking authentication:', err)
        setCheckingAuth(false)
      }
    }

    checkAuth()
  }, [router, setUser])

  if (checkingAuth) return null

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <AuthBackground />

      <div className="relative z-10 flex w-full flex-col items-center gap-8">
        <AuthCard>
          <div className="flex flex-col gap-8">
            <AuthLogo appName="TeamPoint" tagline="Calm workspace for teams" />

            <div className="flex flex-col gap-4">
              <AuthButton
                icon={GoogleIcon}
                label="Continue with Google"
                onClick={loginWithGoogle}
              />

              <AuthButton
                icon={GithubIcon}
                label="Continue with GitHub"
                onClick={loginWithGithub}
              />
            </div>

            <AuthFooter />
          </div>
        </AuthCard>
      </div>
    </main>
  )
}
