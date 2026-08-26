"use client"

import { Card } from "@/components/ui/card"
import { Footprints } from "lucide-react"
import { MobileFriendlyWrapper } from "./utils/mobile-touch-utils"

interface MindfulWalkingProps {
  onBack: () => void
}

export default function MindfulWalking({ onBack }: MindfulWalkingProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Mindful Walking</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">Guided walking meditation with animation</p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-900 dark:to-green-900">
        <div className="text-center mb-6">
          <div className="w-32 h-32 mx-auto mb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-green-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Footprints className="w-12 h-12 text-teal-600 dark:text-teal-400 animate-bounce" />
            </div>
          </div>
          <h4 className="text-lg font-semibold text-teal-800 dark:text-teal-200">Walking Animation</h4>
        </div>

        <div className="space-y-4 text-center">
          <div className="bg-white/70 dark:bg-gray-800/70 p-4 rounded-lg">
            <h5 className="font-semibold text-teal-700 dark:text-teal-300 mb-2">5-Step Meditation Guide:</h5>
            <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-1 text-left">
              <li>1. Feel your feet touching the ground</li>
              <li>2. Notice the rhythm of your steps</li>
              <li>3. Breathe in sync with your movement</li>
              <li>4. Observe your surroundings mindfully</li>
              <li>5. Let thoughts pass like gentle breeze</li>
            </ol>
          </div>

          <div className="bg-teal-50 dark:bg-teal-900/30 p-4 rounded-lg">
            <p className="text-sm text-teal-800 dark:text-teal-200">
              <strong>🚶‍♀️ Walking Tip:</strong> Start with slow, deliberate steps. Focus on the sensation of each footfall and the rhythm of your breathing.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}