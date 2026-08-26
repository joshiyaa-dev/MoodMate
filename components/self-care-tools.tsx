"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Wind, Music, Heart, Smile, Zap, Target, Footprints, Moon, Gamepad2, Activity, Brain } from "lucide-react"
import { addNotification } from "@/components/notification-system"
import { MobileDetection } from "@/lib/mobile-detection"

// Games - Mobile Optimized Versions
import TappingBallMobile from "@/components/self-care/games/tapping-ball-mobile"
import Puzzle2048Mobile from "@/components/self-care/games/puzzle-2048-mobile"
import BreatheSyncBubble from "@/components/self-care/games/breathe-sync-bubble"
import EmotionMatch from "@/components/self-care/games/emotion-match"

import PaintMyMoodMobile from "@/components/self-care/games/paint-my-mood-mobile"
import GratitudeFlipCards from "@/components/self-care/games/gratitude-flip-cards"
import BubblePopCalm from "@/components/self-care/games/bubble-pop-calm"
import FocusLightMaze from "@/components/self-care/games/focus-light-maze"
import SnakeAndLadder from "@/components/self-care/games/snake-and-ladder"
import NokiaSnake from "@/components/self-care/games/nokia-snake"


// Enhanced Components
import EnhancedMusicPlayer from "@/components/self-care/enhanced-music-player"
import EnhancedSleepStories from "@/components/self-care/enhanced-sleep-stories"
import WordPuzzleKindWords from "@/components/self-care/games/word-puzzle-kind-words"
import FlashZenTrivia from "@/components/self-care/games/flash-zen-trivia"

// Exercises - Mobile Optimized Versions

import AnimatedBoxBreathingMobile from "@/components/self-care/exercises/animated-box-breathing-mobile"

import ProgressiveMuscleRelaxation from "@/components/self-care/exercises/progressive-muscle-relaxation"
import NeckRolls from "@/components/self-care/exercises/neck-rolls"
import FireBreath from "@/components/self-care/exercises/fire-breath"
import CatCowStretch from "@/components/self-care/exercises/cat-cow-stretch"

// Core Tools

import MeditationTimer from "@/components/self-care/meditation-timer"
import StressBall from "@/components/self-care/stress-ball"

interface SelfCareToolsProps {
  onBack: () => void
}

