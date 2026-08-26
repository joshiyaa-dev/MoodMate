"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"  
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Users, Globe, Shield, CheckCircle, Smartphone, Brain, Sparkles } from "lucide-react"
import { useMobileInput } from "@/hooks/use-mobile-keyboard"


interface UserProfile {
  name: string
  language: string
  emergencyContact: string
}

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    language: "English",
  })
  const { createInputProps } = useMobileInput()

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      onComplete(profile as UserProfile)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 2:
        return profile.name && profile.name.length > 0
      case 3:
        return profile.emergencyContact && profile.emergencyContact.length > 0
      default:
        return true
    }
  }



  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Heart className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Welcome to MOOD MATE</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Your personal AI-powered mental health companion, designed to support your wellness journey</p>
            </div>
            <div className="space-y-4 text-left bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-sm font-medium">100% Offline & Private</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Your data stays on your device</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-sm font-medium">Voice & Text Journaling</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Express yourself however feels natural</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-sm font-medium">Smart Mood Insights</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">AI-powered patterns and recommendations</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-sm font-medium">Self-Care Tools & Games</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Breathing exercises, games, and wellness activities</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Language & Identity</h2>
              <p className="text-gray-600 dark:text-gray-300">Let's personalize your experience</p>
            </div>
            <div className="space-y-5">
              <div className="input-container">
                <Label htmlFor="language" className="text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Language</Label>
                <Select value={profile.language} onValueChange={(value) => setProfile({ ...profile, language: value })}>
                  <SelectTrigger className="mobile-input mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">🇺🇸 English</SelectItem>
                    <SelectItem value="Spanish">🇪🇸 Español</SelectItem>
                    <SelectItem value="French">🇫🇷 Français</SelectItem>
                    <SelectItem value="German">🇩🇪 Deutsch</SelectItem>
                    <SelectItem value="Portuguese">🇧🇷 Português</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="input-container">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">What should we call you?</Label>
                <Input
                  {...createInputProps({
                    id: "name",
                    placeholder: "Enter your name or nickname",
                    value: profile.name || "",
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, name: e.target.value }),
                    className: "mt-1"
                  })}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This helps make our interactions more personal</p>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Emergency Contact</h2>
              <p className="text-gray-600 dark:text-gray-300">Someone you trust for support</p>
            </div>
            <div className="space-y-5">
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200">Why we ask for this</h4>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">In case you need support during a difficult time, having a trusted contact readily available can be crucial for your safety and wellbeing.</p>
                  </div>
                </div>
              </div>
              <div className="input-container">
                <Label htmlFor="emergency" className="text-sm font-medium text-gray-700 dark:text-gray-300">Emergency Contact</Label>
                <Input
                  {...createInputProps({
                    id: "emergency",
                    placeholder: "e.g., Mom - (555) 123-4567",
                    value: profile.emergencyContact || "",
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, emergencyContact: e.target.value }),
                    className: "mt-1"
                  })}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  🔒 This information is stored securely on your device only and is never shared
                </p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="mobile-container keyboard-aware-container bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <Card className="w-full mobile-card max-w-lg">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Step {step} of 3</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="input-scroll-container">
          {renderStep()}
        </div>

        <div className="flex justify-between mt-6 gap-3">
          <Button 
            variant="outline" 
            onClick={handleBack} 
            disabled={step === 1} 
            className="mobile-button flex-1"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="mobile-button bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex-1 touch-target"
          >
            {step === 3 ? "Complete Setup" : "Next"}
          </Button>
        </div>

        {/* Skip option for emergency contact */}
        {step === 3 && (
          <div className="text-center mt-4">
            <Button
              variant="ghost"
              onClick={handleNext}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Skip for now
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
