export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
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
        Insert: {
          id: string
          name: string
          email: string
          member_since?: string
          level?: number
          is_premium?: boolean
          preferences?: {
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
        Update: {
          id?: string
          name?: string
          email?: string
          member_since?: string
          level?: number
          is_premium?: boolean
          preferences?: {
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
      }
      game_stats: {
        Row: {
          id: string
          user_id: string
          game_id: string
          best_score: number
          average_score: number
          total_sessions: number
          improvement: number
          last_played: string
        }
        Insert: {
          id?: string
          user_id: string
          game_id: string
          best_score: number
          average_score: number
          total_sessions: number
          improvement: number
          last_played: string
        }
        Update: {
          id?: string
          user_id?: string
          game_id?: string
          best_score?: number
          average_score?: number
          total_sessions?: number
          improvement?: number
          last_played?: string
        }
      }
      game_history: {
        Row: {
          id: string
          user_id: string
          game_id: string
          date: string
          score: number
          duration: number
          difficulty: 'easy' | 'medium' | 'hard'
          domain: string
        }
        Insert: {
          id?: string
          user_id: string
          game_id: string
          date: string
          score: number
          duration: number
          difficulty: 'easy' | 'medium' | 'hard'
          domain: string
        }
        Update: {
          id?: string
          user_id?: string
          game_id?: string
          date?: string
          score?: number
          duration?: number
          difficulty?: 'easy' | 'medium' | 'hard'
          domain?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 