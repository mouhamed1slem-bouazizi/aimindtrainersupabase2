import { User as SupabaseUser } from '@supabase/supabase-js'

export type User = SupabaseUser

export interface UserProfile {
  id: string
  name: string
  email: string
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
    theme: 'light' | 'dark' | 'system'
    language: string
  }
} 