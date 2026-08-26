"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw } from "lucide-react"
import { MobileFriendlyWrapper, useTapDetection } from "../utils/mobile-touch-utils"

interface CalmReflexTapProps {
  onBack: () => void
}

interface ColorTarget {
  id: number
  color: string
  bgColor: string
  x: number
  y: number
  active: boolean
}

export default function CalmReflexTap({ onBack }: CalmReflexTapProps) {
  const [gameActive, setGameActive] = useState(false)
  const [currentTarget, setCurrentTarget] = useState<ColorTarget | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [speed, setSpeed] = useState(2000) // Start slow for patience training

  const colors = [
    { color: 'Red', bgColor: 'bg-red-400' },
    { color: 'Blue', bgColor: 'bg-blue-400' },
    { color: 'Green', bgColor: 'bg-green-400' },
    { color: 'Yellow', bgColor: 'bg-yellow-400' },
    { color: 'Purple', bgColor: 'bg-purple-400' },
    { color: 'Orange', bgColor: 'bg-orange-400' }
  ]

  const generateTarget = useCallback(() => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    const newTarget: ColorTarget = {
      id: Date.now(),
      color: randomColor.color,
      bgColor: randomColor.bgColor,
      x: Math.random() * 200 + 50,
      y: Math.random() * 200 + 50,
      active: true
    }
    setCurrentTarget(newTarget)

    // Remove target after speed duration
    setTimeout(() => {
      setCurrentTarget(null)
      setStreak(0) // Reset streak if missed
    }, speed)
  }, [speed])

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const gameTimer = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)

      return () => clearTimeout(gameTimer)
    } else if (timeLeft === 0) {
      setGameActive(false)
    }
  }, [gameActive, timeLeft])

  useEffect(() => {
    if (gameActive) {
      const targetInterval = setInterval(() => {
        if (!currentTarget) {
          generateTarget()
        }
      }, speed + 500)

      return () => clearInterval(targetInterval)
    }
  }, [gameActive, currentTarget, generateTarget, speed])

  const tapTarget = (targetId: number) => {
    if (currentTarget && currentTarget.id === targetId && currentTarget.active) {
      setScore(prev => prev + 10)
      setStreak(prev => prev + 1)
      setCurrentTarget(null)
      
      // Gradually increase speed (decrease interval) as streak increases
      if (streak > 0 && streak % 5 === 0 && speed > 1000) {
        setSpeed(prev => Math.max(prev - 200, 1000))
      }
    }
  }

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setStreak(0)
    setTimeLeft(30)
    setSpeed(2000)
    setCurrentTarget(null)
  }

  const pauseGame = () => {
    setGameActive(false)
  }

  const resetGame = () => {
    setGameActive(false)
    setScore(0)
    setStreak(0)
    setTimeLeft(30)
    setSpeed(2000)
    setCurrentTarget(null)
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="mobile-heading text-gray-800 dark:text-gray-100 mb-2">Calm Reflex Tap</h3>
        <p className="mobile-text text-gray-600 dark:text-gray-300">Tap colors slowly and mindfully - patience is key!</p>
      </div>

      <Card className="mobile-card bg-gradient-to-br from-green-50 to-blue-50">
        <div className="flex justify-between items-center mb-4">
          <div className="mobile-subtext font-semibold">Score: {score}</div>
          <div className="mobile-subtext font-semibold">Streak: {streak}</div>
          <div className="mobile-subtext font-semibold">Time: {timeLeft}s</div>
        </div>

        {/* Game Area */}
        <MobileFriendlyWrapper className="relative w-full h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 overflow-hidden mb-4">
          {currentTarget && (
            <div
              className={`absolute w-16 h-16 rounded-full cursor-pointer transition-all duration-500 ${currentTarget.bgColor} shadow-lg animate-pulse flex items-center justify-center text-white font-bold text-xs touch-manipulation`}
              style={{
                left: `${currentTarget.x}px`,
                top: `${currentTarget.y}px`,
                animation: 'pulse 1s infinite, glow 2s infinite',
                touchAction: 'manipulation',
                minWidth: '64px',
                minHeight: '64px'
              }}
              onClick={() => tapTarget(currentTarget.id)}
              onTouchEnd={(e) => { e.preventDefault(); tapTarget(currentTarget.id) }}
            >
              {currentTarget.color}
            </div>
          )}
          
          {!gameActive && timeLeft === 30 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
              <div className="text-center">
                <p className="text-gray-600 mb-4">Tap the colored circles as they appear</p>
                <p className="text-sm text-gray-500 mb-4">Go slow - this trains patience!</p>
                <Button 
                  onClick={startGame} 
                  onTouchEnd={(e) => { e.preventDefault(); startGame() }}
                  size="lg"
                  className="touch-manipulation bg-green-500 hover:bg-green-600"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Game
                </Button>
              </div>
            </div>
          )}

          {timeLeft === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
              <div className="text-center bg-white p-6 rounded-lg shadow-lg">
                <h4 className="text-lg font-bold mb-2">Game Over!</h4>
                <p className="text-gray-600 mb-2">Final Score: {score}</p>
                <p className="text-gray-600 mb-4">Best Streak: {streak}</p>
                <Button 
                  onClick={startGame} 
                  onTouchEnd={(e) => { e.preventDefault(); startGame() }}
                  size="lg"
                  className="touch-manipulation bg-green-500 hover:bg-green-600"
                >
                  Play Again
                </Button>
              </div>
            </div>
          )}
        </MobileFriendlyWrapper>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={gameActive ? pauseGame : startGame}
              onTouchEnd={(e) => { e.preventDefault(); gameActive ? pauseGame() : startGame() }}
              disabled={timeLeft === 0}
              size="lg"
              className="touch-manipulation"
            >
              {gameActive ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  {timeLeft === 30 ? 'Start' : 'Resume'}
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={resetGame} 
              onTouchEnd={(e) => { e.preventDefault(); resetGame() }}
              size="lg"
              className="touch-manipulation"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
          
          <div className="mobile-subtext text-gray-500 text-right">
            Speed Level: {Math.floor((2000 - speed) / 200) + 1}
          </div>
        </div>

        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800 text-center">
            <strong>🧘 Benefits:</strong> Trains patience • Suppresses hyperactivity • Improves focus control
          </p>
        </div>
      </Card>

      <style jsx>{`
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8); }
        }
      `}</style>
    </div>
  )
}