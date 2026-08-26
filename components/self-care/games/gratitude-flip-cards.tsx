"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw, Heart, Sparkles } from "lucide-react"
import { MobileFriendlyWrapper } from "../utils/mobile-touch-utils"

interface GratitudeFlipCardsProps {
  onBack: () => void
}

interface GratitudeCard {
  id: number
  prompt: string
  category: string
  icon: string
  flipped: boolean
}

export default function GratitudeFlipCards({ onBack }: GratitudeFlipCardsProps) {
  const [cards, setCards] = useState<GratitudeCard[]>([])
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [dailyReflections, setDailyReflections] = useState<string[]>([])

  const gratitudePrompts = [
    { prompt: "Someone who made you smile yesterday", category: "People", icon: "😊" },
    { prompt: "A delicious meal you enjoyed recently", category: "Food", icon: "🍽️" },
    { prompt: "A comfortable place you felt safe", category: "Places", icon: "🏠" },
    { prompt: "A song that lifted your mood", category: "Music", icon: "🎵" },
    { prompt: "A small act of kindness you witnessed", category: "Kindness", icon: "💝" },
    { prompt: "Something beautiful you saw in nature", category: "Nature", icon: "🌸" },
    { prompt: "A skill or talent you're proud of", category: "Abilities", icon: "⭐" },
    { prompt: "A memory that makes you laugh", category: "Memories", icon: "😄" },
    { prompt: "Something soft or cozy you touched", category: "Sensations", icon: "🤗" },
    { prompt: "A problem that got solved recently", category: "Solutions", icon: "✅" },
    { prompt: "Someone who believes in you", category: "Support", icon: "💪" },
    { prompt: "A moment of peace you experienced", category: "Peace", icon: "🕊️" },
    { prompt: "Something you learned that excited you", category: "Learning", icon: "📚" },
    { prompt: "A part of your body that works well", category: "Health", icon: "❤️" },
    { prompt: "A technology that makes life easier", category: "Technology", icon: "📱" },
    { prompt: "A surprise that made your day better", category: "Surprises", icon: "🎁" }
  ]

  useEffect(() => {
    initializeCards()
  }, [])

  const initializeCards = () => {
    const shuffledPrompts = [...gratitudePrompts].sort(() => Math.random() - 0.5)
    const gameCards = shuffledPrompts.slice(0, 9).map((prompt, index) => ({
      id: index,
      prompt: prompt.prompt,
      category: prompt.category,
      icon: prompt.icon,
      flipped: false
    }))
    setCards(gameCards)
    setSelectedCards([])
  }

  const flipCard = (cardId: number) => {
    if (selectedCards.includes(cardId)) return

    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, flipped: true } : card
    ))
    
    setSelectedCards(prev => [...prev, cardId])
    
    // Add to daily reflections
    const card = cards.find(c => c.id === cardId)
    if (card) {
      setDailyReflections(prev => [...prev, card.prompt])
    }
  }

  const resetCards = () => {
    initializeCards()
    setDailyReflections([])
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'People': 'from-pink-400 to-rose-400',
      'Food': 'from-orange-400 to-amber-400',
      'Places': 'from-green-400 to-emerald-400',
      'Music': 'from-purple-400 to-violet-400',
      'Kindness': 'from-red-400 to-pink-400',
      'Nature': 'from-green-400 to-teal-400',
      'Abilities': 'from-yellow-400 to-orange-400',
      'Memories': 'from-blue-400 to-indigo-400',
      'Sensations': 'from-purple-400 to-pink-400',
      'Solutions': 'from-green-400 to-blue-400',
      'Support': 'from-indigo-400 to-purple-400',
      'Peace': 'from-blue-400 to-cyan-400',
      'Learning': 'from-yellow-400 to-green-400',
      'Health': 'from-red-400 to-rose-400',
      'Technology': 'from-gray-400 to-slate-400',
      'Surprises': 'from-pink-400 to-purple-400'
    }
    return colors[category] || 'from-gray-400 to-gray-500'
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Gratitude Flip Cards</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">Flip cards to discover positive memories from yesterday</p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm font-semibold">Cards flipped: {selectedCards.length}/9</div>
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-sm font-semibold">Daily Gratitude</span>
          </div>
        </div>

        {/* Cards Grid */}
        <MobileFriendlyWrapper className="grid grid-cols-3 gap-4 mb-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="relative h-32 cursor-pointer touch-manipulation"
              onClick={() => flipCard(card.id)}
              onTouchEnd={(e) => { e.preventDefault(); flipCard(card.id) }}
              style={{ touchAction: 'manipulation', minHeight: '128px' }}
            >
              <div className={`absolute inset-0 rounded-lg transition-transform duration-700 transform-style-preserve-3d ${
                card.flipped ? 'rotate-y-180' : ''
              }`}>
                {/* Card Back */}
                <div className="absolute inset-0 backface-hidden rounded-lg bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center shadow-lg">
                  <div className="text-center text-white">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                    <div className="text-xs font-medium">Tap to reveal</div>
                  </div>
                </div>
                
                {/* Card Front */}
                <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-lg bg-gradient-to-br ${getCategoryColor(card.category)} p-4 flex flex-col justify-center shadow-lg`}>
                  <div className="text-center text-white">
                    <div className="text-2xl mb-2">{card.icon}</div>
                    <div className="text-xs font-bold mb-1">{card.category}</div>
                    <div className="text-xs leading-tight">{card.prompt}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </MobileFriendlyWrapper>

        {/* Daily Reflections */}
        {dailyReflections.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Heart className="w-4 h-4 text-red-500 mr-2" />
              Your Gratitude Reflections:
            </h4>
            <div className="space-y-2">
              {dailyReflections.map((reflection, index) => (
                <div key={index} className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-yellow-400">
                  <p className="text-sm text-gray-700">{reflection}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress and Controls */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={resetCards}
            onTouchEnd={(e) => { e.preventDefault(); resetCards() }}
            size="lg"
            className="touch-manipulation"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New Cards
          </Button>
          
          {selectedCards.length === 9 && (
            <div className="text-center">
              <div className="text-green-600 font-bold animate-bounce mb-2">Complete! 🎉</div>
              <div className="text-xs text-gray-600">You've reflected on 9 positive memories!</div>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800 text-center">
            <strong>🌟 Benefits:</strong> Encourages daily reflection • Improves mood • Builds positive thinking patterns • Gratitude practice
          </p>
        </div>

        {/* Gratitude Tips */}
        <div className="mt-4 p-3 bg-orange-50 rounded-lg">
          <h5 className="text-sm font-semibold text-orange-800 mb-2">💡 Gratitude Tips:</h5>
          <ul className="text-xs text-orange-700 space-y-1">
            <li>• Take a moment to really feel grateful for each memory</li>
            <li>• Try to be specific about what made it special</li>
            <li>• Notice how gratitude affects your mood</li>
            <li>• Come back tomorrow for new reflection prompts</li>
          </ul>
        </div>
      </Card>

      <style jsx>{`
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  )
}