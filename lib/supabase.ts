import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from './database.types'

// Create a single supabase client for interacting with your database
export const supabase = createClientComponentClient<Database>()

// Types for our database tables
export type Tables = {
  profiles: {
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
      theme: string
      language: string
    }
  }
  game_stats: {
    id: string
    user_id: string
    game_id: string
    best_score: number
    average_score: number
    total_sessions: number
    improvement: number
    last_played: string
  }
  game_history: {
    id: string
    user_id: string
    game_id: string
    date: string
    score: number
    duration: number
    difficulty: 'easy' | 'medium' | 'hard'
    domain: string
  }
} 