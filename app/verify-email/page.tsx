"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Brain className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
          <CardDescription>
            To complete your registration, please verify your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
            </p>
            <p className="text-sm text-muted-foreground">
              If you don't see the email, please check your spam folder.
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Return to login</Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/">Go to home page</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 