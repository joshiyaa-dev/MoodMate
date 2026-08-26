"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react"
import { MobileFriendlyWrapper, useTapDetection } from "../utils/mobile-touch-utils"

interface AnimatedBoxBreathingMobileProps {
  onBack: () => void
}

export default function AnimatedBoxBreathingMobile({ onBack }: AnimatedBoxBreathingMobileProps) {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale')
  const [count, setCount] = useState(0)
  const [cycles, setCycles] = useState(0)
  const [pulseIntensity, setPulseIntensity] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)

  const phaseInstructions = {
    inhale: { text: 'Breathe In', color: 'text-blue-600', emoji: '💨' },
    hold1: { text: 'Hold', color: 'text-purple-600', emoji: '⏸️' },
    exhale: { text: 'Breathe Out', color: 'text-green-600', emoji: '🌿' },
    hold2: { text: 'Hold', color: 'text-orange-600', emoji: '⏸️' }
  }

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setCount(prev => {
        const newCount = prev + 1
        
        // Update pulse intensity based on phase and count
        if (phase === 'inhale') {
          setPulseIntensity((newCount / 4) * 100)
        } else if (phase === 'hold1') {
          setPulseIntensity(100)
        } else if (phase === 'exhale') {
          setPulseIntensity(100 - (newCount / 4) * 100)
        } else {
          setPulseIntensity(0)
        }
        
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
  }, [isActive, phase])

  // Session timer
  useEffect(() => {
    if (isActive) {
      const timer = setInterval(() => {
        setSessionTime(prev => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isActive])

  const getBoxStyle = () => {
    const baseSize = 120
    const maxSize = 200
    const size = baseSize + (pulseIntensity / 100) * (maxSize - baseSize)
    
    const colors = {
      inhale: { 
        bg: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', 
        shadow: 'rgba(59, 130, 246, 0.4)',
        border: '#1D4ED8'
      },
      hold1: { 
        bg: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', 
        shadow: 'rgba(139, 92, 246, 0.4)',
        border: '#7C3AED'
      },
      exhale: { 
        bg: 'linear-gradient(135deg, #10B981, #059669)', 
        shadow: 'rgba(16, 185, 129, 0.4)',
        border: '#059669'
      },
      hold2: { 
        bg: 'linear-gradient(135deg, #F59E0B, #D97706)', 
        shadow: 'rgba(245, 158, 11, 0.4)',
        border: '#D97706'
      }
    }
    
    return {
      width: `${size}px`,
      height: `${size}px`,
      background: colors[phase].bg,
      borderColor: colors[phase].border,
      boxShadow: `0 0 ${size / 3}px ${colors[phase].shadow}, 0 0 ${size / 6}px ${colors[phase].shadow}`,
      transform: `scale(${0.8 + (pulseIntensity / 100) * 0.4})`,
      transition: 'all 1s ease-in-out'
    }
  }

  const startBreathing = () => {
    setIsActive(true)
    setSessionTime(0)
  }

  const pauseBreathing = () => {
    setIsActive(!isActive)
  }

  const resetBreathing = () => {
    setIsActive(false)
    setPhase('inhale')
    setCount(0)
    setCycles(0)
    setPulseIntensity(0)
    setSessionTime(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Breathing sound effect (placeholder - would need actual audio files)
  const playBreathSound = () => {
    if (soundEnabled && 'speechSynthesis' in window) {
      // Using speech synthesis as a placeholder for breathing sounds
      const utterance = new SpeechSynthesisUtterance('')
      utterance.volume = 0.1
      speechSynthesis.speak(utterance)
    }
  }

  useEffect(() => {
    if (isActive && count === 0) {
      playBreathSound()
    }
  }, [phase, isActive, count])

  return (
    <div className="mobile-container min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900">
      <div className="max-w-md mx-auto pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            onTouchEnd={(e) => { e.preventDefault(); onBack() }}
            className="touch-manipulation"
          >
            ← Back
          </Button>
          <h2 className="mobile-heading font-bold text-blue-800 dark:text-blue-200">
            Box Breathing
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            onTouchEnd={(e) => { e.preventDefault(); setSoundEnabled(!soundEnabled) }}
            className="touch-manipulation"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
        </div>

        {/* Session Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="mobile-card text-center bg-white/80 backdrop-blur">
            <div className="mobile-subtext text-gray-600 dark:text-gray-400">Time</div>
            <div className="mobile-text font-bold text-blue-600">{formatTime(sessionTime)}</div>
          </Card>
          <Card className="mobile-card text-center bg-white/80 backdrop-blur">
            <div className="mobile-subtext text-gray-600 dark:text-gray-400">Cycles</div>
            <div className="mobile-text font-bold text-purple-600">{cycles}</div>
          </Card>
          <Card className="mobile-card text-center bg-white/80 backdrop-blur">
            <div className="mobile-subtext text-gray-600 dark:text-gray-400">Count</div>
            <div className="mobile-text font-bold text-green-600">{4 - count}</div>
          </Card>
        </div>

        {/* Main Breathing Animation */}
        <Card className="mobile-card mb-6 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur">
          <div className="flex flex-col items-center py-8">
            {/* Phase Instruction */}
            <div className="text-center mb-6">
              <div className="text-3xl mb-2">{phaseInstructions[phase].emoji}</div>
              <h3 className={`text-2xl font-bold ${phaseInstructions[phase].color} mb-1`}>
                {phaseInstructions[phase].text}
              </h3>
              <div className="text-4xl font-mono text-gray-600 dark:text-gray-300">
                {4 - count}
              </div>
            </div>

            {/* Animated Breathing Box */}
            <div className="flex items-center justify-center mb-6" style={{ minHeight: '240px' }}>
              <div
                className="rounded-3xl border-4 flex items-center justify-center relative overflow-hidden select-none"
                style={getBoxStyle()}
              >
                <MobileFriendlyWrapper
                  className="w-full h-full flex items-center justify-center"
                  onTap={() => pauseBreathing()}
                >
                {/* Inner glow effect */}
                <div 
                  className="absolute inset-2 rounded-2xl opacity-30"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
                    transform: `scale(${pulseIntensity / 100})`
                  }}
                />
                
                {/* Center icon */}
                <div className="text-white text-4xl font-bold z-10">
                  {phase === 'inhale' && '↗️'}
                  {phase === 'hold1' && '⏸️'} 
                  {phase === 'exhale' && '↙️'}
                  {phase === 'hold2' && '⏸️'}
                </div>
                </MobileFriendlyWrapper>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="w-full max-w-xs mx-auto mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span className={phase === 'inhale' ? 'font-bold text-blue-600' : ''}>Inhale</span>
                <span className={phase === 'hold1' ? 'font-bold text-purple-600' : ''}>Hold</span>
                <span className={phase === 'exhale' ? 'font-bold text-green-600' : ''}>Exhale</span>
                <span className={phase === 'hold2' ? 'font-bold text-orange-600' : ''}>Hold</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 via-green-500 to-orange-500 transition-all duration-1000"
                  style={{ 
                    width: `${((cycles * 16 + (['inhale', 'hold1', 'exhale', 'hold2'].indexOf(phase) * 4) + count) / 16) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Control Buttons */}
        <div className="flex gap-3 mb-6">
          {!isActive || sessionTime === 0 ? (
            <Button 
              onClick={startBreathing}
              onTouchEnd={(e) => { e.preventDefault(); startBreathing() }}
              className="flex-1 touch-manipulation bg-blue-500 hover:bg-blue-600"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Breathing
            </Button>
          ) : (
            <Button 
              onClick={pauseBreathing}
              onTouchEnd={(e) => { e.preventDefault(); pauseBreathing() }}
              className="flex-1 touch-manipulation bg-yellow-500 hover:bg-yellow-600"
              size="lg"
            >
              <Pause className="w-5 h-5 mr-2" />
              {isActive ? 'Pause' : 'Resume'}
            </Button>
          )}
          
          <Button 
            onClick={resetBreathing}
            onTouchEnd={(e) => { e.preventDefault(); resetBreathing() }}
            variant="outline"
            size="lg"
            className="touch-manipulation"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>

        {/* Breathing Pattern Guide */}
        <Card className="mobile-card mb-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
          <div className="text-center">
            <div className="text-2xl mb-2">📚</div>
            <h4 className="font-semibold mobile-text text-indigo-800 mb-2">4-4-4-4 Pattern</h4>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-1">1</div>
                <div className="text-blue-700">Inhale 4s</div>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-1">2</div>
                <div className="text-purple-700">Hold 4s</div>
              </div>
              <div className="text-center">  
                <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-1">3</div>
                <div className="text-green-700">Exhale 4s</div>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-1">4</div>
                <div className="text-orange-700">Hold 4s</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Benefits Card */}
        <Card className="mobile-card bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <div className="text-center">
            <div className="text-2xl mb-2">🌟</div>
            <h4 className="font-semibold mobile-text text-green-800 mb-1">Breathing Benefits</h4>
            <p className="mobile-subtext text-green-700">
              Reduces stress & anxiety • Improves focus • Calms nervous system • Enhances emotional regulation • Better sleep quality
            </p>
            <div className="mt-2 flex justify-center space-x-4">
              <span className="mobile-subtext text-green-600">🧘 Calm</span>
              <span className="mobile-subtext text-blue-600">🎯 Focus</span>
              <span className="mobile-subtext text-purple-600">💤 Sleep</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}