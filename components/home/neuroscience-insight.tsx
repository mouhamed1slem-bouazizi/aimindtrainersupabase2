"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"
import { useAICoach } from "@/context/ai-coach-context"
import { useEffect, useState } from "react"

export function NeuroscienceInsight() {
  const { getDomainInsight } = useAICoach()
  const [insight, setInsight] = useState<string>("")

  // Get a deterministic insight for the home page based on the current date
  const domains = [
    "Memory",
    "Attention",
    "Processing Speed",
    "Reflexes",
    "Executive Control",
    "Problem-Solving",
    "Spatial Reasoning",
    "Language",
    "Numerical Skills",
    "Stress Regulation",
  ] as const

  useEffect(() => {
    // Use the current date to deterministically select a domain
    const today = new Date()
    const startOfYear = new Date(today.getFullYear(), 0, 0)
    const diff = today.getTime() - startOfYear.getTime()
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
    const domainIndex = dayOfYear % domains.length
    const selectedDomain = domains[domainIndex]
    
    // Get the insight for the selected domain
    const domainInsight = getDomainInsight(selectedDomain)
    setInsight(domainInsight)
  }, [getDomainInsight])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
          Neuroscience Insight
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{insight || "Loading insight..."}</p>
        <Button variant="link" className="text-xs p-0 h-auto mt-2">
          Learn more about this brain region
        </Button>
      </CardContent>
    </Card>
  )
}
