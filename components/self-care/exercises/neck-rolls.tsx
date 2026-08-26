"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, RotateCw } from "lucide-react"
import { MobileFriendlyWrapper } from "../utils/mobile-touch-utils"

interface NeckRollsProps {
  onBack: () => void
}

export default function NeckRolls({ onBack }: NeckRollsProps) {
  const [isActive, setIsActive] = useState(false)
  const [direction, setDirection] = useState<'clockwise' | 'counterclockwise'>('clockwise')
  const [currentPosition, setCurrentPosition] = useState(0)
  const [completedRolls, setCompletedRolls] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)

  const positions = [
    { name: 'Center', instruction: 'Head straight, chin parallel to floor', angle: 0 },
    { name: 'Right', instruction: 'Gently turn head to the right', angle: 45 },
    { name: 'Back Right', instruction: 'Tilt head back and to the right', angle: 90 },
    { name: 'Back', instruction: 'Tilt head gently backward', angle: 135 },
    { name: 'Back Left', instruction: 'Tilt head back and to the left', angle: 180 },
    { name: 'Left', instruction: 'Gently turn head to the left', angle: 225 },
    { name: 'Front Left', instruction: 'Tilt head forward and to the left', angle: 270 },
    { name: 'Front', instruction: 'Gently lower chin toward chest', angle: 315 }
  ]

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
      
      setCurrentPosition(prev => {
        const nextPosition = direction === 'clockwise' 
          ? (prev + 1) % positions.length
          : prev === 0 ? positions.length - 1 : prev - 1
        
        // Complete a roll when we return to center
        if (nextPosition === 0 && prev !== 0) {
          setCompletedRolls(prevRolls => prevRolls + 1)
        }
        
        return nextPosition
      })
    }, 2000) // Change position every 2 seconds

    return () => clearInterval(interval)
  }, [isActive, direction])

  const startExercise = () => {
    setIsActive(true)
    setCurrentPosition(0)
    setTimeElapsed(0)
  }

  const pauseExercise = () => {
    setIsActive(false)
  }

  const resetExercise = () => {
    setIsActive(false)
    setCurrentPosition(0)
    setCompletedRolls(0)
    setTimeElapsed(0)
  }

  const toggleDirection = () => {
    setDirection(prev => prev === 'clockwise' ? 'counterclockwise' : 'clockwise')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const currentPos = positions[currentPosition]
  const headRotation = direction === 'clockwise' ? currentPos.angle : -currentPos.angle

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Neck Rolls Exercise</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">Gentle neck movements to release tension</p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm font-semibold">Time: {formatTime(timeElapsed)}</div>
          <div className="text-sm font-semibold">Rolls: {completedRolls}</div>
        </div>

        {/* Neck Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Shoulders */}
            <div className="w-32 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-t-full"></div>
            
            {/* Neck */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
              <div className="w-8 h-12 bg-gradient-to-b from-pink-200 to-pink-300 rounded-lg"></div>
            </div>
            
            {/* Head */}
            <div 
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-16 transition-transform duration-2000 ease-in-out"
              style={{ transform: `translate(-50%, -4rem) rotate(${headRotation}deg)` }}
            >
              <div className="w-16 h-20 bg-gradient-to-b from-pink-100 to-pink-200 rounded-full relative">
                {/* Face features */}
                <div className="absolute top-6 left-4 w-2 h-2 bg-gray-600 rounded-full"></div>
                <div className="absolute top-6 right-4 w-2 h-2 bg-gray-600 rounded-full"></div>
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-gray-500 rounded-full"></div>
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-gray-600 rounded-full"></div>
              </div>
            </div>

            {/* Direction indicator */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <div className={`text-2xl ${isActive ? 'animate-spin' : ''}`} style={{ animationDuration: '16s' }}>
                {direction === 'clockwise' ? '↻' : '↺'}
              </div>
            </div>
          </div>
        </div>

        {/* Current Position Info */}
        <Card className="p-4 bg-white mb-6">
          <div className="text-center">
            <h4 className="text-lg font-bold text-blue-600 mb-2">{currentPos.name}</h4>
            <p className="text-sm text-gray-600">{currentPos.instruction}</p>
            {isActive && (
              <div className="mt-2 text-xs text-blue-500">
                Hold this position gently for 2 seconds
              </div>
            )}
          </div>
        </Card>

        {/* Position Progress */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {positions.map((position, index) => (
            <div
              key={index}
              className={`text-center p-2 rounded-lg transition-all duration-300 ${
                index === currentPosition
                  ? 'bg-blue-200 scale-105 ring-2 ring-blue-400'
                  : 'bg-gray-100'
              }`}
            >
              <div className="text-xs font-medium">{position.name}</div>
              {index === currentPosition && isActive && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1 animate-pulse"></div>
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
            className={`touch-manipulation ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
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
            onClick={toggleDirection} 
            onTouchEnd={(e) => { e.preventDefault(); toggleDirection() }}
            disabled={isActive}
            size="lg"
            className="touch-manipulation"
          >
            {direction === 'clockwise' ? (
              <>
                <RotateCw className="w-4 h-4 mr-2" />
                Clockwise
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4 mr-2" />
                Counter-clockwise
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

        {/* Safety Instructions */}
        <div className="bg-yellow-50 p-4 rounded-lg mb-4">
          <h5 className="font-semibold text-yellow-800 mb-2">⚠️ Safety Tips:</h5>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Move slowly and gently - never force the movement</li>
            <li>• Stop if you feel any pain or dizziness</li>
            <li>• Keep movements smooth and controlled</li>
            <li>• Breathe normally throughout the exercise</li>
          </ul>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 text-center">
            <strong>💆‍♀️ Benefits:</strong> Releases neck tension • Improves flexibility • Reduces headaches • Better posture
          </p>
        </div>
      </Card>
    </div>
  )
}