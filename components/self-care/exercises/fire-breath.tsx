"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Zap } from "lucide-react"
import { MobileFriendlyWrapper } from "../utils/mobile-touch-utils"

interface FireBreathProps {
  onBack: () => void
}

export default function FireBreath({ onBack }: FireBreathProps) {
  const [isActive, setIsActive] = useState(false)
  const [breathCount, setBreathCount] = useState(0)
  const [cycles, setCycles] = useState(0)
  const [intensity, setIntensity] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
      setBreathCount(prev => {
        const newCount = prev + 1
        
        // Fire breath is rapid - 2 breaths per second
        if (newCount % 2 === 0) {
          setCycles(prevCycles => {
            const newCycles = prevCycles + 1
            setIntensity(Math.min(100, newCycles * 2))
            return newCycles
          })
        }
        
        return newCount
      })
    }, 500) // 500ms = 2 breaths per second

    return () => clearInterval(interval)
  }, [isActive])

  const startExercise = () => {
    setIsActive(true)
    setBreathCount(0)
    setCycles(0)
    setIntensity(0)
    setTimeElapsed(0)
  }

  const pauseExercise = () => {
    setIsActive(false)
  }

  const resetExercise = () => {
    setIsActive(false)
    setBreathCount(0)
    setCycles(0)
    setIntensity(0)
    setTimeElapsed(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getFlameSize = () => {
    return 60 + (intensity / 100) * 40 // Grows from 60px to 100px
  }

  const getFlameColor = () => {
    if (intensity < 25) return 'from-orange-400 to-red-500'
    if (intensity < 50) return 'from-red-400 to-orange-600'
    if (intensity < 75) return 'from-red-500 to-yellow-500'
    return 'from-yellow-400 to-red-600'
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Fire Breath</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">Fast inhale/exhale through nose for energy boost</p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm font-semibold">Time: {formatTime(timeElapsed)}</div>
          <div className="text-sm font-semibold">Cycles: {cycles}</div>
          <div className="text-sm font-semibold">Intensity: {Math.round(intensity)}%</div>
        </div>

        {/* Fire Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Base/Nose representation */}
            <div className="w-16 h-8 bg-gradient-to-b from-pink-200 to-pink-300 rounded-full mb-4"></div>
            
            {/* Animated Fire/Breath */}
            <div 
              className={`mx-auto bg-gradient-to-t ${getFlameColor()} rounded-full transition-all duration-500 ${
                isActive ? 'animate-pulse' : ''
              }`}
              style={{
                width: `${getFlameSize()}px`,
                height: `${getFlameSize()}px`,
                filter: 'blur(1px)',
                boxShadow: `0 0 ${getFlameSize() / 2}px rgba(255, 165, 0, 0.6)`
              }}
            >
              {/* Inner flame */}
              <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-t from-yellow-300 to-orange-400 rounded-full"
                style={{
                  width: `${getFlameSize() * 0.6}px`,
                  height: `${getFlameSize() * 0.6}px`
                }}
              />
              
              {/* Core flame */}
              <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-t from-white to-yellow-200 rounded-full"
                style={{
                  width: `${getFlameSize() * 0.3}px`,
                  height: `${getFlameSize() * 0.3}px`
                }}
              />
            </div>

            {/* Energy particles */}
            {isActive && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                    style={{
                      left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 40}%`,
                      top: `${50 + Math.sin(i * 60 * Math.PI / 180) * 40}%`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '1s'
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Breathing Instructions */}
        <Card className="p-4 bg-gradient-to-r from-orange-100 to-red-100 mb-6">
          <div className="text-center">
            <Zap className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <h4 className="font-semibold text-orange-800 mb-2">Fire Breath Technique</h4>
            <div className="text-sm text-orange-700 space-y-1">
              <p><strong>Inhale:</strong> Quick, sharp breath through nose</p>
              <p><strong>Exhale:</strong> Quick, forceful breath through nose</p>
              <p><strong>Rhythm:</strong> 2 breaths per second</p>
              <p><strong>Focus:</strong> Belly pumping, not chest</p>
            </div>
          </div>
        </Card>

        {/* Intensity Meter */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Energy Level:</h4>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
              className={`h-4 rounded-full transition-all duration-500 bg-gradient-to-r ${getFlameColor()}`}
              style={{ width: `${intensity}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>Calm</span>
            <span>Energized</span>
            <span>Powerful</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4 mb-4">
          <Button
            onClick={isActive ? pauseExercise : startExercise}
            onTouchEnd={(e) => { e.preventDefault(); isActive ? pauseExercise() : startExercise() }}
            size="lg"
            className={`touch-manipulation ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'}`}
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Fire Breath
              </>
            )}
          </Button>

          <Button 
            variant="outline" 
            onClick={resetExercise}
            onTouchEnd={(e) => { e.preventDefault(); resetExercise() }}
            size="lg"
            className="touch-manipulation"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Safety Warning */}
        <div className="bg-yellow-50 p-4 rounded-lg mb-4 border border-yellow-200">
          <h5 className="font-semibold text-yellow-800 mb-2">⚠️ Safety Guidelines:</h5>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Start slowly and build up intensity gradually</li>
            <li>• Stop if you feel dizzy or lightheaded</li>
            <li>• Practice for maximum 2 minutes at a time</li>
            <li>• Sit down while practicing this technique</li>
            <li>• Not recommended if pregnant or with heart conditions</li>
          </ul>
        </div>

        <div className="p-3 bg-orange-50 rounded-lg">
          <p className="text-sm text-orange-800 text-center">
            <strong>🔥 Benefits:</strong> Boosts energy and alertness • Increases oxygen flow • Activates sympathetic nervous system • Improves focus
          </p>
        </div>
      </Card>
    </div>
  )
}