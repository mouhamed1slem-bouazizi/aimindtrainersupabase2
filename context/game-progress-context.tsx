"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { CognitiveDomain, GameHistory, GameStats } from "@/types/training"
import { supabase } from "@/lib/supabase"
import { useUser } from "./user-context"

interface GameProgressContextType {
  gameStats: Record<string, GameStats>
  gameHistory: Record<string, GameHistory[]>
  addGameResult: (gameId: string, domain: CognitiveDomain, result: GameHistory) => Promise<void>
  getGameStats: (gameId: string) => GameStats | null
  getGameHistory: (gameId: string) => GameHistory[]
  getDomainHistory: (domain: CognitiveDomain) => GameHistory[]
}

const GameProgressContext = createContext<GameProgressContextType | undefined>(undefined)

export function useGameProgress() {
  const context = useContext(GameProgressContext)
  if (!context) {
    throw new Error("useGameProgress must be used within a GameProgressProvider")
  }
  return context
}

export function GameProgressProvider({ children }: { children: React.ReactNode }) {
  const [gameStats, setGameStats] = useState<Record<string, GameStats>>({})
  const [gameHistory, setGameHistory] = useState<Record<string, GameHistory[]>>({})
  const { user } = useUser()

  useEffect(() => {
    if (user) {
      loadUserGameData(user.id)
    }
  }, [user])

  const loadUserGameData = async (userId: string) => {
    try {
      // Load game stats
      const { data: statsData, error: statsError } = await supabase
        .from("game_stats")
        .select("*")
        .eq("user_id", userId)

      if (statsError) throw statsError

      const stats: Record<string, GameStats> = {}
      statsData?.forEach((stat) => {
        stats[stat.game_id] = {
          bestScore: stat.best_score,
          averageScore: stat.average_score,
          totalSessions: stat.total_sessions,
          improvement: stat.improvement,
          lastPlayed: stat.last_played,
        }
      })
      setGameStats(stats)

      // Load game history
      const { data: historyData, error: historyError } = await supabase
        .from("game_history")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })

      if (historyError) throw historyError

      const history: Record<string, GameHistory[]> = {}
      historyData?.forEach((record) => {
        if (!history[record.game_id]) {
          history[record.game_id] = []
        }
        history[record.game_id].push({
          date: record.date,
          score: record.score,
          duration: record.duration,
          difficulty: record.difficulty,
          domain: record.domain as CognitiveDomain,
        })
      })
      setGameHistory(history)
    } catch (error) {
      console.error("Error loading game data:", error)
    }
  }

  const addGameResult = async (gameId: string, domain: CognitiveDomain, result: GameHistory) => {
    if (!user) return

    try {
      // Insert game history record
      const { error: historyError } = await supabase.from("game_history").insert({
        user_id: user.id,
        game_id: gameId,
        date: result.date,
        score: result.score,
        duration: result.duration,
        difficulty: result.difficulty,
        domain: result.domain,
      })

      if (historyError) throw historyError

      // Update game stats
      const currentStats = gameStats[gameId] || {
        bestScore: 0,
        averageScore: 0,
        totalSessions: 0,
        improvement: 0,
        lastPlayed: "",
      }

      const totalSessions = currentStats.totalSessions + 1
      const totalScore = currentStats.averageScore * currentStats.totalSessions + result.score
      const averageScore = totalScore / totalSessions
      const bestScore = Math.max(currentStats.bestScore, result.score)

      // Calculate improvement
      let improvement = currentStats.improvement
      const history = [...(gameHistory[gameId] || []), result]
      if (history.length >= 4) {
        const firstThreeAvg = history.slice(0, 3).reduce((sum, h) => sum + h.score, 0) / 3
        const latestThreeAvg = history.slice(-3).reduce((sum, h) => sum + h.score, 0) / 3
        improvement = Math.round(((latestThreeAvg - firstThreeAvg) / firstThreeAvg) * 100)
      }

      const { error: statsError } = await supabase
        .from("game_stats")
        .upsert({
          user_id: user.id,
          game_id: gameId,
          best_score: bestScore,
          average_score: averageScore,
          total_sessions: totalSessions,
          improvement: improvement,
          last_played: new Date().toISOString().split("T")[0],
        })

      if (statsError) throw statsError

      // Update local state
      setGameHistory((prev) => ({
        ...prev,
        [gameId]: [...(prev[gameId] || []), result],
      }))

      setGameStats((prev) => ({
        ...prev,
        [gameId]: {
          bestScore,
          averageScore,
          totalSessions,
          improvement,
          lastPlayed: new Date().toISOString().split("T")[0],
        },
      }))
    } catch (error) {
      console.error("Error adding game result:", error)
      throw error
    }
  }

  const getGameStats = (gameId: string) => {
    return gameStats[gameId] || null
  }

  const getGameHistory = (gameId: string) => {
    return gameHistory[gameId] || []
  }

  const getDomainHistory = (domain: CognitiveDomain) => {
    return Object.values(gameHistory)
      .flat()
      .filter((history) => history.domain === domain)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  return (
    <GameProgressContext.Provider
      value={{
        gameStats,
        gameHistory,
        addGameResult,
        getGameStats,
        getGameHistory,
        getDomainHistory,
      }}
    >
      {children}
    </GameProgressContext.Provider>
  )
}
