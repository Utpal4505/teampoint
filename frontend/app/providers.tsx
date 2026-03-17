'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useEffect } from 'react'
import { initConsoleCapture } from '@/lib/feedback-consoleError'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function ConsoleCaptureInit() {
  useEffect(() => {
    initConsoleCapture()
  }, [])
  return null
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ConsoleCaptureInit />
          {children}
        </TooltipProvider>
        <Toaster richColors />
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </ThemeProvider>
  )
}
