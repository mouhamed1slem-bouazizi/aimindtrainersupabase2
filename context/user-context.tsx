"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Tables } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { User, UserProfile } from "@/types/user"

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar_url?: string | null
  member_since: string
  level: number
  is_premium: boolean
  preferences: {
    reminders: boolean
    morning_reminder: string
    evening_reminder: string
    notifications: {
      training: boolean
      achievements: boolean
      weekly_reports: boolean
      coach_tips: boolean
    }
    theme: string
    language: string
  }
  age?: number | null
  height?: number | null
  weight?: number | null
  gender?: string | null
  bio?: string | null
}

interface UserContextType {
  user: User | null
  profile: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  updatePreferences: (preferences: Partial<UserProfile["preferences"]>) => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Function to refresh the session
  const refreshSession = async () => {
    console.log("UserProvider - Refreshing session")
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error("UserProvider - Error refreshing session:", error)
        return
      }
      console.log("UserProvider - Session refresh result:", { hasSession: !!session })
      if (session?.user) {
        setUser(session.user)
        await fetchUserProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
      }
    } catch (error) {
      console.error("UserProvider - Error in refreshSession:", error)
    }
  }

  useEffect(() => {
    console.log("UserProvider - Initializing auth state listener")
    
    // Initial session check
    refreshSession().finally(() => setIsLoading(false))

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("UserProvider - Auth state changed:", { event, session })
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          console.log("UserProvider - User signed in or token refreshed")
          setUser(session.user)
          await fetchUserProfile(session.user.id)
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("UserProvider - User signed out")
        setUser(null)
        setProfile(null)
      }
      
      setIsLoading(false)
    })

    // Set up periodic session refresh
    const refreshInterval = setInterval(refreshSession, 5 * 60 * 1000) // Refresh every 5 minutes

    return () => {
      subscription.unsubscribe()
      clearInterval(refreshInterval)
    }
  }, [])

  const fetchUserProfile = async (userId: string) => {
    console.log("UserProvider - Fetching profile for user:", userId)
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (error) {
        console.error("UserProvider - Error fetching profile:", error)
        throw error
      }

      console.log("UserProvider - Profile fetched:", data)
      setProfile(data)
    } catch (error) {
      console.error("UserProvider - Failed to fetch profile:", error)
      setProfile(null)
    }
  }

  const login = async (email: string, password: string) => {
    console.log("UserProvider - Attempting login for:", email)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("UserProvider - Login error:", error)
        throw error
      }

      console.log("UserProvider - Login successful:", data)
      if (data.user) {
        setUser(data.user)
        await fetchUserProfile(data.user.id)
        // Refresh the session after successful login
        await refreshSession()
      }
    } catch (error) {
      console.error("UserProvider - Login failed:", error)
      throw error
    }
  }

  const logout = async () => {
    console.log("UserProvider - Logging out")
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setProfile(null)
      router.push("/login")
    } catch (error) {
      console.error("UserProvider - Logout error:", error)
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      console.log("Starting registration process...")
      
      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      })

      if (authData.user) {
        // Explicitly set member_since for new users
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ member_since: new Date().toISOString() })
          .eq('id', authData.user.id);

        if (updateError) {
          console.error("Error setting member_since for new user:", updateError);
        }
      }
      
      if (authError) {
        console.error("Auth error during registration:", authError)
        throw new Error(authError.message)
      }

      if (!authData.user) {
        console.error("No user data returned from registration")
        throw new Error("No user data returned from registration")
      }

      console.log("Auth user created successfully:", authData.user.id)

      // Wait a moment for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Step 2: Verify profile was created
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single()

      if (profileError) {
        console.error("Error fetching profile:", profileError)
        throw new Error("Failed to create user profile. Please try again.")
      }

      if (!profile) {
        console.error("Profile not found after creation")
        throw new Error("Failed to create user profile. Please try again.")
      }

      console.log("Profile verified:", profile)

      // Step 3: Fetch the complete user profile
      await fetchUserProfile(authData.user.id)
      
      console.log("Registration process completed successfully")
    } catch (error) {
      console.error("Registration failed with error:", error)
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error("User not authenticated")
    console.log("UserProvider - Updating profile for user:", user.id, "with updates:", updates)
    try {
      // Prepare updates, ensuring correct types for Supabase
      const dbUpdates: Tables<'profiles'>['Update'] = {
        name: updates.name,
        email: updates.email,
        avatar_url: updates.avatar_url,
        age: updates.age,
        height: updates.height,
        weight: updates.weight,
        gender: updates.gender,
        bio: updates.bio,
        // Ensure preferences are handled correctly if they are part of 'updates'
        // For now, assuming preferences are updated via updatePreferences
      }

      // Remove undefined fields to avoid issues with Supabase update
      Object.keys(dbUpdates).forEach(key => {
        if (dbUpdates[key as keyof typeof dbUpdates] === undefined) {
          delete dbUpdates[key as keyof typeof dbUpdates];
        }
      });

      const { data, error } = await supabase
        .from("profiles")
        .update(dbUpdates)
        .eq("id", user.id)
        .select()
        .single()

      if (error) {
        console.error("UserProvider - Error updating profile:", error)
        throw error
      }

      console.log("UserProvider - Profile updated successfully:", data)
      // Merge the updates into the existing profile state to ensure all fields are present
      setProfile(prevProfile => ({
        ...(prevProfile as UserProfile), // Cast to UserProfile to satisfy TS
        ...(data as UserProfile), // Spread the returned data which should be the updated profile
      }))
    } catch (error) {
      console.error("UserProvider - Failed to update profile:", error)
      throw error
    }
  }

// Add this function inside UserProvider
  const updatePreferences = async (preferences: Partial<UserProfile["preferences"]>) => {
    if (!user || !profile) throw new Error("User or profile not available")
    console.log("UserProvider - Updating preferences for user:", user.id, "with:", preferences)
    try {
      const newPreferences = { ...profile.preferences, ...preferences };
      const { data, error } = await supabase
        .from("profiles")
        .update({ preferences: newPreferences })
        .eq("id", user.id)
        .select()
        .single()

      if (error) {
        console.error("UserProvider - Error updating preferences:", error)
        throw error
      }

      console.log("UserProvider - Preferences updated successfully:", data)
      // Merge the updates into the existing profile state
      setProfile(prevProfile => ({
        ...(prevProfile as UserProfile),
        ...(data as UserProfile),
      }))
    } catch (error) {
      console.error("UserProvider - Failed to update preferences:", error)
      throw error
    }
  }

  const value = {
    user,
    profile,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    updateProfile,
    updatePreferences,
  }

  console.log("UserProvider - Current state:", { 
    user: user ? { id: user.id, email: user.email } : null, 
    profile: profile ? { id: profile.id, name: profile.name } : null, 
    isAuthenticated: !!user, 
    isLoading 
  })

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
