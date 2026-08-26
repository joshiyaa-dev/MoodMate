"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Footprints } from "lucide-react"
import { MobileFriendlyWrapper } from "../utils/mobile-touch-utils"

interface MindfulWalkProps {
  onBack: () => void
}

export default function MindfulWalk({ onBack }: MindfulWalkProps) {
  const [isActive, setIsActive] = useState(false)
  const [currentSense, setCurrentSense] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [stepCount, setStepCount] = useState(0)
  const [walkingAnimation, setWalkingAnimation] = useState(false)

  const senses = [
    {
      title: "What do you SEE?",
      description: "Notice colors, shapes, movement around you",
      icon: "👁️",
      color: "from-blue-400 to-cyan-400"
    },
    {
      title: "What do you HEAR?",
      description: "Listen to sounds near and far",
      icon: "👂",
      color: "from-green-400 to-teal-400"
    },
    {
      title: "What do you FEEL?",
      description: "Notice temperature, textures, your body",
      icon: "✋",
      color: "from-yellow-400 to-orange-400"
    },
    {
      title: "What do you SMELL?",
      description: "Breathe in and notice any scents",
      icon: "👃",
      color: "from-purple-400 to-pink-400"
    },
    {
      title: "What can you TASTE?",
      description: "Notice any tastes in your mouth",
      icon: "👅",
      color: "from-red-400 to-rose-400"
    }
  ]

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
      
      // Change sense focus every 2 minutes (120 seconds)
      if (timeElapsed > 0 && timeElapsed % 120 === 0) {
        setCurrentSense(prev => (prev + 1) % senses.length)
      }
      
      // Simulate step counting (in real app, this would use device sensors)
      if (Math.random() > 0.7) {
        setStepCount(prev => prev + 1)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, timeElapsed])

  useEffect(() => {
    if (isActive) {
      setWalkingAnimation(true)
      const animationInterval = setInterval(() => {
        setWalkingAnimation(prev => !prev)
      }, 800)
      
      return () => clearInterval(animationInterval)
    } else {
      setWalkingAnimation(false)
    }
  }, [isActive])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const toggleWalk = () => {
    setIsActive(!isActive)
  }

  const resetWalk = () => {
    setIsActive(false)
    setTimeElapsed(0)
    setStepCount(0)
    setCurrentSense(0)
  }

  const currentSenseData = senses[currentSense]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Mindful Walking</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">Walk slowly and notice your 5 senses</p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm font-semibold">Time: {formatTime(timeElapsed)}</div>
          <div className="text-sm font-semibold">Steps: {stepCount}</div>
        </div>

        {/* Walking Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className={`transition-transform duration-800 ${walkingAnimation ? 'translate-y-1' : 'translate-y-0'}`}>
              <Footprints 
                className={`w-16 h-16 ${isActive ? 'text-green-500' : 'text-gray-400'} ${isActive ? 'animate-pulse' : ''}`}
              />
            </div>
            
            {/* Walking path visualization */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      isActive && i <= (stepCount % 5) ? 'bg-green-400' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Current Sense Focus */}
        <Card className={`p-6 bg-gradient-to-r ${currentSenseData.color} text-white mb-6`}>
          <div className="text-center">
            <div className="text-4xl mb-2">{currentSenseData.icon}</div>
            <h4 className="text-xl font-bold mb-2">{currentSenseData.title}</h4>
            <p className="text-sm opacity-90">{currentSenseData.description}</p>
          </div>
        </Card>

        {/* Sense Progress */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {senses.map((sense, index) => (
            <div
              key={index}
              className={`text-center p-2 rounded-lg transition-all duration-300 ${
                index === currentSense
                  ? 'bg-white shadow-lg scale-105'
                  : index < currentSense
                  ? 'bg-green-100'
                  : 'bg-gray-100'
              }`}
            >
              <div className="text-lg">{sense.icon}</div>
              <div className="text-xs mt-1 font-medium">
                {sense.title.split(' ')[2]?.replace('?', '')}
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4 mb-4">
          <Button
            onClick={toggleWalk}
            onTouchEnd={(e) => { e.preventDefault(); toggleWalk() }}
            size="lg"
            className={`touch-manipulation ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause Walk
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Walking
              </>
            )}
          </Button>

          <Button 
            variant="outline" 
            onClick={resetWalk}
            onTouchEnd={(e) => { e.preventDefault(); resetWalk() }}
            size="lg"
            className="touch-manipulation"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h5 className="font-semibold text-green-800 mb-2">Walking Tips:</h5>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Walk at a comfortable, slower pace</li>
            <li>• Focus on the current sense for 2 minutes</li>
            <li>• Notice without judging what you experience</li>
            <li>• If your mind wanders, gently return to the current sense</li>
          </ul>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 text-center">
            <strong>🚶‍♀️ Benefits:</strong> Clears thoughts • Boosts dopamine • Reduces anxiety • Improves mindfulness
          </p>
        </div>
      </Card>
    </div>
  )
}