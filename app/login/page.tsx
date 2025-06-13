"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useUser } from "@/context/user-context"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Brain } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { login, user, isAuthenticated } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Check initial session
  useEffect(() => {
    const checkSession = async () => {
      console.log("Login page - Checking initial session")
      const { data: { session }, error } = await supabase.auth.getSession()
      console.log("Login page - Initial session check:", { 
        hasSession: !!session, 
        error: error?.message 
      })
    }
    checkSession()
  }, [])

  // Handle redirection when authenticated
  useEffect(() => {
    console.log("Login page - Auth state changed:", { 
      isAuthenticated, 
      user: user ? { id: user.id, email: user.email } : null,
      currentPath: window.location.pathname 
    })
    
    if (isAuthenticated && user) {
      console.log("Login page - User is authenticated, preparing redirect...")
      const redirectTo = searchParams.get("redirectTo") || "/"
      console.log("Login page - Redirecting to:", redirectTo)
      
      // Use router.push for client-side navigation
      router.push(redirectTo)
    }
  }, [isAuthenticated, user, router, searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      console.log("Login page - Attempting login...")
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Login page - Login error:", error)
        throw error
      }

      console.log("Login page - Supabase login successful:", data)
      
      // Call our context login function to update the app state
      await login(email, password)
      
      console.log("Login page - Context updated, waiting for auth state...")
    } catch (err) {
      console.error("Login page - Login error:", err)
      setError("Invalid email or password. Please try again.")
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your credentials and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
