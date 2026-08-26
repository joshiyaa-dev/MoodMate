"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import { MobileFriendlyWrapper } from "./utils/mobile-touch-utils"

interface StressBallProps {
  onBack: () => void
}

export default function StressBall({ onBack }: StressBallProps) {
  const [squeezes, setSqueezes] = useState(0)
  const [isPressed, setIsPressed] = useState(false)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Virtual Stress Ball</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">Tap to squeeze and release tension</p>
      </div>

      <div className="flex flex-col items-center space-y-6">
        <div 
          className={`w-48 h-48 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center text-white font-bold text-xl shadow-2xl ${
            isPressed 
              ? 'bg-gradient-to-br from-orange-600 to-red-700 scale-90' 
              : 'bg-gradient-to-br from-orange-400 to-red-500 scale-100 hover:scale-105'
          }`}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => {
            setIsPressed(false)
            setSqueezes(prev => prev + 1)
          }}
          onMouseLeave={() => setIsPressed(false)}
          onTouchStart={(e) => { e.preventDefault(); setIsPressed(true) }}
          onTouchEnd={(e) => {
            e.preventDefault()
            setIsPressed(false)
            setSqueezes(prev => prev + 1)
          }}
          style={{ touchAction: 'manipulation' }}
        >
          {isPressed ? 'SQUEEZE!' : 'TAP ME'}
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Squeezes: {squeezes}
          </p>
          <Button 
            variant="outline" 
            onClick={() => setSqueezes(0)}
            onTouchEnd={(e) => { e.preventDefault(); setSqueezes(0) }}
            size="lg"
            className="mt-2 touch-manipulation"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <p className="text-sm text-orange-800 dark:text-orange-200 text-center">
            <strong>💡 Tip:</strong> Take deep breaths while squeezing to maximize stress relief!
          </p>
        </div>
      </div>
    </div>
  )
}