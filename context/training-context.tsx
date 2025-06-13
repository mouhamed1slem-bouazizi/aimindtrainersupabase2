"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { CognitiveDomain, GameSession, TrainingPlan } from "@/types/training"

interface TrainingContextType {
  currentStreak: number
  lastTrainingDate: string | null
  completedGames: number
  totalGames: number
  trainingPlan: TrainingPlan
  domainScores: Record<CognitiveDomain, number>
  domainImprovements: Record<CognitiveDomain, number>
  completeGameSession: (session: GameSession) => void
  generateTrainingPlan: (days: number) => void
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined)

export function TrainingProvider({ children }: { children: React.ReactNode }) {
  const [currentStreak, setCurrentStreak] = useState(3)
  const [lastTrainingDate, setLastTrainingDate] = useState<string | null>("2023-06-12")
  const [completedGames, setCompletedGames] = useState(5)
  const [totalGames, setTotalGames] = useState(14)

  const [domainScores, setDomainScores] = useState<Record<CognitiveDomain, number>>({
    Memory: 65,
    Attention: 72,
    "Processing Speed": 68,
    Reflexes: 75,
    "Executive Control": 60,
    "Problem-Solving": 70,
    "Spatial Reasoning": 63,
    Language: 78,
    "Numerical Skills": 67,
    "Stress Regulation": 71,
  })

  const [domainImprovements, setDomainImprovements] = useState<Record<CognitiveDomain, number>>({
    Memory: 5,
    Attention: 8,
    "Processing Speed": 3,
    Reflexes: 12,
    "Executive Control": 2,
    "Problem-Solving": 7,
    "Spatial Reasoning": 4,
    Language: 6,
    "Numerical Skills": 5,
    "Stress Regulation": 9,
  })

  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan>({
    days: [],
    currentDay: 1,
  })

  // Generate initial training plan on mount
  useEffect(() => {
    generateTrainingPlan(7)
  }, [])

  const completeGameSession = (session: GameSession) => {
    // Update domain scores
    setDomainScores((prev) => ({
      ...prev,
      [session.domain]: Math.min(100, prev[session.domain] + session.score / 100),
    }))

    // Update domain improvements
    setDomainImprovements((prev) => ({
      ...prev,
      [session.domain]: prev[session.domain] + (session.improvement || 1),
    }))

    // Update streak and last training date
    const today = new Date().toISOString().split("T")[0]
    if (lastTrainingDate !== today) {
      setCurrentStreak((prev) => prev + 1)
      setLastTrainingDate(today)
    }

    // Update completed games count
    setCompletedGames((prev) => prev + 1)

    // Update training plan
    setTrainingPlan((prev) => {
      const newPlan = { ...prev }
      const dayIndex = newPlan.days.findIndex((day) => day.games.some((game) => game.id === session.gameId))

      if (dayIndex !== -1) {
        const gameIndex = newPlan.days[dayIndex].games.findIndex((game) => game.id === session.gameId)

        if (gameIndex !== -1) {
          newPlan.days[dayIndex].games[gameIndex].completed = true

          // Check if all games for the day are completed
          const allCompleted = newPlan.days[dayIndex].games.every((game) => game.completed)
          if (allCompleted) {
            newPlan.days[dayIndex].completed = true
          }
        }
      }

      return newPlan
    })
  }

  const generateTrainingPlan = (days: number) => {
    const domains = Object.keys(domainScores) as CognitiveDomain[]
    const games = [
      { name: "Memory Match", domain: "Memory" as CognitiveDomain },
      { name: "Attention Grid", domain: "Attention" as CognitiveDomain },
      { name: "Speed Sort", domain: "Processing Speed" as CognitiveDomain },
      { name: "Reflex Tap", domain: "Reflexes" as CognitiveDomain },
      { name: "Task Switch", domain: "Executive Control" as CognitiveDomain },
      { name: "Pattern Solver", domain: "Problem-Solving" as CognitiveDomain },
      { name: "Space Navigator", domain: "Spatial Reasoning" as CognitiveDomain },
      { name: "Word Builder", domain: "Language" as CognitiveDomain },
      { name: "Number Crunch", domain: "Numerical Skills" as CognitiveDomain },
      { name: "Breath Pacer", domain: "Stress Regulation" as CognitiveDomain },
    ]

    // Sort domains by lowest score to prioritize weaker areas
    const sortedDomains = [...domains].sort((a, b) => domainScores[a] - domainScores[b])

    // Generate plan
    const newPlan: TrainingPlan = {
      days: Array.from({ length: days }, (_, dayIndex) => {
        // Select 2-3 games for each day, prioritizing weaker domains
        const dayGames = []
        const numGames = Math.floor(Math.random() * 2) + 2 // 2-3 games per day

        for (let i = 0; i < numGames; i++) {
          // Select domain with bias towards weaker areas
          const domainIndex = Math.floor(Math.pow(Math.random(), 1.5) * sortedDomains.length)
          const domain = sortedDomains[domainIndex]

          // Find a game for this domain
          const domainGames = games.filter((g) => g.domain === domain)
          const game = domainGames[Math.floor(Math.random() * domainGames.length)]

          dayGames.push({
            id: `game-${dayIndex}-${i}`,
            name: game.name,
            domain: game.domain,
            duration: 3 + Math.floor(Math.random() * 3), // 3-5 minutes
            completed: false,
          })
        }

        return {
          day: dayIndex + 1,
          date: new Date(Date.now() + dayIndex * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          games: dayGames,
          completed: false,
        }
      }),
      currentDay: 1,
    }

    setTrainingPlan(newPlan)
    setTotalGames((prev) => prev + newPlan.days.reduce((sum, day) => sum + day.games.length, 0))
  }

  return (
    <TrainingContext.Provider
      value={{
        currentStreak,
        lastTrainingDate,
        completedGames,
        totalGames,
        trainingPlan,
        domainScores,
        domainImprovements,
        completeGameSession,
        generateTrainingPlan,
      }}
    >
      {children}
    </TrainingContext.Provider>
  )
}

export function useTraining() {
  const context = useContext(TrainingContext)
  if (context === undefined) {
    throw new Error("useTraining must be used within a TrainingProvider")
  }
  return context
}
