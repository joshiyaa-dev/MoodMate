"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw } from "lucide-react"
import { MobileFriendlyWrapper } from "./utils/mobile-touch-utils"

interface BreathingExerciseProps {
  onBack: () => void
}

export default function BreathingExercise({ onBack }: BreathingExerciseProps) {
  const [breathingActive, setBreathingActive] = useState(false)
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [breathingCount, setBreathingCount] = useState(0)

  // Breathing exercise timer
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (breathingActive) {
      interval = setInterval(() => {
        setBreathingCount((prev) => {
          const newCount = prev + 1

          if (breathingPhase === "inhale" && newCount >= 4) {
            setBreathingPhase("hold")
            return 0
          } else if (breathingPhase === "hold" && newCount >= 7) {
            setBreathingPhase("exhale")
            return 0
          } else if (breathingPhase === "exhale" && newCount >= 8) {
            setBreathingPhase("inhale")
            return 0
          }

          return newCount
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [breathingActive, breathingPhase])

  const resetBreathing = () => {
    setBreathingActive(false)
    setBreathingPhase("inhale")
    setBreathingCount(0)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">4-7-8 Breathing</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">Inhale for 4, hold for 7, exhale for 8</p>
      </div>

      <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900">
        <div className="mb-6">
          <div className={`w-32 h-32 mx-auto rounded-full transition-all duration-1000 flex items-center justify-center text-white font-bold text-xl ${
            breathingPhase === "inhale" ? "bg-gradient-to-br from-blue-400 to-blue-600 scale-110" :
            breathingPhase === "hold" ? "bg-gradient-to-br from-purple-400 to-purple-600 scale-125" :
            "bg-gradient-to-br from-green-400 to-green-600 scale-90"
          }`}>
            {breathingPhase.toUpperCase()}
          </div>
        </div>

        <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">
          {breathingCount}
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => setBreathingActive(!breathingActive)}
            onTouchEnd={(e) => { e.preventDefault(); setBreathingActive(!breathingActive) }}
            size="lg"
            className={`w-full touch-manipulation ${breathingActive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {breathingActive ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause Breathing
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Breathing
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={resetBreathing} 
            onTouchEnd={(e) => { e.preventDefault(); resetBreathing() }}
            size="lg"
            className="w-full touch-manipulation"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {breathingActive && (
          <div className="mt-6 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {breathingPhase === "inhale" && "Breathe in slowly through your nose..."}
              {breathingPhase === "hold" && "Hold your breath gently..."}
              {breathingPhase === "exhale" && "Exhale slowly through your mouth..."}
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}