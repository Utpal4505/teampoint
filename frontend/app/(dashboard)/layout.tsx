"use client"

import { useAuthGuard } from "@/features/auth/hooks"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading } = useAuthGuard()

  if (isLoading) return <p>Loading...</p>

  return <>{children}</>
}