export default function SelfCareTools({ onBack }: SelfCareToolsProps) {
  const [currentTool, setCurrentTool] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<'games' | 'exercises'>('games')
  const [isMobile] = useState(() => typeof window !== 'undefined' ? MobileDetection.isMobileDevice() : false)

  const handleActivityComplete = (activityName: string, activityType: string, duration?: number) => {
    addNotification({
      type: 'selfcare',
      title: 'Self-Care Activity Completed',
      message: `Great job completing "${activityName}"${duration ? ` for ${duration} minutes` : ''}! Keep up the good work.`,
      data: { activity: activityName, type: activityType, duration }
    })
  }

  const handleBackFromActivity = (activityName: string) => {
    // Track completion when user navigates back from activity
    if (currentTool) {
      const activityDisplayName = currentTool.charAt(0).toUpperCase() + currentTool.slice(1).replace(/-/g, ' ')
      handleActivityComplete(activityDisplayName, 'activity')
    }
    setCurrentTool(null)
  }

  const categories = [
    { id: 'games', name: 'Games', icon: Gamepad2, color: 'from-purple-500 to-pink-500' },
    { id: 'exercises', name: 'Exercises', icon: Activity, color: 'from-green-500 to-blue-500' }
  ]

  const tools = {
    games: [
      { id: 'tapping-ball', name: 'Tapping Ball', desc: 'Tap glowing balls in rhythm', benefit: 'Reduces anxiety, increases coordination', icon: Target, color: 'bg-purple-100 text-purple-600' },
      { id: 'puzzle-2048', name: '2048 Puzzle', desc: 'Combine numbers: 2+2=4, 4+4=8...', benefit: 'Improves focus, engages logic', icon: Brain, color: 'bg-blue-100 text-blue-600' },
      { id: 'breathe-sync-bubble', name: 'Breathe Sync Bubble', desc: 'Tap and hold as bubble expands/contracts', benefit: 'Controls panic, improves oxygen flow', icon: Wind, color: 'bg-cyan-100 text-cyan-600' },
      { id: 'emotion-match', name: 'Emotion Match', desc: 'Match emoji pairs (angry, calm, happy...)', benefit: 'Builds emotional recognition skills', icon: Smile, color: 'bg-yellow-100 text-yellow-600' },

      { id: 'paint-my-mood', name: 'Paint My Mood', desc: 'Express emotions through colors and art', benefit: 'Expresses feelings non-verbally', icon: Heart, color: 'bg-pink-100 text-pink-600' },
      { id: 'gratitude-flip-cards', name: 'Gratitude Flip Cards', desc: 'Flip cards to discover positive memories', benefit: 'Encourages daily reflection', icon: Smile, color: 'bg-yellow-100 text-yellow-600' },
      { id: 'bubble-pop-calm', name: 'Bubble Pop Calm', desc: 'Pop floating bubbles with calming words', benefit: 'Visual coordination, stress relief', icon: Target, color: 'bg-blue-100 text-blue-600' },
      { id: 'focus-light-maze', name: 'Focus Light Maze', desc: 'Guide light through dark maze ', benefit: 'Encourages daily reflection and sharpens concentration', icon: Brain, color: 'bg-indigo-100 text-indigo-600' },

      { id: 'word-puzzle-kind-words', name: 'Kind Words Puzzle', desc: 'Find The Word As You Know', benefit: 'Improves mood, builds positive associations', icon: Brain, color: 'bg-green-100 text-green-600' },
      { id: 'safe-zone-builder', name: 'Safe Zone Builder', desc: 'Build your fantasy safe place with objects', benefit: 'Comforts trauma/anxiety, creates mental safety', icon: Heart, color: 'bg-pink-100 text-pink-600' },
      { id: 'flash-zen-trivia', name: 'Flash Zen Trivia', desc: '5 calm knowledge questions for mindful learning', benefit: 'Mindful learning, builds wellness knowledge', icon: Brain, color: 'bg-blue-100 text-blue-600' },
      { id: 'snake-and-ladder', name: 'Snake & Ladder', desc: 'Classic board game vs AI robot opponent', benefit: 'Strategic thinking, patience, resilience building', icon: Target, color: 'bg-orange-100 text-orange-600' },
      { id: 'nokia-snake', name: 'Nokia Snake', desc: 'Classic Nokia phone snake game with retro feel', benefit: 'Hand-eye coordination, focus, nostalgic stress relief', icon: Gamepad2, color: 'bg-green-100 text-green-600' }
    ],
    exercises: [
      { id: 'animated-box-breathing', name: 'Box Breathing', desc: 'Animated 4-4-4-4 breathing pattern', benefit: 'Reduces stress, increases clarity', icon: Wind, color: 'bg-blue-100 text-blue-600' },

      { id: 'progressive-muscle-relaxation', name: 'Muscle Relaxation', desc: 'Progressive muscle relaxation with animations', benefit: 'Releases physical tension', icon: Zap, color: 'bg-red-100 text-red-600' },
      { id: 'neck-rolls', name: 'Neck Rolls', desc: 'Gentle neck movements to release tension', benefit: 'Relieves neck tension, improves flexibility', icon: Activity, color: 'bg-orange-100 text-orange-600' },
      { id: 'stress-ball', name: 'Virtual Stress Ball', desc: 'Tap to squeeze and release tension', benefit: 'Quick stress relief', icon: Target, color: 'bg-orange-100 text-orange-600' },
      { id: 'meditation', name: 'Mini Meditation', desc: 'Guided mindfulness session with timer', benefit: 'Improves body + mind balance', icon: Heart, color: 'bg-purple-100 text-purple-600' },
      { id: 'fire-breath', name: 'Fire Breath', desc: 'Fast inhale/exhale through nose for energy', benefit: 'Boosts energy and alertness', icon: Zap, color: 'bg-red-100 text-red-600' },
      { id: 'cat-cow-stretch', name: 'Cat-Cow Stretch', desc: 'Gentle spine movement on hands and knees', benefit: 'Eases spine tension, improves flexibility', icon: Activity, color: 'bg-yellow-100 text-yellow-600' },

      { id: 'music', name: 'Peaceful Music', desc: 'Calming music tracks for meditation and peace', benefit: 'Calms the mind with curated playlist', icon: Music, color: 'bg-green-100 text-green-600' },
      { id: 'sleep-stories', name: 'Sleep Stories', desc: '25 unique movie-inspired bedtime journeys', benefit: 'Promotes restful sleep with immersive scene-by-scene stories', icon: Moon, color: 'bg-slate-100 text-slate-600' }
    ]
  }

  const renderToolSelection = () => (
    <div className="space-y-6 pb-8">
      {/* Category Tabs */}
      <div className="mobile-grid-responsive">
        {categories.map((category) => {
          const IconComponent = category.icon
          return (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="lg"
              onClick={() => setActiveCategory(category.id as any)}
              className={`h-auto p-4 flex flex-col items-center space-y-2 touch-target min-h-[100px] ${activeCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white border-none`
                  : 'hover:bg-gray-50'
                }`}
            >
              <IconComponent className="w-8 h-8" />
              <span className="mobile-subtext font-medium">{category.name}</span>
            </Button>
          )
        })}
      </div>

      {/* Tools in Selected Category */}
      <div className="space-y-4">
        <h3 className="mobile-heading text-gray-800 dark:text-gray-100 text-center">
          {categories.find(c => c.id === activeCategory)?.name} Tools
        </h3>

        {tools[activeCategory as keyof typeof tools].map((tool: any) => {
          const IconComponent = tool.icon
          return (
            <Card
              key={tool.id}
              className="mobile-card mobile-card-interactive touch-target dark:bg-gray-800 dark:hover:bg-gray-700"
              onClick={() => setCurrentTool(tool.id)}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${tool.color} dark:bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold mobile-text text-gray-800 dark:text-gray-100 mb-1">{tool.name}</h4>
                  <p className="mobile-subtext text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{tool.desc}</p>
                  <p className="mobile-subtext text-green-600 dark:text-green-400 font-medium">✓ {tool.benefit}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Category Info */}
      <Card className="mobile-card bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
        <div className="text-center">
          {activeCategory === 'games' && (
            <p className="mobile-subtext text-blue-800">
              <strong>🎮 Focus Games:</strong> Interactive activities that reduce anxiety, improve coordination, and build emotional skills through engaging gameplay with real-time animations.
            </p>
          )}
          {activeCategory === 'exercises' && (
            <p className="mobile-subtext text-blue-800">
              <strong>🏃‍♀️ Wellness Exercises:</strong> Guided breathing, walking, muscle relaxation, and mindfulness practices with animated instructions for complete mind-body wellness.
            </p>
          )}
        </div>
      </Card>
    </div>
  )

  const renderCurrentTool = () => {
    switch (currentTool) {
      // Games - Mobile Optimized
      case "tapping-ball":
        return <TappingBallMobile onBack={() => handleBackFromActivity("Tapping Ball")} />
      case "puzzle-2048":
        return <Puzzle2048Mobile onBack={() => handleBackFromActivity("Puzzle 2048")} />
      case "breathe-sync-bubble":
        return <BreatheSyncBubble onBack={() => handleBackFromActivity("Breathe Sync Bubble")} />
      case "emotion-match":
        return <EmotionMatch onBack={() => handleBackFromActivity("Emotion Match")} />

      case "paint-my-mood":
        return <PaintMyMoodMobile onBack={() => handleBackFromActivity("Paint My Mood")} />
      case "gratitude-flip-cards":
        return <GratitudeFlipCards onBack={() => handleBackFromActivity("Gratitude Flip Cards")} />
      case "bubble-pop-calm":
        return <BubblePopCalm onBack={() => handleBackFromActivity("Bubble Pop Calm")} />
      case "focus-light-maze":
        return <FocusLightMaze onBack={() => handleBackFromActivity("Focus Light Maze")} />

      case "word-puzzle-kind-words":
        return <WordPuzzleKindWords onBack={() => handleBackFromActivity("Word Puzzle Kind Words")} />
      case "safe-zone-builder":
        return <div className="p-4 text-center">Safe Zone Builder - Coming Soon!</div>
      case "flash-zen-trivia":
        return <FlashZenTrivia onBack={() => handleBackFromActivity("Flash Zen Trivia")} />
      case "snake-and-ladder":
        return <SnakeAndLadder onBack={() => handleBackFromActivity("Snake And Ladder")} />
      case "nokia-snake":
        return <NokiaSnake onBack={() => handleBackFromActivity("Nokia Snake")} />

      // Exercises - Mobile Optimized
      case "animated-box-breathing":
        return <AnimatedBoxBreathingMobile onBack={() => handleBackFromActivity("Animated Box Breathing")} />

      case "progressive-muscle-relaxation":
        return <ProgressiveMuscleRelaxation onBack={() => handleBackFromActivity("Progressive Muscle Relaxation")} />
      case "neck-rolls":
        return <NeckRolls onBack={() => handleBackFromActivity("Neck Rolls")} />
      case "stress-ball":
        return <StressBall onBack={() => handleBackFromActivity("Stress Ball")} />
      case "meditation":
        return <MeditationTimer onBack={() => handleBackFromActivity("Meditation Timer")} />
      case "fire-breath":
        return <FireBreath onBack={() => handleBackFromActivity("Fire Breath")} />
      case "cat-cow-stretch":
        return <CatCowStretch onBack={() => handleBackFromActivity("Cat Cow Stretch")} />

      case "music":
        return <EnhancedMusicPlayer onBack={() => handleBackFromActivity("Music Player")} />
      case "sleep-stories":
        return <EnhancedSleepStories onBack={() => handleBackFromActivity("Sleep Stories")} />

      default:
        return renderToolSelection()
    }
  }

  return (
    <div className="mobile-container mobile-constrained bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={currentTool ? () => setCurrentTool(null) : onBack}
            className="mobile-button touch-target border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="mobile-heading text-gray-800 dark:text-gray-100 text-center flex-1 mx-2">
            {currentTool ? currentTool.charAt(0).toUpperCase() + currentTool.slice(1).replace('-', ' ') : "Self-Care Tools"}
          </h1>
          <div className="w-6" />
        </div>

        {renderCurrentTool()}
      </div>
    </div>
  )
}