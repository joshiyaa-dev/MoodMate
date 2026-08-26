"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import { MobileFriendlyWrapper, useTapDetection } from "../utils/mobile-touch-utils"

interface EmotionMatchProps {
  onBack: () => void
}

interface EmotionCard {
  id: number
  emotion: string
  emoji: string
  flipped: boolean
  matched: boolean
}

export default function EmotionMatch({ onBack }: EmotionMatchProps) {
  const [cards, setCards] = useState<EmotionCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matches, setMatches] = useState(0)
  const [moves, setMoves] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)

  const emotions = [
    { emotion: 'happy', emoji: '😊' },
    { emotion: 'sad', emoji: '😢' },
    { emotion: 'angry', emoji: '😠' },
    { emotion: 'calm', emoji: '😌' },
    { emotion: 'excited', emoji: '🤩' },
    { emotion: 'worried', emoji: '😰' },
    { emotion: 'love', emoji: '🥰' },
    { emotion: 'surprised', emoji: '😲' }
  ]

  const initializeGame = () => {
    const gameCards: EmotionCard[] = []
    let id = 0

    emotions.forEach(emotion => {
      // Add two cards for each emotion (for matching)
      gameCards.push({
        id: id++,
        emotion: emotion.emotion,
        emoji: emotion.emoji,
        flipped: false,
        matched: false
      })
      gameCards.push({
        id: id++,
        emotion: emotion.emotion,
        emoji: emotion.emoji,
        flipped: false,
        matched: false
      })
    })

    // Shuffle cards
    const shuffled = gameCards.sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setFlippedCards([])
    setMatches(0)
    setMoves(0)
    setGameComplete(false)
  }

  useEffect(() => {
    initializeGame()
  }, [])

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards
      const firstCard = cards.find(card => card.id === first)
      const secondCard = cards.find(card => card.id === second)

      if (firstCard && secondCard && firstCard.emotion === secondCard.emotion) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, matched: true }
              : card
          ))
          setMatches(prev => prev + 1)
          setFlippedCards([])
        }, 1000)
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, flipped: false }
              : card
          ))
          setFlippedCards([])
        }, 1000)
      }
      setMoves(prev => prev + 1)
    }
  }, [flippedCards, cards])

  useEffect(() => {
    if (matches === emotions.length) {
      setGameComplete(true)
    }
  }, [matches])

  const flipCard = (cardId: number) => {
    if (flippedCards.length >= 2) return
    if (flippedCards.includes(cardId)) return
    
    const card = cards.find(c => c.id === cardId)
    if (card?.matched) return

    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, flipped: true } : card
    ))
    setFlippedCards(prev => [...prev, cardId])
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="mobile-heading text-gray-800 dark:text-gray-100 mb-2">Emotion Match Game</h3>
        <p className="mobile-text text-gray-600 dark:text-gray-300">Match emoji pairs to build emotional recognition</p>
      </div>

      <Card className="mobile-card bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="flex justify-between items-center mb-4">
          <div className="mobile-subtext font-semibold">Matches: {matches}/{emotions.length}</div>
          <div className="mobile-subtext font-semibold">Moves: {moves}</div>
          {gameComplete && (
            <div className="text-green-600 mobile-subtext font-bold animate-bounce">Complete! 🎉</div>
          )}
        </div>

        {/* Game Grid */}
        <MobileFriendlyWrapper className="grid grid-cols-4 gap-3 mb-6">
          {cards.map(card => (
            <div
              key={card.id}
              className={`aspect-square rounded-lg cursor-pointer transition-all duration-300 flex items-center justify-center text-2xl font-bold touch-manipulation min-h-[60px] ${
                card.flipped || card.matched
                  ? 'bg-white shadow-lg transform scale-105'
                  : 'bg-gradient-to-br from-purple-200 to-pink-200 hover:from-purple-300 hover:to-pink-300 active:scale-95'
              } ${card.matched ? 'ring-2 ring-green-400' : ''}`}
              onClick={() => flipCard(card.id)}
              onTouchEnd={(e) => { e.preventDefault(); flipCard(card.id) }}
              style={{ touchAction: 'manipulation' }}
            >
              {card.flipped || card.matched ? (
                <div className="text-center">
                  <div className="text-3xl mb-1">{card.emoji}</div>
                  <div className="text-xs text-gray-600 capitalize">{card.emotion}</div>
                </div>
              ) : (
                <div className="text-purple-600">?</div>
              )}
            </div>
          ))}
        </MobileFriendlyWrapper>

        <div className="flex flex-col space-y-3">
          <Button 
            variant="outline" 
            onClick={initializeGame} 
            onTouchEnd={(e) => { e.preventDefault(); initializeGame() }}
            size="lg"
            className="touch-manipulation"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New Game
          </Button>
          
          <div className="mobile-subtext text-gray-500 text-center">
            Benefits: Builds emotional recognition • Improves memory • Mindfulness
          </div>
        </div>

        {gameComplete && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg text-center">
            <p className="text-green-800 font-semibold">
              Great job! You completed the game in {moves} moves! 🌟
            </p>
            <p className="text-sm text-green-600 mt-2">
              You've improved your emotional recognition skills!
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}