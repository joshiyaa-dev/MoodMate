"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw, Brain, Clock } from "lucide-react"
import { MobileFriendlyWrapper } from "../utils/mobile-touch-utils"

interface FlashZenTriviaProps {
  onBack: () => void
}

interface Question {
  question: string
  options: string[]
  correct: number
  explanation: string
  category: string
}

export default function FlashZenTrivia({ onBack }: FlashZenTriviaProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15)
  const [gameComplete, setGameComplete] = useState(false)

  const questions: Question[] = [
    {
      question: "What color is scientifically proven to calm the brain most?",
      options: ["Red", "Blue", "Green", "Purple"],
      correct: 1,
      explanation: "Blue light has been shown to reduce stress hormones and lower heart rate, making it the most calming color for the brain.",
      category: "Color Psychology"
    },
    {
      question: "How many minutes of deep breathing can reduce anxiety?",
      options: ["1 minute", "3 minutes", "10 minutes", "30 minutes"],
      correct: 1,
      explanation: "Just 3 minutes of deep breathing can activate the parasympathetic nervous system and significantly reduce anxiety levels.",
      category: "Breathing Science"
    },
    {
      question: "What is the ideal room temperature for better sleep?",
      options: ["75°F (24°C)", "68°F (20°C)", "60°F (16°C)", "72°F (22°C)"],
      correct: 1,
      explanation: "68°F (20°C) is the optimal temperature for sleep as it helps your body's natural temperature drop that signals sleepiness.",
      category: "Sleep Science"
    },
    {
      question: "Which natural sound is most effective for relaxation?",
      options: ["Ocean waves", "Bird songs", "Rain", "White noise"],
      correct: 0,
      explanation: "Ocean waves create a consistent, rhythmic pattern that naturally synchronizes with brain waves, promoting deep relaxation.",
      category: "Sound Therapy"
    },
    {
      question: "How long should you hold a yoga pose for maximum benefit?",
      options: ["10 seconds", "30 seconds", "1 minute", "5 minutes"],
      correct: 1,
      explanation: "30 seconds allows muscles to relax and stretch properly while being long enough to gain flexibility benefits without strain.",
      category: "Movement Therapy"
    },
    {
      question: "What time of day is cortisol (stress hormone) naturally lowest?",
      options: ["Morning", "Afternoon", "Evening", "Midnight"],
      correct: 2,
      explanation: "Cortisol naturally drops in the evening, which is why evening activities like meditation are particularly effective for stress relief.",
      category: "Circadian Rhythm"
    },
    {
      question: "Which essential oil is most scientifically proven for anxiety relief?",
      options: ["Peppermint", "Lavender", "Eucalyptus", "Lemon"],
      correct: 1,
      explanation: "Lavender has the most research supporting its anxiety-reducing effects, with studies showing it can lower heart rate and blood pressure.",
      category: "Aromatherapy"
    },
    {
      question: "How many gratitude items should you write daily for maximum happiness boost?",
      options: ["1 item", "3 items", "5 items", "10 items"],
      correct: 1,
      explanation: "Research shows writing 3 gratitude items daily is the sweet spot - enough to create positive change without becoming routine.",
      category: "Positive Psychology"
    },
    {
      question: "What percentage of our thoughts are repetitive each day?",
      options: ["50%", "70%", "80%", "95%"],
      correct: 3,
      explanation: "Studies show 95% of our thoughts are repetitive, which is why mindfulness practices that break thought patterns are so effective.",
      category: "Neuroscience"
    },
    {
      question: "How many minutes of walking can improve mood immediately?",
      options: ["5 minutes", "10 minutes", "20 minutes", "30 minutes"],
      correct: 0,
      explanation: "Just 5 minutes of walking can release endorphins and improve mood, making it one of the fastest natural mood boosters.",
      category: "Exercise Science"
    }
  ]

  useEffect(() => {
    if (timeLeft > 0 && !showResult && !gameComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp()
    }
  }, [timeLeft, showResult, gameComplete])

  const handleTimeUp = () => {
    setShowResult(true)
    setTimeout(() => {
      nextQuestion()
    }, 3000)
  }

  const handleAnswer = (answerIndex: number) => {
    if (showResult) return
    
    setSelectedAnswer(answerIndex)
    setShowResult(true)
    
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(prev => prev + 1)
    }
    
    setTimeout(() => {
      nextQuestion()
    }, 3000)
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setTimeLeft(15)
    } else {
      setGameComplete(true)
    }
  }

  const resetGame = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowResult(false)
    setTimeLeft(15)
    setGameComplete(false)
  }

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100
    if (percentage >= 80) return { message: "Zen Master! 🧘‍♀️", color: "text-green-600" }
    if (percentage >= 60) return { message: "Wellness Warrior! 💪", color: "text-blue-600" }
    if (percentage >= 40) return { message: "Mindful Learner! 🌱", color: "text-yellow-600" }
    return { message: "Keep Exploring! 🌟", color: "text-purple-600" }
  }

  if (gameComplete) {
    const scoreMsg = getScoreMessage()
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Flash Zen Trivia</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">5 calm knowledge questions</p>
        </div>

        <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
          <div className={`text-3xl font-bold mb-2 ${scoreMsg.color}`}>
            {score}/{questions.length}
          </div>
          <div className={`text-xl mb-6 ${scoreMsg.color}`}>
            {scoreMsg.message}
          </div>
          
          <div className="bg-white p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">🧠 Knowledge Gained:</h4>
            <p className="text-sm text-gray-600">
              You've learned {score} new wellness facts that can help improve your daily mindfulness and self-care practices!
            </p>
          </div>

          <Button 
            onClick={resetGame} 
            onTouchEnd={(e) => { e.preventDefault(); resetGame() }}
            size="lg"
            className="bg-purple-500 hover:bg-purple-600 touch-manipulation"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </Card>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Flash Zen Trivia</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">5 calm knowledge questions for mindful learning</p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50">
        {/* Progress and Timer */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm font-semibold">
            Question {currentQuestion + 1}/{questions.length}
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <div className={`text-sm font-semibold ${timeLeft <= 5 ? 'text-red-600 animate-pulse' : 'text-purple-600'}`}>
              {timeLeft}s
            </div>
          </div>
          <div className="text-sm font-semibold">
            Score: {score}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Category Badge */}
        <div className="text-center mb-4">
          <span className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
            {question.category}
          </span>
        </div>

        {/* Question */}
        <Card className="p-6 bg-white mb-6">
          <div className="text-center">
            <Brain className="w-8 h-8 text-purple-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              {question.question}
            </h4>
          </div>
        </Card>

        {/* Answer Options */}
        <MobileFriendlyWrapper className="space-y-3 mb-6">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              onTouchEnd={(e) => { e.preventDefault(); handleAnswer(index) }}
              disabled={showResult}
              className={`w-full p-4 text-left rounded-lg transition-all duration-200 touch-manipulation min-h-[60px] ${
                showResult
                  ? index === question.correct
                    ? 'bg-green-100 border-2 border-green-400 text-green-800'
                    : selectedAnswer === index
                    ? 'bg-red-100 border-2 border-red-400 text-red-800'
                    : 'bg-gray-100 text-gray-600'
                  : 'bg-white hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-300 active:bg-purple-100'
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                  showResult && index === question.correct
                    ? 'bg-green-500 text-white'
                    : showResult && selectedAnswer === index && index !== question.correct
                    ? 'bg-red-500 text-white'
                    : 'bg-purple-200 text-purple-800'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="font-medium">{option}</span>
              </div>
            </button>
          ))}
        </MobileFriendlyWrapper>

        {/* Explanation */}
        {showResult && (
          <Card className="p-4 bg-blue-50 border border-blue-200">
            <div className="text-center">
              <h5 className="font-semibold text-blue-800 mb-2">
                {selectedAnswer === question.correct ? '✅ Correct!' : '❌ Not quite!'}
              </h5>
              <p className="text-sm text-blue-700">
                <strong>Explanation:</strong> {question.explanation}
              </p>
            </div>
          </Card>
        )}

        <div className="mt-6 p-3 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-800 text-center">
            <strong>🧠 Benefits:</strong> Mindful learning in short bursts • Builds wellness knowledge • Improves focus • Reduces mental clutter
          </p>
        </div>
      </Card>
    </div>
  )
}