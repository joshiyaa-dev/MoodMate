"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"
import { MobileFriendlyWrapper, useTapDetection } from "../utils/mobile-touch-utils"

interface BreatheSyncBubbleProps {
  onBack: () => void
}

export default function BreatheSyncBubble({ onBack }: BreatheSyncBubbleProps) {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const [count, setCount] = useState(0)
  const [cycles, setCycles] = useState(0)

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setCount(prev => {
        const newCount = prev + 1
        
        if (phase === 'inhale' && newCount >= 4) {
          setPhase('hold')
          return 0
        } else if (phase === 'hold' && newCount >= 2) {
          setPhase('exhale')
          return 0
        } else if (phase === 'exhale' && newCount >= 6) {
          setPhase('inhale')
          setCycles(prev => prev + 1)
          return 0
        }
        
        return newCount
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, phase])

  const getBubbleSize = () => {
    if (phase === 'inhale') {
      return 100 + (count * 30) // Grows from 100px to 220px
    } else if (phase === 'hold') {
      return 220 // Stays at max size
    } else {
      return 220 - (count * 30) // Shrinks back to 100px
    }
  }

  const getBubbleColor = () => {
    switch (phase) {
      case 'inhale': return 'from-blue-400 to-cyan-400'
      case 'hold': return 'from-purple-400 to-blue-400'
      case 'exhale': return 'from-green-400 to-teal-400'
    }
  }

  const getInstruction = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In...'
      case 'hold': return 'Hold...'
      case 'exhale': return 'Breathe Out...'
    }
  }

  const toggleBreathing = () => {
    setIsActive(!isActive)
    if (!isActive) {
      setCount(0)
      setPhase('inhale')
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Breathe Sync Bubble</h3>
        <p className="text-xs text-gray-600 dark:text-gray-300">Sync your breathing with the expanding bubble</p>
      </div>

      <Card className="mobile-card bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center mb-4">
          <div className="text-xs text-gray-600 mb-2">Cycles completed: {cycles}</div>
        </div>

        {/* Breathing Bubble */}
        <div className="flex flex-col items-center space-y-6">
          <div 
            className="relative flex items-center justify-center select-none" 
            style={{ height: '200px' }}
          >
            <MobileFriendlyWrapper 
              className="w-full h-full flex items-center justify-center"
              onTap={() => toggleBreathing()}
            >
            <div
              className={`rounded-full bg-gradient-to-br ${getBubbleColor()} transition-all duration-1000 ease-in-out flex items-center justify-center shadow-2xl cursor-pointer`}
              style={{
                width: `${getBubbleSize()}px`,
                height: `${getBubbleSize()}px`,
                filter: 'blur(0.5px)',
                boxShadow: `0 0 ${getBubbleSize() / 4}px rgba(59, 130, 246, 0.5)`,
                touchAction: 'manipulation'
              }}
              onClick={toggleBreathing}
              onTouchEnd={(e) => { e.preventDefault(); toggleBreathing() }}
            >
              <div className="text-white font-bold text-lg opacity-80">
                {count + 1}
              </div>
            </div>
            
            {/* Ripple effect */}
            {isActive && (
              <div
                className="absolute rounded-full border-2 border-blue-300 opacity-30 animate-ping"
                style={{
                  width: `${getBubbleSize() + 40}px`,
                  height: `${getBubbleSize() + 40}px`
                }}
              />
            )}
            </MobileFriendlyWrapper>
          </div>

          <div className="text-center space-y-3">
            <div className="text-lg sm:text-xl font-bold text-gray-700">
              {getInstruction()}
            </div>
            
            <div className="text-sm sm:text-base text-gray-600">
              {phase === 'inhale' && 'Expand your chest slowly'}
              {phase === 'hold' && 'Keep the air in your lungs'}
              {phase === 'exhale' && 'Release the air gently'}
            </div>

            <Button
              onClick={toggleBreathing}
              onTouchEnd={(e) => { e.preventDefault(); toggleBreathing() }}
              size="lg"
              className={`touch-manipulation w-32 ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
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
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800 text-center">
            <strong>💨 Benefits:</strong> Controls panic attacks • Improves oxygen flow • Reduces anxiety
          </p>
        </div>
      </Card>
    </div>
  )
}