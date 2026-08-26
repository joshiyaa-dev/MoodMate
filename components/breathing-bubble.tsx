"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react"

interface BreathingBubbleProps {
  onBack: () => void
}

export default function BreathingBubble({ onBack }: BreathingBubbleProps) {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [count, setCount] = useState(0)
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive) {
      interval = setInterval(() => {
        setCount((prev) => {
          const newCount = prev + 1

          // 4-7-8 breathing pattern
          if (phase === "inhale" && newCount >= 4) {
            setPhase("hold")
            return 0
          } else if (phase === "hold" && newCount >= 7) {
            setPhase("exhale")
            return 0
          } else if (phase === "exhale" && newCount >= 8) {
            setPhase("inhale")
            setCycle((c) => c + 1)
            return 0
          }

          return newCount
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isActive, phase])

  const reset = () => {
    setIsActive(false)
    setPhase("inhale")
    setCount(0)
    setCycle(0)
  }

  const getBubbleScale = () => {
    if (phase === "inhale") {
      return 1 + (count / 4) * 0.5 // Scale from 1 to 1.5
    } else if (phase === "hold") {
      return 1.5 // Stay at max size
    } else {
      return 1.5 - (count / 8) * 0.5 // Scale from 1.5 to 1
    }
  }

  const getBubbleColor = () => {
    switch (phase) {
      case "inhale":
        return "from-blue-400 to-blue-600"
      case "hold":
        return "from-purple-400 to-purple-600"
      case "exhale":
        return "from-green-400 to-green-600"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBack}
            className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Breathing Bubble</h1>
          <div className="w-8" />
        </div>

        <div className="text-center space-y-8">
          {/* Animated Bubble */}
          <div className="relative flex items-center justify-center h-80">
            <div
              className={`w-48 h-48 rounded-full bg-gradient-to-br ${getBubbleColor()} transition-transform duration-1000 ease-in-out flex items-center justify-center shadow-2xl`}
              style={{ transform: `scale(${getBubbleScale()})` }}
            >
              <div className="text-center text-white">
                <div className="text-3xl font-bold capitalize mb-2">{phase}</div>
                <div className="text-6xl font-light">
                  {phase === "inhale" ? 4 - count : phase === "hold" ? 7 - count : 8 - count}
                </div>
              </div>
            </div>

            {/* Floating particles */}
            {isActive && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-2 h-2 bg-white/30 rounded-full animate-pulse`}
                    style={{
                      left: `${20 + i * 12}%`,
                      top: `${30 + (i % 2) * 40}%`,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: "2s",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">
              {phase === "inhale" ? "Breathe In Slowly" : phase === "hold" ? "Hold Your Breath" : "Breathe Out Gently"}
            </h3>
            <p className="text-gray-600">
              {phase === "inhale"
                ? "Fill your lungs completely through your nose"
                : phase === "hold"
                  ? "Keep the air in your lungs"
                  : "Release the air slowly through your mouth"}
            </p>
          </div>

          {/* Stats */}
          <Card className="p-4 bg-white/80 backdrop-blur">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{cycle}</div>
                <div className="text-sm text-gray-600">Cycles Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.floor((cycle * 19 + count + (phase === "hold" ? 4 : phase === "exhale" ? 11 : 0)) / 60)}:
                  {String((cycle * 19 + count + (phase === "hold" ? 4 : phase === "exhale" ? 11 : 0)) % 60).padStart(
                    2,
                    "0",
                  )}
                </div>
                <div className="text-sm text-gray-600">Total Time</div>
              </div>
            </div>
          </Card>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => setIsActive(!isActive)}
              className={`${isActive ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"} px-8`}
            >
              {isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isActive ? "Pause" : "Start"}
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Tips */}
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
            <h4 className="font-semibold text-gray-800 mb-2">Breathing Tips</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• Find a comfortable seated position</p>
              <p>• Place one hand on chest, one on belly</p>
              <p>• Focus on expanding your diaphragm</p>
              <p>• Practice for 4-8 cycles for best results</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
