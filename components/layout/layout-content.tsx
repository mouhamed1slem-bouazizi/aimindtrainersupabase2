"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BottomNavigation } from "@/components/navigation/bottom-navigation"

// List of public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/forgot-password']

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPublicRoute = publicRoutes.includes(pathname)

  return (
    <main className="flex flex-col h-screen">
      <div className={cn("flex-1 overflow-auto", !isPublicRoute && "pb-16")}>{children}</div>
      {!isPublicRoute && <BottomNavigation />}
    </main>
  )
} 