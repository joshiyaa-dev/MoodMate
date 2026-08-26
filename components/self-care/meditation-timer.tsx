"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw } from "lucide-react"
import { MobileFriendlyWrapper } from "./utils/mobile-touch-utils"

interface MeditationTimerProps {
  onBack: () => void
}

export default function MeditationTimer({ onBack }: MeditationTimerProps) {
  const [meditationTime, setMeditationTime] = useState(0)
  const [meditationActive, setMeditationActive] = useState(false)

  // Meditation timer
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (meditationActive) {
      interval = setInterval(() => {
        setMeditationTime((prev) => prev + 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [meditationActive])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const resetMeditation = () => {
    setMeditationActive(false)
    setMeditationTime(0)
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Mini Meditation</h3>
        <p className="text-xs text-gray-600 dark:text-gray-300">Focus on your breath and find inner peace</p>
      </div>

      <Card className="mobile-card text-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900">
        <div className="text-4xl sm:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-4">
          {formatTime(meditationTime)}
        </div>
        
        <div className="space-y-3">
          <Button
            onClick={() => setMeditationActive(!meditationActive)}
            onTouchEnd={(e) => { e.preventDefault(); setMeditationActive(!meditationActive) }}
            size="lg"
            className={`w-full touch-manipulation ${meditationActive ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-500 hover:bg-purple-600'}`}
          >
            {meditationActive ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause Meditation
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Meditation
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={resetMeditation} 
            onTouchEnd={(e) => { e.preventDefault(); resetMeditation() }}
            size="lg"
            className="w-full touch-manipulation"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Timer
          </Button>
        </div>

        {meditationActive && (
          <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-xs text-gray-700 dark:text-gray-300">
              Close your eyes, breathe deeply, and let your thoughts flow like clouds in the sky...
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}