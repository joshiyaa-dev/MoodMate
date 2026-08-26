"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react"
import { requestNotificationPermission } from "@/lib/permissions"
import { MobileFriendlyWrapper } from "../utils/mobile-touch-utils"

interface ProgressiveMuscleRelaxationProps {
  onBack: () => void
}

export default function ProgressiveMuscleRelaxation({ onBack }: ProgressiveMuscleRelaxationProps) {
  const [isActive, setIsActive] = useState(false)
  const [currentMuscle, setCurrentMuscle] = useState(0)
  const [phase, setPhase] = useState<'tense' | 'hold' | 'release' | 'relax'>('tense')
  const [timeLeft, setTimeLeft] = useState(5)
  const [completedMuscles, setCompletedMuscles] = useState<boolean[]>([])

  const muscleGroups = [
    {
      name: "Feet & Toes",
      instruction: "Curl your toes and tense your feet",
      releaseInstruction: "Let your feet go completely limp",
      bodyPart: "🦶",
      color: "from-blue-400 to-cyan-400"
    },
    {
      name: "Calves & Shins",
      instruction: "Point your toes up and tense your calves",
      releaseInstruction: "Let your lower legs relax completely",
      bodyPart: "🦵",
      color: "from-green-400 to-teal-400"
    },
    {
      name: "Thighs & Glutes",
      instruction: "Squeeze your thigh muscles and glutes tight",
      releaseInstruction: "Release all tension in your upper legs",
      bodyPart: "🍑",
      color: "from-yellow-400 to-orange-400"
    },
    {
      name: "Abdomen",
      instruction: "Tighten your stomach muscles",
      releaseInstruction: "Let your belly be soft and relaxed",
      bodyPart: "🫃",
      color: "from-orange-400 to-red-400"
    },
    {
      name: "Hands & Arms",
      instruction: "Make fists and tense your arms",
      releaseInstruction: "Let your arms fall heavy and loose",
      bodyPart: "💪",
      color: "from-purple-400 to-pink-400"
    },
    {
      name: "Shoulders",
      instruction: "Lift your shoulders up to your ears",
      releaseInstruction: "Drop your shoulders down and back",
      bodyPart: "🤷",
      color: "from-pink-400 to-rose-400"
    },
    {
      name: "Face & Head",
      instruction: "Scrunch your face and clench your jaw",
      releaseInstruction: "Let your face be completely soft",
      bodyPart: "😤",
      color: "from-indigo-400 to-purple-400"
    }
  ]

  useEffect(() => {
    setCompletedMuscles(new Array(muscleGroups.length).fill(false))
  }, [])

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Move to next phase
          setPhase(currentPhase => {
            switch (currentPhase) {
              case 'tense':
                return 'hold'
              case 'hold':
                return 'release'
              case 'release':
                return 'relax'
              case 'relax':
                // Mark current muscle as completed
                setCompletedMuscles(prev => {
                  const newCompleted = [...prev]
                  newCompleted[currentMuscle] = true
                  return newCompleted
                })
                
                // Move to next muscle group
                if (currentMuscle < muscleGroups.length - 1) {
                  setCurrentMuscle(prev => prev + 1)
                  return 'tense'
                } else {
                  // Exercise complete
                  setIsActive(false)
                  return 'tense'
                }
              default:
                return 'tense'
            }
          })
          
          // Set time for next phase
          switch (phase) {
            case 'tense': return 5 // 5 seconds to tense
            case 'hold': return 5 // 5 seconds to hold
            case 'release': return 2 // 2 seconds to release
            case 'relax': return 8 // 8 seconds to relax
            default: return 5
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, phase, currentMuscle])

  const getPhaseInstruction = () => {
    const muscle = muscleGroups[currentMuscle]
    switch (phase) {
      case 'tense':
        return muscle.instruction
      case 'hold':
        return "Hold the tension tight"
      case 'release':
        return muscle.releaseInstruction
      case 'relax':
        return "Notice the difference between tension and relaxation"
    }
  }

  const getPhaseTitle = () => {
    switch (phase) {
      case 'tense': return 'TENSE'
      case 'hold': return 'HOLD'
      case 'release': return 'RELEASE'
      case 'relax': return 'RELAX'
    }
  }

  const getPhaseColor = () => {
    switch (phase) {
      case 'tense': return 'text-red-600'
      case 'hold': return 'text-orange-600'
      case 'release': return 'text-blue-600'
      case 'relax': return 'text-green-600'
    }
  }

  const startExercise = async () => {
    await requestNotificationPermission()
    setIsActive(true)
    setCurrentMuscle(0)
    setPhase('tense')
    setTimeLeft(5)
    setCompletedMuscles(new Array(muscleGroups.length).fill(false))
  }

  const pauseExercise = () => {
    setIsActive(false)
  }

  const resetExercise = () => {
    setIsActive(false)
    setCurrentMuscle(0)
    setPhase('tense')
    setTimeLeft(5)
    setCompletedMuscles(new Array(muscleGroups.length).fill(false))
  }

  const skipToNext = () => {
    if (currentMuscle < muscleGroups.length - 1) {
      setCompletedMuscles(prev => {
        const newCompleted = [...prev]
        newCompleted[currentMuscle] = true
        return newCompleted
      })
      setCurrentMuscle(prev => prev + 1)
      setPhase('tense')
      setTimeLeft(5)
    }
  }

  const currentMuscleData = muscleGroups[currentMuscle]
  const isComplete = completedMuscles.every(completed => completed)

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="mobile-heading text-gray-800 dark:text-gray-100 mb-2">Progressive Muscle Relaxation</h3>
        <p className="mobile-text text-gray-600 dark:text-gray-300">Tense and release each muscle group</p>
      </div>

      <Card className="mobile-card bg-gradient-to-br from-purple-50 to-blue-50">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mobile-subtext text-gray-600 mb-2">
            <span>Progress</span>
            <span>{completedMuscles.filter(Boolean).length}/{muscleGroups.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(completedMuscles.filter(Boolean).length / muscleGroups.length) * 100}%` }}
            />
          </div>
        </div>

        {!isComplete ? (
          <>
            {/* Current Muscle Group */}
            <Card className={`p-6 bg-gradient-to-r ${currentMuscleData.color} text-white mb-6`}>
              <div className="text-center">
                <div className="text-6xl mb-4">{currentMuscleData.bodyPart}</div>
                <h4 className="text-2xl font-bold mb-2">{currentMuscleData.name}</h4>
                <div className={`text-3xl font-bold mb-4 ${getPhaseColor()} bg-white px-4 py-2 rounded-lg`}>
                  {getPhaseTitle()} - {timeLeft}s
                </div>
                <p className="text-lg">{getPhaseInstruction()}</p>
              </div>
            </Card>

            {/* Muscle Groups Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-6">
              {muscleGroups.map((muscle, index) => (
                <div
                  key={index}
                  className={`text-center p-3 rounded-lg transition-all duration-300 min-h-[60px] ${
                    index === currentMuscle
                      ? 'bg-white shadow-lg scale-105 ring-2 ring-purple-400'
                      : completedMuscles[index]
                      ? 'bg-green-100'
                      : 'bg-gray-100'
                  }`}
                >
                  <div className="text-xl sm:text-2xl">{muscle.bodyPart}</div>
                  <div className="text-xs mt-1 font-medium">
                    {muscle.name.split(' ')[0]}
                  </div>
                  {completedMuscles[index] && (
                    <div className="text-green-600 text-xs">✓</div>
                  )}
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4">
              <Button
                onClick={isActive ? pauseExercise : startExercise}
                onTouchEnd={(e) => { e.preventDefault(); isActive ? pauseExercise() : startExercise() }}
                size="lg"
                className={`touch-manipulation ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-500 hover:bg-purple-600'}`}
              >
                {isActive ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    {currentMuscle === 0 && !completedMuscles[0] ? 'Start' : 'Resume'}
                  </>
                )}
              </Button>

              <Button 
                variant="outline" 
                onClick={skipToNext} 
                onTouchEnd={(e) => { e.preventDefault(); skipToNext() }}
                disabled={!isActive || currentMuscle >= muscleGroups.length - 1} 
                size="lg"
                className="touch-manipulation"
              >
                <SkipForward className="w-4 h-4 mr-2" />
                Skip
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
          </>
        ) : (
          /* Completion Screen */
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🧘‍♀️</div>
            <h4 className="text-2xl font-bold text-green-600 mb-4">Exercise Complete!</h4>
            <p className="text-gray-600 mb-6">
              You've successfully relaxed all muscle groups. Notice how your body feels now.
            </p>
            <Button 
              onClick={resetExercise}
              onTouchEnd={(e) => { e.preventDefault(); resetExercise() }}
              size="lg"
              className="touch-manipulation bg-purple-500 hover:bg-purple-600"
            >
              Start Again
            </Button>
          </div>
        )}

        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-800 text-center">
            <strong>💆‍♀️ Benefits:</strong> Great for anxiety relief • Reduces muscle tension • Improves sleep • Body awareness
          </p>
        </div>
      </Card>
    </div>
  )
}