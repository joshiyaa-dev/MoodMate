"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, RotateCcw, Sparkles, Heart } from "lucide-react"

interface GratitudeSpinnerProps {
  onBack: () => void
}

export default function GratitudeSpinner({ onBack }: GratitudeSpinnerProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [completedPrompts, setCompletedPrompts] = useState<string[]>([])
  const [rotation, setRotation] = useState(0)

  const gratitudePrompts = [
    "Something that made you smile today",
    "A person who has positively impacted your life",
    "A skill or talent you're grateful to have",
    "A place that brings you peace",
    "A memory that fills you with joy",
    "Something about your body you appreciate",
    "A challenge that helped you grow",
    "A small pleasure you enjoyed recently",
    "Someone who showed you kindness",
    "An opportunity you're thankful for",
    "A lesson you've learned this year",
    "Something in nature you find beautiful",
  ]

  const spin = () => {
    if (isSpinning) return

    setIsSpinning(true)
    setResponse("")

    // Animate the spinner
    const spins = 5 + Math.random() * 3 // 5-8 full rotations
    const finalRotation = rotation + spins * 360
    setRotation(finalRotation)

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * gratitudePrompts.length)
      setCurrentPrompt(gratitudePrompts[randomIndex])
      setIsSpinning(false)
    }, 2000)
  }

  const saveResponse = () => {
    if (response.trim() && currentPrompt) {
      setCompletedPrompts([...completedPrompts, `${currentPrompt}: ${response.trim()}`])
      setResponse("")
      setCurrentPrompt("")
    }
  }

  const reset = () => {
    setCurrentPrompt("")
    setResponse("")
    setRotation(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 p-4">
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
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Gratitude Spinner</h1>
          <div className="w-8" />
        </div>

        <div className="space-y-6">
          {/* Spinner Wheel */}
          <Card className="p-8">
            <div className="text-center space-y-6">
              <div className="relative">
                <div
                  className={`w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400 flex items-center justify-center shadow-lg transition-transform duration-2000 ease-out ${isSpinning ? "animate-pulse" : ""}`}
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <Sparkles className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                      <div className="text-sm font-semibold text-gray-800">
                        {isSpinning ? "Spinning..." : "Tap to Spin"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Spinner pointer */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-600"></div>
                </div>
              </div>

              <Button
                onClick={spin}
                disabled={isSpinning}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-8"
              >
                {isSpinning ? "Spinning..." : "Spin for Gratitude"}
              </Button>
            </div>
          </Card>

          {/* Current Prompt */}
          {currentPrompt && !isSpinning && (
            <Card className="p-6 bg-gradient-to-r from-yellow-100 to-orange-100">
              <div className="space-y-4">
                <div className="text-center">
                  <Heart className="w-6 h-6 mx-auto mb-2 text-pink-500" />
                  <h3 className="font-semibold text-gray-800">Reflect on this:</h3>
                  <p className="text-lg text-gray-700 mt-2">{currentPrompt}</p>
                </div>

                <Textarea
                  placeholder="Write about what you're grateful for..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={4}
                  className="resize-none"
                />

                <div className="flex space-x-2">
                  <Button
                    onClick={saveResponse}
                    disabled={!response.trim()}
                    className="flex-1 bg-green-500 hover:bg-green-600"
                  >
                    Save & Continue
                  </Button>
                  <Button variant="outline" onClick={reset}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Completed Gratitudes */}
          {completedPrompts.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Your Gratitude Journal</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {completedPrompts.map((item, index) => (
                  <div key={index} className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-center">
                <div className="text-2xl font-bold text-green-600">{completedPrompts.length}</div>
                <div className="text-sm text-gray-600">Gratitudes Recorded</div>
              </div>
            </Card>
          )}

          {/* Instructions */}
          <Card className="p-4 bg-gradient-to-r from-pink-50 to-purple-50">
            <h4 className="font-semibold text-gray-800 mb-2">How it Works</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• Spin the wheel to get a gratitude prompt</p>
              <p>• Take time to reflect on the question</p>
              <p>• Write down your thoughts and feelings</p>
              <p>• Build a collection of positive memories</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
