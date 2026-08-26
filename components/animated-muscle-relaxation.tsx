"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, Pause, RotateCcw, CheckCircle } from "lucide-react"

interface AnimatedMuscleRelaxationProps {
  onBack: () => void
}

interface MuscleGroup {
  name: string
  instruction: string
  tenseDuration: number
  relaxDuration: number
  bodyPart: string
}

export default function AnimatedMuscleRelaxation({ onBack }: AnimatedMuscleRelaxationProps) {
  const [currentExercise, setCurrentExercise] = useState<number | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<"tense" | "relax" | "rest">("rest")
  const [timer, setTimer] = useState(0)
  const [completedExercises, setCompletedExercises] = useState<number[]>([])
  const [sessionActive, setSessionActive] = useState(false)

  const muscleGroups: MuscleGroup[] = [
    { name: "Face & Head", instruction: "Scrunch your face, close eyes tight, furrow brow", tenseDuration: 5, relaxDuration: 10, bodyPart: "head" },
    { name: "Shoulders", instruction: "Lift shoulders up to your ears", tenseDuration: 5, relaxDuration: 10, bodyPart: "shoulders" },
    { name: "Arms & Hands", instruction: "Make tight fists, tense your arms", tenseDuration: 5, relaxDuration: 10, bodyPart: "arms" },
    { name: "Chest", instruction: "Take deep breath, hold and tense chest", tenseDuration: 7, relaxDuration: 10, bodyPart: "chest" },
    { name: "Stomach", instruction: "Tighten your abdominal muscles", tenseDuration: 5, relaxDuration: 10, bodyPart: "stomach" },
    { name: "Legs & Thighs", instruction: "Tense your thigh and calf muscles", tenseDuration: 5, relaxDuration: 10, bodyPart: "legs" },
    { name: "Feet", instruction: "Point toes down, then flex up", tenseDuration: 5, relaxDuration: 10, bodyPart: "feet" },
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive && currentExercise !== null) {
      interval = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev + 1
          const currentMuscle = muscleGroups[currentExercise]

          if (phase === "tense" && newTime >= currentMuscle.tenseDuration) {
            setPhase("relax")
            return 0
          } else if (phase === "relax" && newTime >= currentMuscle.relaxDuration) {
            setPhase("rest")
            setIsActive(false)
            setCompletedExercises(prev => [...prev, currentExercise])
            return 0
          }

          return newTime
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isActive, phase, currentExercise])

  const startExercise = (index: number) => {
    setCurrentExercise(index)
    setPhase("tense")
    setTimer(0)
    setIsActive(true)
  }

  const startFullSession = () => {
    setSessionActive(true)
    setCompletedExercises([])
    startExercise(0)
  }

  const nextExercise = () => {
    if (currentExercise !== null && currentExercise < muscleGroups.length - 1) {
      startExercise(currentExercise + 1)
    } else {
      setSessionActive(false)
      setCurrentExercise(null)
    }
  }

  const resetSession = () => {
    setIsActive(false)
    setCurrentExercise(null)
    setPhase("rest")
    setTimer(0)
    setCompletedExercises([])
    setSessionActive(false)
  }

  const getPhaseColor = () => {
    switch (phase) {
      case "tense": return "from-red-400 to-red-600"
      case "relax": return "from-green-400 to-green-600"
      default: return "from-blue-400 to-blue-600"
    }
  }

  const getPhaseInstruction = () => {
    if (currentExercise === null) return "Select a muscle group to begin"
    
    const currentMuscle = muscleGroups[currentExercise]
    switch (phase) {
      case "tense": return `TENSE: ${currentMuscle.instruction}`
      case "relax": return "RELAX: Let go completely, feel the tension melt away"
      default: return "Ready to start the next exercise"
    }
  }

  const getBodyPartAnimation = (bodyPart: string) => {
    if (currentExercise === null) return ""
    
    const currentMuscle = muscleGroups[currentExercise]
    if (currentMuscle.bodyPart !== bodyPart) return ""
    
    if (phase === "tense") {
      return "animate-pulse scale-110 bg-red-200 dark:bg-red-900"
    } else if (phase === "relax") {
      return "animate-bounce scale-105 bg-green-200 dark:bg-green-900"
    }
    return ""
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBack}
            className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Muscle Relaxation</h1>
          <div className="w-8" />
        </div>

        {/* Animated Body Visualization */}
        <Card className="p-6 mb-6 dark:bg-gray-800">
          <div className="text-center space-y-4">
            <div className="relative mx-auto w-32 h-48">
              {/* Simple body representation */}
              <div className="absolute inset-0 flex flex-col items-center">
                {/* Head */}
                <div className={`w-12 h-12 rounded-full border-2 border-gray-400 transition-all duration-500 ${getBodyPartAnimation("head")}`} />
                
                {/* Shoulders */}
                <div className={`w-20 h-4 rounded-full border-2 border-gray-400 mt-1 transition-all duration-500 ${getBodyPartAnimation("shoulders")}`} />
                
                {/* Arms */}
                <div className="flex justify-between w-24 mt-1">
                  <div className={`w-3 h-16 rounded-full border-2 border-gray-400 transition-all duration-500 ${getBodyPartAnimation("arms")}`} />
                  <div className={`w-3 h-16 rounded-full border-2 border-gray-400 transition-all duration-500 ${getBodyPartAnimation("arms")}`} />
                </div>
                
                {/* Chest */}
                <div className={`w-16 h-12 rounded-lg border-2 border-gray-400 -mt-12 transition-all duration-500 ${getBodyPartAnimation("chest")}`} />
                
                {/* Stomach */}
                <div className={`w-14 h-8 rounded-lg border-2 border-gray-400 mt-1 transition-all duration-500 ${getBodyPartAnimation("stomach")}`} />
                
                {/* Legs */}
                <div className="flex justify-center space-x-2 mt-1">
                  <div className={`w-4 h-20 rounded-full border-2 border-gray-400 transition-all duration-500 ${getBodyPartAnimation("legs")}`} />
                  <div className={`w-4 h-20 rounded-full border-2 border-gray-400 transition-all duration-500 ${getBodyPartAnimation("legs")}`} />
                </div>
                
                {/* Feet */}
                <div className="flex justify-center space-x-2 mt-1">
                  <div className={`w-6 h-3 rounded-full border-2 border-gray-400 transition-all duration-500 ${getBodyPartAnimation("feet")}`} />
                  <div className={`w-6 h-3 rounded-full border-2 border-gray-400 transition-all duration-500 ${getBodyPartAnimation("feet")}`} />
                </div>
              </div>
            </div>

            {/* Current Exercise Display */}
            {currentExercise !== null && (
              <div className="space-y-4">
                <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${getPhaseColor()} flex items-center justify-center transition-all duration-1000`}>
                  <div className="text-center text-white">
                    <div className="text-2xl font-bold">{timer}</div>
                    <div className="text-xs uppercase">{phase}</div>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">{muscleGroups[currentExercise].name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{getPhaseInstruction()}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Session Controls */}
        <div className="flex justify-center space-x-4 mb-6">
          <Button
            onClick={startFullSession}
            disabled={sessionActive}
            className="bg-green-500 hover:bg-green-600"
          >
            <Play className="w-4 h-4 mr-2" />
            Full Session
          </Button>
          <Button variant="outline" onClick={resetSession}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Individual Exercises */}
        <div className="space-y-3">
          {muscleGroups.map((muscle, index) => (
            <Card 
              key={index} 
              className={`p-4 transition-all dark:bg-gray-800 ${
                currentExercise === index ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {completedExercises.includes(index) && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-100">{muscle.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{muscle.instruction}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => startExercise(index)}
                  disabled={isActive || sessionActive}
                  variant={currentExercise === index ? "default" : "outline"}
                >
                  {currentExercise === index && isActive ? "Active" : "Start"}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Progress */}
        {sessionActive && (
          <Card className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {completedExercises.length} / {muscleGroups.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Exercises Completed</div>
              
              {completedExercises.length === muscleGroups.length && (
                <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    🎉 <strong>Session Complete!</strong> Great job! You've relaxed all muscle groups.
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-6 p-4 bg-red-50 dark:bg-red-900/20">
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">How it Works</h4>
          <div className="text-sm text-red-800 dark:text-red-200 space-y-1">
            <p>• <strong>Tense:</strong> Contract the muscle group for 5-7 seconds</p>
            <p>• <strong>Relax:</strong> Release completely and notice the contrast</p>
            <p>• <strong>Rest:</strong> Take a moment before the next exercise</p>
            <p>• <strong>Full Session:</strong> Goes through all muscle groups automatically</p>
          </div>
        </Card>
      </div>
    </div>
  )
}