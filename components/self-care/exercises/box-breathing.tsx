"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw } from "lucide-react"
import { MobileFriendlyWrapper } from "../utils/mobile-touch-utils"

interface BoxBreathingProps {
  onBack: () => void
}

export default function BoxBreathing({ onBack }: BoxBreathingProps) {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale')
  const [count, setCount] = useState(0)
  const [cycles, setCycles] = useState(0)

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setCount(prev => {
        const newCount = prev + 1
        
        if (newCount >= 4) {
          // Move to next phase after 4 seconds
          setPhase(currentPhase => {
            switch (currentPhase) {
              case 'inhale': return 'hold1'
              case 'hold1': return 'exhale'
              case 'exhale': return 'hold2'
              case 'hold2': 
                setCycles(prev => prev + 1)
                return 'inhale'
              default: return 'inhale'
            }
          })
          return 0
        }
        
        return newCount
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive])

  const getBoxAnimation = () => {
    const baseSize = 120
    const expandSize = 180
    
    switch (phase) {
      case 'inhale':
        return {
          width: baseSize + (count * 15),
          height: baseSize + (count * 15),
          borderColor: '#3B82F6' // blue
        }
      case 'hold1':
        return {
          width: expandSize,
          height: expandSize,
          borderColor: '#8B5CF6' // purple
        }
      case 'exhale':
        return {
          width: expandSize - (count * 15),
          height: expandSize - (count * 15),
          borderColor: '#10B981' // green
        }
      case 'hold2':
        return {
          width: baseSize,
          height: baseSize,
          borderColor: '#F59E0B' // yellow
        }
    }
  }

  const getInstruction = () => {
    switch (phase) {
      case 'inhale': return 'Inhale'
      case 'hold1': return 'Hold'
      case 'exhale': return 'Exhale'
      case 'hold2': return 'Hold'
    }
  }

  const getDetailedInstruction = () => {
    switch (phase) {
      case 'inhale': return 'Breathe in slowly through your nose'
      case 'hold1': return 'Hold the breath in your lungs'
      case 'exhale': return 'Breathe out slowly through your mouth'
      case 'hold2': return 'Hold with empty lungs'
    }
  }

  const toggleBreathing = () => {
    setIsActive(!isActive)
    if (!isActive) {
      setCount(0)
      setPhase('inhale')
    }
  }

  const resetBreathing = () => {
    setIsActive(false)
    setCount(0)
    setPhase('inhale')
    setCycles(0)
  }

  const boxStyle = getBoxAnimation()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Box Breathing</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">4-4-4-4 breathing pattern for stress reduction</p>
      </div>

      <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center mb-6">
          <div className="text-sm text-gray-600 mb-2">Cycles completed: {cycles}</div>
        </div>

        {/* Breathing Box Animation */}
        <div className="flex flex-col items-center space-y-8">
          <div className="relative flex items-center justify-center" style={{ height: '220px' }}>
            {/* Main breathing box */}
            <div
              className="border-4 transition-all duration-1000 ease-in-out flex items-center justify-center relative"
              style={{
                width: `${boxStyle.width}px`,
                height: `${boxStyle.height}px`,
                borderColor: boxStyle.borderColor,
                borderRadius: '8px'
              }}
            >
              {/* Corner dots to show box structure */}
              <div className="absolute top-0 left-0 w-3 h-3 bg-current rounded-full transform -translate-x-1.5 -translate-y-1.5"></div>
              <div className="absolute top-0 right-0 w-3 h-3 bg-current rounded-full transform translate-x-1.5 -translate-y-1.5"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 bg-current rounded-full transform -translate-x-1.5 translate-y-1.5"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-current rounded-full transform translate-x-1.5 translate-y-1.5"></div>
              
              {/* Center counter */}
              <div className="text-2xl font-bold" style={{ color: boxStyle.borderColor }}>
                {count + 1}
              </div>
            </div>
            
            {/* Phase indicator arrows */}
            {phase === 'inhale' && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
                <div className="text-blue-500 animate-bounce">↑</div>
              </div>
            )}
            {phase === 'exhale' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8">
                <div className="text-green-500 animate-bounce">↓</div>
              </div>
            )}
          </div>

          <div className="text-center space-y-4">
            <div className="text-2xl font-bold" style={{ color: boxStyle.borderColor }}>
              {getInstruction()}
            </div>
            
            <div className="text-lg text-gray-600">
              {getDetailedInstruction()}
            </div>

            <div className="flex space-x-4 justify-center">
              <Button
                onClick={toggleBreathing}
                onTouchEnd={(e) => { e.preventDefault(); toggleBreathing() }}
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
                onClick={resetBreathing}
                onTouchEnd={(e) => { e.preventDefault(); resetBreathing() }}
                size="lg"
                className="touch-manipulation"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 text-center">
            <strong>📦 Benefits:</strong> Reduces stress • Increases mental clarity • Balances nervous system • Improves focus
          </p>
        </div>
      </Card>
    </div>
  )
}