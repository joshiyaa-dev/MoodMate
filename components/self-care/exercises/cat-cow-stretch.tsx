"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw } from "lucide-react"
import { MobileFriendlyWrapper } from "../utils/mobile-touch-utils"

interface CatCowStretchProps {
  onBack: () => void
}

export default function CatCowStretch({ onBack }: CatCowStretchProps) {
  const [isActive, setIsActive] = useState(false)
  const [position, setPosition] = useState<'cat' | 'cow'>('cat')
  const [cycles, setCycles] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
      
      setPosition(currentPos => {
        const newPos = currentPos === 'cat' ? 'cow' : 'cat'
        if (newPos === 'cat') {
          setCycles(prev => prev + 1)
        }
        return newPos
      })
    }, 3000) // Change position every 3 seconds

    return () => clearInterval(interval)
  }, [isActive])

  const startExercise = () => {
    setIsActive(true)
    setCycles(0)
    setTimeElapsed(0)
    setPosition('cat')
  }

  const pauseExercise = () => {
    setIsActive(false)
  }

  const resetExercise = () => {
    setIsActive(false)
    setCycles(0)
    setTimeElapsed(0)
    setPosition('cat')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getSpinePosition = () => {
    return position === 'cat' ? 'translate-y-[-8px]' : 'translate-y-[8px]'
  }

  const getHeadPosition = () => {
    return position === 'cat' ? 'translate-y-[4px]' : 'translate-y-[-4px]'
  }

  const getInstruction = () => {
    if (position === 'cat') {
      return {
        title: 'CAT POSE',
        instruction: 'Arch your back up like a cat',
        details: 'Round your spine toward the ceiling, tuck chin to chest'
      }
    } else {
      return {
        title: 'COW POSE', 
        instruction: 'Drop your belly down like a cow',
        details: 'Arch your back down, lift head and tailbone up'
      }
    }
  }

  const currentInstruction = getInstruction()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Cat-Cow Stretch</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">Gentle spine movement to ease back tension</p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm font-semibold">Time: {formatTime(timeElapsed)}</div>
          <div className="text-sm font-semibold">Cycles: {cycles}</div>
        </div>

        {/* Cat-Cow Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Person on hands and knees */}
            <div className="relative">
              {/* Arms */}
              <div className="absolute top-8 left-4 w-3 h-12 bg-gradient-to-b from-pink-200 to-pink-300 rounded-full transform -rotate-12"></div>
              <div className="absolute top-8 right-4 w-3 h-12 bg-gradient-to-b from-pink-200 to-pink-300 rounded-full transform rotate-12"></div>
              
              {/* Legs */}
              <div className="absolute bottom-0 left-6 w-3 h-12 bg-gradient-to-b from-pink-200 to-pink-300 rounded-full"></div>
              <div className="absolute bottom-0 right-6 w-3 h-12 bg-gradient-to-b from-pink-200 to-pink-300 rounded-full"></div>
              
              {/* Torso/Spine - animated */}
              <div 
                className={`w-24 h-16 bg-gradient-to-b from-pink-100 to-pink-200 rounded-lg transition-transform duration-3000 ease-in-out ${getSpinePosition()}`}
                style={{
                  borderRadius: position === 'cat' ? '50% 50% 20% 20%' : '20% 20% 50% 50%'
                }}
              >
                {/* Spine indicator line */}
                <div 
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-orange-400 rounded-full transition-all duration-3000 ${
                    position === 'cat' ? 'rotate-12' : '-rotate-12'
                  }`}
                />
              </div>
              
              {/* Head - animated */}
              <div 
                className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-b from-pink-100 to-pink-200 rounded-full transition-transform duration-3000 ease-in-out ${getHeadPosition()}`}
              >
                {/* Face features */}
                <div className="absolute top-2 left-2 w-1 h-1 bg-gray-600 rounded-full"></div>
                <div className="absolute top-2 right-2 w-1 h-1 bg-gray-600 rounded-full"></div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-gray-600 rounded-full"></div>
              </div>
            </div>

            {/* Position indicator */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <div className={`text-2xl transition-all duration-3000 ${
                position === 'cat' ? 'text-purple-500' : 'text-orange-500'
              }`}>
                {position === 'cat' ? '🐱' : '🐄'}
              </div>
            </div>

            {/* Movement arrows */}
            {isActive && (
              <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                <div className={`text-xl transition-all duration-3000 ${
                  position === 'cat' ? 'animate-bounce text-purple-500' : 'animate-bounce text-orange-500'
                }`}>
                  {position === 'cat' ? '↑' : '↓'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Current Position Display */}
        <Card className={`p-4 mb-6 bg-gradient-to-r ${
          position === 'cat' ? 'from-purple-100 to-violet-100' : 'from-orange-100 to-yellow-100'
        }`}>
          <div className="text-center">
            <h4 className={`text-lg font-bold mb-2 ${
              position === 'cat' ? 'text-purple-800' : 'text-orange-800'
            }`}>
              {currentInstruction.title}
            </h4>
            <p className={`text-sm mb-1 ${
              position === 'cat' ? 'text-purple-700' : 'text-orange-700'
            }`}>
              {currentInstruction.instruction}
            </p>
            <p className={`text-xs ${
              position === 'cat' ? 'text-purple-600' : 'text-orange-600'
            }`}>
              {currentInstruction.details}
            </p>
          </div>
        </Card>

        {/* Position Progress */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`text-center p-3 rounded-lg transition-all duration-300 ${
            position === 'cat' 
              ? 'bg-purple-200 scale-105 ring-2 ring-purple-400' 
              : 'bg-gray-100'
          }`}>
            <div className="text-2xl mb-1">🐱</div>
            <div className="text-sm font-medium">Cat Pose</div>
            <div className="text-xs text-gray-600">Spine up</div>
          </div>
          <div className={`text-center p-3 rounded-lg transition-all duration-300 ${
            position === 'cow' 
              ? 'bg-orange-200 scale-105 ring-2 ring-orange-400' 
              : 'bg-gray-100'
          }`}>
            <div className="text-2xl mb-1">🐄</div>
            <div className="text-sm font-medium">Cow Pose</div>
            <div className="text-xs text-gray-600">Spine down</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4 mb-4">
          <Button
            onClick={isActive ? pauseExercise : startExercise}
            onTouchEnd={(e) => { e.preventDefault(); isActive ? pauseExercise() : startExercise() }}
            size="lg"
            className={`touch-manipulation ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600'}`}
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Stretch
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
        <div className="bg-yellow-50 p-4 rounded-lg mb-4">
          <h5 className="font-semibold text-yellow-800 mb-2">🧘‍♀️ How to Practice:</h5>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Start on hands and knees in tabletop position</li>
            <li>• Move slowly and breathe deeply with each transition</li>
            <li>• Cat: Round spine up, tuck chin, exhale</li>
            <li>• Cow: Arch spine down, lift head, inhale</li>
            <li>• Keep movements gentle and controlled</li>
          </ul>
        </div>

        <div className="p-3 bg-orange-50 rounded-lg">
          <p className="text-sm text-orange-800 text-center">
            <strong>🐱🐄 Benefits:</strong> Eases spine tension • Improves flexibility • Enhances breathing • Reduces back pain
          </p>
        </div>
      </Card>
    </div>
  )
}