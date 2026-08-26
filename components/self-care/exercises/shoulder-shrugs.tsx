"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw } from "lucide-react"
import { MobileFriendlyWrapper } from "../utils/mobile-touch-utils"

interface ShoulderShrugsProps {
  onBack: () => void
}

export default function ShoulderShrugs({ onBack }: ShoulderShrugsProps) {
  const [isActive, setIsActive] = useState(false)
  const [currentRep, setCurrentRep] = useState(0)
  const [totalReps, setTotalReps] = useState(0)
  const [phase, setPhase] = useState<'lift' | 'hold' | 'lower' | 'rest'>('lift')
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
      
      setPhase(currentPhase => {
        switch (currentPhase) {
          case 'lift':
            setTimeout(() => setPhase('hold'), 1000)
            return 'lift'
          case 'hold':
            setTimeout(() => setPhase('lower'), 1000)
            return 'hold'
          case 'lower':
            setTimeout(() => setPhase('rest'), 1000)
            return 'lower'
          case 'rest':
            setCurrentRep(prev => prev + 1)
            setTotalReps(prev => prev + 1)
            setTimeout(() => setPhase('lift'), 1000)
            return 'rest'
          default:
            return 'lift'
        }
      })
    }, 4000) // Complete cycle every 4 seconds

    return () => clearInterval(interval)
  }, [isActive])

  const getShoulderPosition = () => {
    switch (phase) {
      case 'lift': return 'translate-y-[-10px]'
      case 'hold': return 'translate-y-[-10px]'
      case 'lower': return 'translate-y-0'
      case 'rest': return 'translate-y-0'
    }
  }

  const getInstruction = () => {
    switch (phase) {
      case 'lift': return 'Lift shoulders up to ears'
      case 'hold': return 'Hold the tension'
      case 'lower': return 'Lower shoulders slowly'
      case 'rest': return 'Relax and breathe'
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const startExercise = () => {
    setIsActive(true)
    setCurrentRep(0)
    setTotalReps(0)
    setTimeElapsed(0)
    setPhase('lift')
  }

  const pauseExercise = () => {
    setIsActive(false)
  }

  const resetExercise = () => {
    setIsActive(false)
    setCurrentRep(0)
    setTotalReps(0)
    setTimeElapsed(0)
    setPhase('lift')
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Shoulder Shrugs</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">Rhythmic shoulder movements to release upper back tension</p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm font-semibold">Time: {formatTime(timeElapsed)}</div>
          <div className="text-sm font-semibold">Reps: {totalReps}</div>
        </div>

        {/* Shoulder Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Body outline */}
            <div className="w-24 h-32 bg-gradient-to-b from-pink-200 to-pink-300 rounded-t-full relative">
              {/* Head */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-b from-pink-100 to-pink-200 rounded-full">
                {/* Face features */}
                <div className="absolute top-3 left-2 w-1 h-1 bg-gray-600 rounded-full"></div>
                <div className="absolute top-3 right-2 w-1 h-1 bg-gray-600 rounded-full"></div>
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-gray-600 rounded-full"></div>
              </div>
              
              {/* Animated Shoulders */}
              <div 
                className={`absolute -top-2 left-0 right-0 h-8 bg-gradient-to-r from-orange-300 to-red-300 rounded-t-lg transition-transform duration-1000 ease-in-out ${getShoulderPosition()}`}
              >
                {/* Shoulder indicators */}
                <div className="absolute top-1 left-2 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <div className="absolute top-1 right-2 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              </div>
              
              {/* Arms */}
              <div className="absolute top-4 -left-4 w-6 h-16 bg-gradient-to-b from-pink-200 to-pink-300 rounded-full"></div>
              <div className="absolute top-4 -right-4 w-6 h-16 bg-gradient-to-b from-pink-200 to-pink-300 rounded-full"></div>
            </div>

            {/* Movement indicator */}
            {isActive && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <div className={`text-2xl transition-all duration-1000 ${
                  phase === 'lift' || phase === 'hold' ? 'animate-bounce text-orange-500' : 'text-gray-400'
                }`}>
                  ↑
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Current Phase Display */}
        <Card className={`p-4 mb-6 bg-gradient-to-r ${
          phase === 'lift' ? 'from-orange-100 to-red-100' :
          phase === 'hold' ? 'from-red-100 to-pink-100' :
          phase === 'lower' ? 'from-green-100 to-blue-100' :
          'from-blue-100 to-purple-100'
        }`}>
          <div className="text-center">
            <h4 className="text-lg font-bold mb-2">{phase.toUpperCase()}</h4>
            <p className="text-sm">{getInstruction()}</p>
          </div>
        </Card>

        {/* Exercise Progress */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {['Lift', 'Hold', 'Lower', 'Rest'].map((step, index) => (
            <div
              key={index}
              className={`text-center p-2 rounded-lg transition-all duration-300 ${
                ['lift', 'hold', 'lower', 'rest'][index] === phase
                  ? 'bg-orange-200 scale-105 ring-2 ring-orange-400'
                  : 'bg-gray-100'
              }`}
            >
              <div className="text-xs font-medium">{step}</div>
              {['lift', 'hold', 'lower', 'rest'][index] === phase && isActive && (
                <div className="w-2 h-2 bg-orange-500 rounded-full mx-auto mt-1 animate-pulse"></div>
              )}
            </div>
          ))}
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
                Start
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

        {/* Instructions */}
        <div className="bg-orange-50 p-4 rounded-lg mb-4">
          <h5 className="font-semibold text-orange-800 mb-2">💡 Exercise Tips:</h5>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>• Lift shoulders straight up toward your ears</li>
            <li>• Hold the tension for 1 second</li>
            <li>• Lower shoulders slowly and deliberately</li>
            <li>• Breathe normally throughout the movement</li>
          </ul>
        </div>

        <div className="p-3 bg-red-50 rounded-lg">
          <p className="text-sm text-red-800 text-center">
            <strong>🤷‍♀️ Benefits:</strong> Loosens upper back • Reduces shoulder tension • Improves posture • Relieves neck strain
          </p>
        </div>
      </Card>
    </div>
  )
}