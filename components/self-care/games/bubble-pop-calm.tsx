"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw } from "lucide-react"
import { MobileFriendlyWrapper, useTapDetection } from "../utils/mobile-touch-utils"

interface BubblePopCalmProps {
  onBack: () => void
}

interface Bubble {
  id: number
  x: number
  y: number
  size: number
  word: string
  color: string
  opacity: number
  speed: number
  targetColor: string
}

export default function BubblePopCalm({ onBack }: BubblePopCalmProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [gameActive, setGameActive] = useState(false)
  const [score, setScore] = useState(0)
  const [targetWord, setTargetWord] = useState("")
  const [targetColor, setTargetColor] = useState("")
  const [timeLeft, setTimeLeft] = useState(60)

  const calmWords = [
    "Peace", "Calm", "Breathe", "Relax", "Serenity", "Gentle", "Quiet", 
    "Still", "Soft", "Harmony", "Balance", "Flow", "Rest", "Ease"
  ]

  const calmColors = [
    { name: "Blue", color: "rgba(59, 130, 246, 0.7)", bg: "bg-blue-400" },
    { name: "Green", color: "rgba(16, 185, 129, 0.7)", bg: "bg-green-400" },
    { name: "Purple", color: "rgba(139, 92, 246, 0.7)", bg: "bg-purple-400" },
    { name: "Teal", color: "rgba(20, 184, 166, 0.7)", bg: "bg-teal-400" },
    { name: "Pink", color: "rgba(236, 72, 153, 0.7)", bg: "bg-pink-400" }
  ]

  const generateBubble = useCallback(() => {
    const randomWord = calmWords[Math.floor(Math.random() * calmWords.length)]
    const randomColor = calmColors[Math.floor(Math.random() * calmColors.length)]
    
    const newBubble: Bubble = {
      id: Date.now() + Math.random(),
      x: Math.random() * 250 + 25,
      y: 350, // Start from bottom
      size: Math.random() * 40 + 30,
      word: randomWord,
      color: randomColor.color,
      opacity: 0.7,
      speed: Math.random() * 2 + 1,
      targetColor: randomColor.name
    }
    
    setBubbles(prev => [...prev, newBubble])
  }, [])

  useEffect(() => {
    if (gameActive) {
      // Set new target every 10 seconds
      const targetInterval = setInterval(() => {
        const newTargetWord = calmWords[Math.floor(Math.random() * calmWords.length)]
        const newTargetColor = calmColors[Math.floor(Math.random() * calmColors.length)]
        setTargetWord(newTargetWord)
        setTargetColor(newTargetColor.name)
      }, 10000)

      // Generate bubbles
      const bubbleInterval = setInterval(() => {
        generateBubble()
      }, 2000)

      // Move bubbles up and remove old ones
      const moveInterval = setInterval(() => {
        setBubbles(prev => prev
          .map(bubble => ({ ...bubble, y: bubble.y - bubble.speed }))
          .filter(bubble => bubble.y > -100)
        )
      }, 50)

      // Game timer
      const gameTimer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameActive(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => {
        clearInterval(targetInterval)
        clearInterval(bubbleInterval)
        clearInterval(moveInterval)
        clearInterval(gameTimer)
      }
    }
  }, [gameActive, generateBubble])

  const popBubble = (bubbleId: number, e?: React.TouchEvent | React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    
    const bubble = bubbles.find(b => b.id === bubbleId)
    if (!bubble) return

    const isCorrectWord = bubble.word === targetWord
    const isCorrectColor = bubble.targetColor === targetColor
    
    if (isCorrectWord || isCorrectColor) {
      setScore(prev => prev + (isCorrectWord && isCorrectColor ? 20 : 10))
    }

    setBubbles(prev => prev.filter(b => b.id !== bubbleId))
  }

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setTimeLeft(60)
    setBubbles([])
    const initialTarget = calmWords[Math.floor(Math.random() * calmWords.length)]
    const initialColor = calmColors[Math.floor(Math.random() * calmColors.length)]
    setTargetWord(initialTarget)
    setTargetColor(initialColor.name)
  }

  const pauseGame = () => {
    setGameActive(false)
  }

  const resetGame = () => {
    setGameActive(false)
    setScore(0)
    setTimeLeft(60)
    setBubbles([])
    setTargetWord("")
    setTargetColor("")
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Bubble Pop Calm</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">Pop bubbles with calming words and colors</p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-semibold">Score: {score}</div>
          <div className="text-sm font-semibold">Time: {timeLeft}s</div>
        </div>

        {/* Target Display */}
        {gameActive && (
          <Card className="p-4 mb-4 bg-gradient-to-r from-purple-100 to-blue-100">
            <div className="text-center">
              <h4 className="text-sm font-semibold text-purple-800 mb-2">Pop bubbles with:</h4>
              <div className="flex justify-center space-x-4">
                <div className="bg-white px-3 py-1 rounded-full shadow">
                  <span className="text-sm font-bold text-purple-600">"{targetWord}"</span>
                </div>
                <div className="text-sm text-gray-600">OR</div>
                <div className={`px-3 py-1 rounded-full shadow text-white text-sm font-bold ${
                  calmColors.find(c => c.name === targetColor)?.bg || 'bg-gray-400'
                }`}>
                  {targetColor}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Game Area */}
        <MobileFriendlyWrapper className="relative w-full h-80 bg-gradient-to-b from-sky-100 to-blue-200 rounded-lg border-2 border-blue-200 overflow-hidden">
          {bubbles.map(bubble => {
            const BubbleComponent = () => {
              const { tapHandlers } = useTapDetection((position) => {
                popBubble(bubble.id)
              })
              
              return (
                <div
                  key={bubble.id}
                  className="absolute rounded-full cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center text-white font-bold text-xs shadow-lg select-none"
                  style={{
                    left: `${bubble.x}px`,
                    top: `${bubble.y}px`,
                    width: `${bubble.size}px`,
                    height: `${bubble.size}px`,
                    backgroundColor: bubble.color,
                    opacity: bubble.opacity,
                    animation: 'float 3s ease-in-out infinite, shimmer 2s ease-in-out infinite',
                    touchAction: 'manipulation',
                    userSelect: 'none'
                  }}
                  {...tapHandlers}
                >
                  {bubble.word}
                </div>
              )
            }
            
            return <BubbleComponent key={bubble.id} />
          })}
          
          {!gameActive && timeLeft === 60 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
              <div className="text-center">
                <div className="text-4xl mb-4">🫧</div>
                <p className="text-gray-600 mb-4">Tap bubbles with matching words or colors</p>
                <Button 
                  onClick={startGame} 
                  size="lg"
                  className="bg-blue-500 hover:bg-blue-600 touch-manipulation"
                  onTouchEnd={(e) => { e.preventDefault(); startGame() }}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Floating
                </Button>
              </div>
            </div>
          )}

          {timeLeft === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
              <div className="text-center bg-white p-6 rounded-lg shadow-lg">
                <h4 className="text-lg font-bold mb-2">Peaceful Session Complete!</h4>
                <p className="text-gray-600 mb-2">Final Score: {score}</p>
                <p className="text-sm text-blue-600 mb-4">You found inner calm through focus 🧘‍♀️</p>
                <Button 
                  onClick={startGame} 
                  size="lg"
                  className="bg-blue-500 hover:bg-blue-600 touch-manipulation"
                  onTouchEnd={(e) => { e.preventDefault(); startGame() }}
                >
                  Float Again
                </Button>
              </div>
            </div>
          )}
        </MobileFriendlyWrapper>

        <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="lg"
              className="touch-manipulation"
              onClick={gameActive ? pauseGame : startGame}
              onTouchEnd={(e) => { e.preventDefault(); gameActive ? pauseGame() : startGame() }}
              disabled={timeLeft === 0}
            >
              {gameActive ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  {timeLeft === 60 ? 'Start' : 'Resume'}
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="touch-manipulation"
              onClick={resetGame}
              onTouchEnd={(e) => { e.preventDefault(); resetGame() }}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 text-center">
            <strong>🫧 Benefits:</strong> Visual & motor coordination • Stress relief • Mindful focus • Calming word association
          </p>
          <p className="text-xs text-blue-600 text-center mt-2">
            📱 Mobile: Tap bubbles directly • 🖥️ Desktop: Click bubbles
          </p>
        </div>
      </Card>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.9; }
        }
      `}</style>
    </div>
  )
}