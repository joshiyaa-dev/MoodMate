"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Footprints, Heart, Brain } from "lucide-react"
import { MobileFriendlyWrapper } from "../utils/mobile-touch-utils"

interface WalkingExercisesProps {
  onBack: () => void
}

export default function WalkingExercises({ onBack }: WalkingExercisesProps) {
  const [activeExercise, setActiveExercise] = useState<'mindful' | 'counting' | 'gratitude' | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [stepCount, setStepCount] = useState(0)
  const [breathCount, setBreathCount] = useState(0)
  const [gratitudeItems, setGratitudeItems] = useState<string[]>([])
  const [currentGratitudeIndex, setCurrentGratitudeIndex] = useState(0)

  const exercises = [
    {
      id: 'mindful',
      name: 'Mindful Walk',
      duration: '10 mins',
      description: 'Walk slowly, notice 5 senses',
      benefit: 'Clears thoughts, boosts dopamine',
      icon: Brain,
      color: 'from-green-400 to-emerald-400'
    },
    {
      id: 'counting',
      name: 'Counting Steps',
      duration: '5 mins',
      description: 'Count steps in 4-steps-inhale, 4-steps-exhale pattern',
      benefit: 'Syncs movement + breath',
      icon: Footprints,
      color: 'from-blue-400 to-cyan-400'
    },
    {
      id: 'gratitude',
      name: 'Gratitude Walk',
      duration: '10 mins',
      description: 'Think of 5 things you\'re grateful for while walking',
      benefit: 'Mood enhancer',
      icon: Heart,
      color: 'from-pink-400 to-rose-400'
    }
  ]

  const gratitudePrompts = [
    "Something that made you smile today",
    "A person who supports you",
    "A place where you feel safe",
    "A skill or ability you have",
    "Something beautiful you noticed recently"
  ]

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
      
      // Simulate step counting (in real app, would use device sensors)
      if (Math.random() > 0.6) {
        setStepCount(prev => prev + 1)
        
        // For counting exercise, track breathing pattern
        if (activeExercise === 'counting') {
          setBreathCount(prev => {
            const newCount = prev + 1
            // 4 steps inhale, 4 steps exhale = 8 step cycle
            return newCount % 8
          })
        }
      }
      
      // For gratitude exercise, change prompt every 2 minutes
      if (activeExercise === 'gratitude' && timeElapsed > 0 && timeElapsed % 120 === 0) {
        setCurrentGratitudeIndex(prev => (prev + 1) % gratitudePrompts.length)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, timeElapsed, activeExercise])

  const startExercise = (exerciseId: 'mindful' | 'counting' | 'gratitude') => {
    setActiveExercise(exerciseId)
    setIsActive(true)
    setTimeElapsed(0)
    setStepCount(0)
    setBreathCount(0)
    setCurrentGratitudeIndex(0)
    if (exerciseId === 'gratitude') {
      setGratitudeItems([])
    }
  }

  const pauseExercise = () => {
    setIsActive(false)
  }

  const resetExercise = () => {
    setIsActive(false)
    setActiveExercise(null)
    setTimeElapsed(0)
    setStepCount(0)
    setBreathCount(0)
    setGratitudeItems([])
    setCurrentGratitudeIndex(0)
  }

  const addGratitudeItem = (item: string) => {
    if (item.trim() && !gratitudeItems.includes(item.trim())) {
      setGratitudeItems(prev => [...prev, item.trim()])
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getBreathingPhase = () => {
    return breathCount < 4 ? 'Inhale' : 'Exhale'
  }

  const getBreathingCount = () => {
    return breathCount < 4 ? breathCount + 1 : breathCount - 3
  }

  if (!activeExercise) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Walking Exercises</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Choose a walking meditation style</p>
        </div>

        <div className="space-y-4">
          {exercises.map((exercise) => {
            const IconComponent = exercise.icon
            return (
              <Card
                key={exercise.id}
                className="p-4 cursor-pointer hover:shadow-lg transition-all duration-300 dark:bg-gray-800 hover:scale-102 transform touch-manipulation"
                onClick={() => startExercise(exercise.id as any)}
                onTouchEnd={(e) => { e.preventDefault(); startExercise(exercise.id as any) }}
                style={{ touchAction: 'manipulation' }}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${exercise.color} rounded-full flex items-center justify-center shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-1">{exercise.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{exercise.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{exercise.duration}</span>
                      <span className="text-xs text-green-600 font-medium">✓ {exercise.benefit}</span>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50">
          <p className="text-sm text-green-800 text-center">
            <strong>🚶‍♀️ Walking Benefits:</strong> Improves mood • Reduces stress • Enhances creativity • Boosts energy • Promotes mindfulness
          </p>
        </Card>
      </div>
    )
  }

  const currentExercise = exercises.find(e => e.id === activeExercise)!
  const IconComponent = currentExercise.icon

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">{currentExercise.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{currentExercise.description}</p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm font-semibold">Time: {formatTime(timeElapsed)}</div>
          <div className="text-sm font-semibold">Steps: {stepCount}</div>
        </div>

        {/* Walking Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className={`transition-transform duration-1000 ${isActive ? 'animate-bounce' : ''}`}>
              <IconComponent 
                className={`w-16 h-16 ${isActive ? 'text-green-500' : 'text-gray-400'}`}
              />
            </div>
            
            {/* Walking trail */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-1">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      isActive && i <= (stepCount % 7) ? 'bg-green-400' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Exercise-specific content */}
        {activeExercise === 'mindful' && (
          <Card className="p-4 bg-white mb-6">
            <h4 className="font-semibold text-green-700 mb-3">Mindful Walking Guide:</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div>👁️ <strong>See:</strong> Notice colors, shapes, and movement</div>
              <div>👂 <strong>Hear:</strong> Listen to sounds around you</div>
              <div>👃 <strong>Smell:</strong> Notice any scents in the air</div>
              <div>✋ <strong>Feel:</strong> Sense the ground under your feet</div>
              <div>👅 <strong>Taste:</strong> Notice any tastes in your mouth</div>
            </div>
          </Card>
        )}

        {activeExercise === 'counting' && (
          <Card className="p-4 bg-white mb-6">
            <div className="text-center">
              <h4 className="font-semibold text-blue-700 mb-3">Breathing Pattern</h4>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {getBreathingPhase()} - {getBreathingCount()}
              </div>
              <div className="text-sm text-gray-600">
                {getBreathingPhase() === 'Inhale' ? 'Breathe in for 4 steps' : 'Breathe out for 4 steps'}
              </div>
            </div>
          </Card>
        )}

        {activeExercise === 'gratitude' && (
          <div className="space-y-4 mb-6">
            <Card className="p-4 bg-gradient-to-r from-pink-100 to-rose-100">
              <h4 className="font-semibold text-pink-700 mb-2">Current Gratitude Focus:</h4>
              <p className="text-pink-800">{gratitudePrompts[currentGratitudeIndex]}</p>
            </Card>
            
            {gratitudeItems.length > 0 && (
              <Card className="p-4 bg-white">
                <h4 className="font-semibold text-gray-700 mb-2">Your Gratitude List:</h4>
                <div className="space-y-1">
                  {gratitudeItems.map((item, index) => (
                    <div key={index} className="text-sm text-gray-600 flex items-center">
                      <Heart className="w-3 h-3 text-red-400 mr-2" />
                      {item}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center space-x-4 mb-4">
          <Button
            onClick={isActive ? pauseExercise : () => setIsActive(true)}
            onTouchEnd={(e) => { e.preventDefault(); isActive ? pauseExercise() : setIsActive(true) }}
            size="lg"
            className={`touch-manipulation ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Resume
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
            Back to Menu
          </Button>
        </div>

        {/* Exercise Tips */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h5 className="font-semibold text-green-800 mb-2">💡 Walking Tips:</h5>
          <ul className="text-sm text-green-700 space-y-1">
            {activeExercise === 'mindful' && (
              <>
                <li>• Walk at a comfortable, slower pace</li>
                <li>• Focus on one sense at a time</li>
                <li>• When your mind wanders, gently return to sensing</li>
              </>
            )}
            {activeExercise === 'counting' && (
              <>
                <li>• Match your breathing to your steps</li>
                <li>• Don't worry if you lose count, just restart</li>
                <li>• Focus on the rhythm of breath and movement</li>
              </>
            )}
            {activeExercise === 'gratitude' && (
              <>
                <li>• Really feel grateful for each item you think of</li>
                <li>• Be specific about what makes you grateful</li>
                <li>• Let positive feelings fill your body as you walk</li>
              </>
            )}
          </ul>
        </div>
      </Card>
    </div>
  )
}