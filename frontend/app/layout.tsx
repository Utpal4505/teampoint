import type { Metadata } from 'next'
import { Poppins, Inter, Fira_Code } from 'next/font/google'
import './globals.css'
import Providers from './providers'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--display-family',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--body-family',
})

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--mono-family',
})

export const metadata: Metadata = {
  title: 'TeamPoint - Finish work without the clutter',
  description:
    'TeamPoint helps small teams manage tasks, decisions, and meetings in one focused workspace.',
  icons: {
    icon: '/logo-dot-teampoint.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} ${firaCode.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
