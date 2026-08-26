"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw, Play, Pause } from "lucide-react"

interface TappingBallMobileProps {
  onBack: () => void
}

interface Ball {
  id: number
  x: number
  y: number
  size: number
  color: string
  glowing: boolean
  animation: string
}

export default function TappingBallMobile({ onBack }: TappingBallMobileProps) {
  const [balls, setBalls] = useState<Ball[]>([])
  const [score, setScore] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [level, setLevel] = useState(1)
  const [gameTime, setGameTime] = useState(0)
  const gameAreaRef = useRef<HTMLDivElement>(null)

  const colors = [
    { bg: 'bg-red-400', shadow: 'shadow-red-200', glow: 'shadow-red-400' },
    { bg: 'bg-blue-400', shadow: 'shadow-blue-200', glow: 'shadow-blue-400' },
    { bg: 'bg-green-400', shadow: 'shadow-green-200', glow: 'shadow-green-400' },
    { bg: 'bg-yellow-400', shadow: 'shadow-yellow-200', glow: 'shadow-yellow-400' },
    { bg: 'bg-purple-400', shadow: 'shadow-purple-200', glow: 'shadow-purple-400' },
    { bg: 'bg-pink-400', shadow: 'shadow-pink-200', glow: 'shadow-pink-400' }
  ]

  const generateBall = useCallback(() => {
    const gameArea = gameAreaRef.current
    if (!gameArea) return

    const containerRect = gameArea.getBoundingClientRect()
    const containerWidth = containerRect.width
    const containerHeight = containerRect.height
    
    // Ensure balls stay within safe area with padding
    const padding = 30
    const ballSize = Math.min(containerWidth, containerHeight) * 0.12 + Math.random() * 20

    const newBall: Ball = {
      id: Date.now() + Math.random(),
      x: Math.random() * (containerWidth - ballSize - padding * 2) + padding,
      y: Math.random() * (containerHeight - ballSize - padding * 2) + padding,
      size: ballSize,
      color: colors[Math.floor(Math.random() * colors.length)].bg,
      glowing: true,
      animation: 'animate-pulse'
    }
    
    setBalls(prev => [...prev, newBall])

    // Remove ball after 2.5 seconds if not tapped (faster for mobile)
    setTimeout(() => {
      setBalls(prev => prev.filter(ball => ball.id !== newBall.id))
    }, 2500)
  }, [])

  const handleBallTap = (ballId: number) => {
    setBalls(prev => prev.filter(ball => ball.id !== ballId))
    setScore(prev => prev + 10)
    
    // Haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
  }

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setGameTime(0)
    setBalls([])
    setLevel(1)
  }

  const pauseGame = () => {
    setGameActive(!gameActive)
  }

  const resetGame = () => {
    setGameActive(false)
    setBalls([])
    setScore(0)
    setGameTime(0)
    setLevel(1)
  }

  useEffect(() => {
    if (gameActive) {
      const gameTimer = setInterval(() => {
        setGameTime(prev => prev + 1)
      }, 1000)
      
      return () => clearInterval(gameTimer)
    }
  }, [gameActive])

  useEffect(() => {
    if (gameActive) {
      // Dynamic generation speed based on level and screen size
      const baseInterval = 1500
      const levelMultiplier = Math.max(0.3, 1 - (level - 1) * 0.1)
      const interval = baseInterval * levelMultiplier
      
      const ballInterval = setInterval(() => {
        generateBall()
      }, interval)

      return () => clearInterval(ballInterval)
    }
  }, [gameActive, level, generateBall])

  // Level progression
  useEffect(() => {
    const newLevel = Math.floor(score / 100) + 1
    if (newLevel !== level) {
      setLevel(newLevel)
    }
  }, [score, level])

  return (
    <div className="mobile-container min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="touch-target"
          >
            ← Back
          </Button>
          <h2 className="mobile-heading font-bold text-purple-800 dark:text-purple-200">
            Tapping Ball
          </h2>
          <div className="w-16"></div>
        </div>

        {/* Game Stats */}
        <Card className="mobile-card mb-4 bg-white/80 backdrop-blur">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="mobile-subtext text-gray-600 dark:text-gray-400">Score</div>
              <div className="mobile-text font-bold text-purple-600">{score}</div>
            </div>
            <div>
              <div className="mobile-subtext text-gray-600 dark:text-gray-400">Level</div>
              <div className="mobile-text font-bold text-green-600">{level}</div>
            </div>
            <div>
              <div className="mobile-subtext text-gray-600 dark:text-gray-400">Time</div>
              <div className="mobile-text font-bold text-blue-600">{gameTime}s</div>
            </div>
          </div>
        </Card>

        {/* Game Controls */}
        <div className="flex gap-2 mb-4">
          {!gameActive ? (
            <Button 
              onClick={startGame} 
              className="flex-1 touch-target bg-green-500 hover:bg-green-600"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Game
            </Button>
          ) : (
            <Button 
              onClick={pauseGame} 
              className="flex-1 touch-target bg-yellow-500 hover:bg-yellow-600"
              size="lg"
            >
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </Button>
          )}
          
          <Button 
            onClick={resetGame} 
            variant="outline"
            size="lg"
            className="touch-target"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>

        {/* Game Area - Responsive Mobile Container */}
        <Card className="mobile-card p-0 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
          <div 
            ref={gameAreaRef}
            className="relative w-full touch-manipulation"
            style={{ 
              height: 'min(60vh, 400px)', // Responsive height
              minHeight: '300px'
            }}
          >
            {balls.map((ball) => {
              const colorClass = colors.find(c => c.bg === ball.color) || colors[0]
              
              return (
                <button
                  key={ball.id}
                  className={`absolute rounded-full transition-all duration-200 touch-target
                    ${ball.color} ${ball.glowing ? `${colorClass.glow} ${ball.animation}` : colorClass.shadow}
                    hover:scale-110 active:scale-95 border-2 border-white
                    shadow-lg active:shadow-xl z-10`}
                  style={{
                    left: `${ball.x}px`,
                    top: `${ball.y}px`,
                    width: `${ball.size}px`,
                    height: `${ball.size}px`,
                    transform: ball.glowing ? 'scale(1.1)' : 'scale(1)'
                  }}
                  onClick={() => handleBallTap(ball.id)}
                  onTouchStart={() => handleBallTap(ball.id)}
                >
                  <span className="text-white font-bold text-xs">
                    {ball.glowing ? '✨' : '⭐'}
                  </span>
                </button>
              )
            })}
            
            {/* Game Instructions Overlay */}
            {!gameActive && balls.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-6 bg-white/90 rounded-lg shadow-lg backdrop-blur max-w-xs">
                  <div className="text-4xl mb-2">🎯</div>
                  <h3 className="mobile-text font-bold text-gray-800 mb-2">
                    Tap the Glowing Balls!
                  </h3>
                  <p className="mobile-subtext text-gray-600">
                    Quick reflexes reduce anxiety and improve focus. 
                    Tap as many balls as you can!
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Benefits Card */}
        <Card className="mobile-card mt-4 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <div className="text-center">
            <div className="text-2xl mb-2">🧠</div>
            <h4 className="font-semibold mobile-text text-green-800 mb-1">Benefits</h4>
            <p className="mobile-subtext text-green-700">
              Improves hand-eye coordination • Reduces anxiety • Enhances focus • Quick stress relief through rhythmic tapping
            </p>
            <div className="mt-2 flex justify-center space-x-4">
              <span className="mobile-subtext text-green-600">🎯 Coordination</span>
              <span className="mobile-subtext text-blue-600">🧘 Mindfulness</span>
              <span className="mobile-subtext text-purple-600">⚡ Reflexes</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}