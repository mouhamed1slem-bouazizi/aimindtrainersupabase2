import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/app/providers"
import { Toaster } from "@/components/ui/toaster"
import { StatusBar } from "@/components/ui/status-bar"
import { LayoutContent } from "@/components/layout/layout-content"

const inter = Inter({ subsets: ["latin"] })

// List of public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/forgot-password']

export const metadata: Metadata = {
  title: "MindTrainer - Cognitive Training App",
  description: "Train your brain with scientifically designed cognitive exercises",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <StatusBar />
          <LayoutContent>{children}</LayoutContent>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
