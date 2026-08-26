"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw, Lightbulb, Check, Trophy } from "lucide-react"
import { MobileFriendlyWrapper } from "../utils/mobile-touch-utils"

interface WordPuzzleKindWordsProps {
  onBack: () => void
}

type DifficultyLevel = 'easy' | 'hard' | 'pro'

interface WordData {
  word: string
  hints: string[]
  meaning: string
}

export default function WordPuzzleKindWords({ onBack }: WordPuzzleKindWordsProps) {
  const [currentWord, setCurrentWord] = useState("")
  const [scrambledWord, setScrambledWord] = useState("")
  const [userInput, setUserInput] = useState("")
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy')
  const [wordsCompleted, setWordsCompleted] = useState<string[]>([])
  const [currentHintLevel, setCurrentHintLevel] = useState(0)

  const wordDatabase: Record<DifficultyLevel, WordData[]> = {
    easy: [
      { word: "JOY", hints: ["3 letters", "Feeling of happiness", "What you feel when laughing"], meaning: "Pure delight and happiness" },
      { word: "LOVE", hints: ["4 letters", "Deep caring feeling", "What families share"], meaning: "Strong affection and care" },
      { word: "HOPE", hints: ["4 letters", "Positive feeling about future", "Light in darkness"], meaning: "Optimistic expectation" },
      { word: "CALM", hints: ["4 letters", "Peaceful state", "Opposite of chaos"], meaning: "Free from agitation" },
      { word: "KIND", hints: ["4 letters", "Being nice to others", "Gentle nature"], meaning: "Showing compassion" },
      { word: "SMILE", hints: ["5 letters", "Happy face expression", "Shows joy"], meaning: "Expression of happiness" },
      { word: "PEACE", hints: ["5 letters", "No fighting", "Harmony and quiet"], meaning: "State of tranquility" },
      { word: "TRUST", hints: ["5 letters", "Believing in someone", "Faith in others"], meaning: "Confident reliance" },
      { word: "LIGHT", hints: ["5 letters", "Opposite of dark", "Brightness"], meaning: "Illumination and hope" },
      { word: "GENTLE", hints: ["6 letters", "Soft and caring", "Not rough"], meaning: "Tender and mild" },
      { word: "WARMTH", hints: ["6 letters", "Cozy feeling", "Heat and comfort"], meaning: "Comfortable temperature" },
      { word: "COMFORT", hints: ["7 letters", "Feeling at ease", "Relief from pain"], meaning: "Physical ease and consolation" },
      { word: "COURAGE", hints: ["7 letters", "Being brave", "Facing fears"], meaning: "Strength in facing challenges" },
      { word: "HEALING", hints: ["7 letters", "Getting better", "Recovery process"], meaning: "Becoming whole again" },
      { word: "WISDOM", hints: ["6 letters", "Deep knowledge", "Learning from experience"], meaning: "Good judgment from experience" },
      { word: "GRACE", hints: ["5 letters", "Elegant movement", "Divine blessing"], meaning: "Elegance and divine favor" },
      { word: "FAITH", hints: ["5 letters", "Strong belief", "Trust without proof"], meaning: "Complete trust" },
      { word: "UNITY", hints: ["5 letters", "Being together", "Oneness"], meaning: "State of being united" },
      { word: "HAPPY", hints: ["5 letters", "Feeling good", "Opposite of sad"], meaning: "Feeling joy and contentment" },
      { word: "GLORY", hints: ["5 letters", "Great honor", "Magnificent beauty"], meaning: "Magnificent beauty or honor" },
      { word: "SAFE", hints: ["4 letters", "Protected from harm", "Secure and sound"], meaning: "Free from danger" },
      { word: "PURE", hints: ["4 letters", "Clean and innocent", "Not mixed"], meaning: "Free from contamination" },
      { word: "SWEET", hints: ["5 letters", "Pleasant taste", "Kind and gentle"], meaning: "Having pleasant qualities" },
      { word: "FRESH", hints: ["5 letters", "New and clean", "Recently made"], meaning: "Recently made or obtained" },
      { word: "BRIGHT", hints: ["6 letters", "Full of light", "Intelligent"], meaning: "Giving out light" },
      { word: "CLEAR", hints: ["5 letters", "Easy to understand", "Transparent"], meaning: "Transparent or obvious" },
      { word: "CLEAN", hints: ["5 letters", "Free from dirt", "Pure and neat"], meaning: "Free from dirt or contamination" },
      { word: "STRONG", hints: ["6 letters", "Having power", "Not weak"], meaning: "Having great strength" },
      { word: "BRAVE", hints: ["5 letters", "Showing courage", "Not afraid"], meaning: "Ready to face danger" },
      { word: "NOBLE", hints: ["5 letters", "Having honor", "Morally good"], meaning: "Having fine personal qualities" },
      { word: "HONEST", hints: ["6 letters", "Telling truth", "Not lying"], meaning: "Free of deceit" },
      { word: "LOYAL", hints: ["5 letters", "Always faithful", "Devoted"], meaning: "Giving firm support" },
      { word: "CARING", hints: ["6 letters", "Showing concern", "Looking after others"], meaning: "Displaying kindness" },
      { word: "HUMBLE", hints: ["6 letters", "Not proud", "Modest"], meaning: "Having a modest opinion" },
      { word: "GIVING", hints: ["6 letters", "Sharing with others", "Generous"], meaning: "Providing freely" },
      { word: "LOVING", hints: ["6 letters", "Full of love", "Affectionate"], meaning: "Feeling deep affection" },
      { word: "TENDER", hints: ["6 letters", "Soft and gentle", "Caring touch"], meaning: "Showing gentleness" },
      { word: "STEADY", hints: ["6 letters", "Not shaking", "Reliable"], meaning: "Firmly fixed" },
      { word: "SECURE", hints: ["6 letters", "Safe and protected", "Not worried"], meaning: "Fixed and safe" },
      { word: "GOLDEN", hints: ["6 letters", "Like precious metal", "Very valuable"], meaning: "Made of gold" },
      { word: "SACRED", hints: ["6 letters", "Holy and special", "Deserving respect"], meaning: "Connected with religion" },
      { word: "BLESSED", hints: ["7 letters", "Given good fortune", "Favored by divine"], meaning: "Made holy" },
      { word: "PERFECT", hints: ["7 letters", "Without flaws", "Completely right"], meaning: "Having no defects" },
      { word: "WELCOME", hints: ["7 letters", "Greeting warmly", "Pleased to see"], meaning: "Greeting hospitably" },
      { word: "REFRESH", hints: ["7 letters", "Making new again", "Giving new energy"], meaning: "Give new strength" },
      { word: "RESTORE", hints: ["7 letters", "Bringing back", "Making like new"], meaning: "Return to former condition" },
      { word: "PROTECT", hints: ["7 letters", "Keep safe", "Guard from harm"], meaning: "Keep safe from harm" },
      { word: "CHERISH", hints: ["7 letters", "Hold dear", "Treasure"], meaning: "Protect lovingly" },
      { word: "SUPPORT", hints: ["7 letters", "Help and encourage", "Hold up"], meaning: "Give assistance to" },
      { word: "INSPIRE", hints: ["7 letters", "Fill with creativity", "Motivate"], meaning: "Fill with urge to do" },
      { word: "RESPECT", hints: ["7 letters", "Showing honor", "Treating well"], meaning: "Deep admiration" },
      { word: "DIGNITY", hints: ["7 letters", "Self-respect", "Noble bearing"], meaning: "State of being worthy" },
      { word: "FREEDOM", hints: ["7 letters", "Being free", "Not controlled"], meaning: "Power to act freely" },
      { word: "TRIUMPH", hints: ["7 letters", "Great victory", "Success"], meaning: "Great victory or achievement" },
      { word: "DELIGHT", hints: ["7 letters", "Great pleasure", "Joy"], meaning: "Feeling of happiness" },
      { word: "RADIANT", hints: ["7 letters", "Shining bright", "Glowing"], meaning: "Sending out light" },
      { word: "VIBRANT", hints: ["7 letters", "Full of energy", "Bright colors"], meaning: "Full of energy" },
      { word: "MAGICAL", hints: ["7 letters", "Like magic", "Wonderful"], meaning: "Having supernatural powers" },
      { word: "AMAZING", hints: ["7 letters", "Causing wonder", "Surprising"], meaning: "Causing great surprise" },
      { word: "AWESOME", hints: ["7 letters", "Inspiring wonder", "Excellent"], meaning: "Extremely impressive" },
      { word: "PERFECT", hints: ["7 letters", "Without faults", "Ideal"], meaning: "As good as possible" }
    ],
    hard: [
      { word: "SERENITY", hints: ["8 letters", "Complete peacefulness", "Calm acceptance"], meaning: "State of being serene" },
      { word: "HARMONY", hints: ["7 letters", "Everything in balance", "Musical agreement"], meaning: "Pleasant combination" },
      { word: "BLISSFUL", hints: ["8 letters", "Perfect happiness", "Extremely joyful"], meaning: "Complete happiness" },
      { word: "GRATITUDE", hints: ["9 letters", "Being thankful", "Appreciation for gifts"], meaning: "Quality of being grateful" },
      { word: "EMPATHY", hints: ["7 letters", "Understanding others' feelings", "Walking in someone's shoes"], meaning: "Understanding others' emotions" },
      { word: "COMPASSION", hints: ["10 letters", "Deep caring for suffering", "Desire to help others"], meaning: "Sympathetic concern" },
      { word: "PATIENCE", hints: ["8 letters", "Waiting calmly", "Not rushing"], meaning: "Ability to wait calmly" },
      { word: "KINDNESS", hints: ["8 letters", "Being good to others", "Gentle behavior"], meaning: "Quality of being kind" },
      { word: "GENEROUS", hints: ["8 letters", "Giving freely", "Not selfish"], meaning: "Willing to give" },
      { word: "FORGIVING", hints: ["9 letters", "Letting go of anger", "Pardoning mistakes"], meaning: "Ready to forgive" },
      { word: "NURTURING", hints: ["9 letters", "Caring for growth", "Helping development"], meaning: "Caring for and encouraging" },
      { word: "MINDFUL", hints: ["7 letters", "Being present", "Aware of now"], meaning: "Conscious and aware" },
      { word: "BALANCED", hints: ["8 letters", "In harmony", "Not extreme"], meaning: "In a state of equilibrium" },
      { word: "AUTHENTIC", hints: ["9 letters", "Being true to yourself", "Genuine and real"], meaning: "Genuine and original" },
      { word: "RESILIENT", hints: ["9 letters", "Bouncing back", "Strong after hardship"], meaning: "Able to recover quickly" },
      { word: "TRANQUIL", hints: ["8 letters", "Very peaceful", "Free from disturbance"], meaning: "Free from agitation" },
      { word: "HUMBLE", hints: ["6 letters", "Not proud", "Modest attitude"], meaning: "Having a modest opinion" },
      { word: "SINCERE", hints: ["7 letters", "Honest and genuine", "Truthful feelings"], meaning: "Free from pretense" },
      { word: "DEVOTED", hints: ["7 letters", "Completely committed", "Loyal and loving"], meaning: "Very loving and loyal" },
      { word: "CHERISH", hints: ["7 letters", "Hold dear", "Treasure something"], meaning: "Protect and care for lovingly" },
      { word: "GRACIOUS", hints: ["8 letters", "Courteous and kind", "Showing grace"], meaning: "Courteous and kind" },
      { word: "PEACEFUL", hints: ["8 letters", "Free from conflict", "Calm and quiet"], meaning: "Free from disturbance" },
      { word: "HOPEFUL", hints: ["7 letters", "Full of hope", "Optimistic"], meaning: "Feeling optimistic" },
      { word: "JOYFUL", hints: ["6 letters", "Full of joy", "Very happy"], meaning: "Feeling great happiness" },
      { word: "CHEERFUL", hints: ["8 letters", "Happy and positive", "In good spirits"], meaning: "Happy and optimistic" },
      { word: "PLEASANT", hints: ["8 letters", "Giving pleasure", "Agreeable"], meaning: "Giving satisfaction" },
      { word: "POSITIVE", hints: ["8 letters", "Optimistic attitude", "Good and confident"], meaning: "Constructive and confident" },
      { word: "FAITHFUL", hints: ["8 letters", "Loyal and true", "Keeping promises"], meaning: "Loyal and committed" },
      { word: "TRUTHFUL", hints: ["8 letters", "Always honest", "Speaking truth"], meaning: "Telling the truth" },
      { word: "GRACEFUL", hints: ["8 letters", "Moving elegantly", "Having grace"], meaning: "Having elegance" },
      { word: "POWERFUL", hints: ["8 letters", "Having strength", "Influential"], meaning: "Having great strength" },
      { word: "WONDERFUL", hints: ["9 letters", "Inspiring wonder", "Marvelous"], meaning: "Inspiring delight" },
      { word: "BEAUTIFUL", hints: ["9 letters", "Pleasing to see", "Attractive"], meaning: "Pleasant to look at" },
      { word: "BRILLIANT", hints: ["9 letters", "Very bright", "Exceptionally clever"], meaning: "Very bright or clever" },
      { word: "EXCELLENT", hints: ["9 letters", "Extremely good", "Outstanding"], meaning: "Extremely good" },
      { word: "FANTASTIC", hints: ["9 letters", "Extraordinarily good", "Amazing"], meaning: "Extraordinarily good" },
      { word: "MARVELOUS", hints: ["9 letters", "Causing wonder", "Excellent"], meaning: "Causing wonder" },
      { word: "SPLENDID", hints: ["8 letters", "Magnificent", "Very impressive"], meaning: "Magnificent and impressive" },
      { word: "GLORIOUS", hints: ["8 letters", "Having glory", "Magnificent"], meaning: "Having magnificence" },
      { word: "PRECIOUS", hints: ["8 letters", "Very valuable", "Much loved"], meaning: "Of great worth" },
      { word: "HEAVENLY", hints: ["8 letters", "Like heaven", "Divine"], meaning: "Of heaven or divine" },
      { word: "BLESSED", hints: ["7 letters", "Favored by divine", "Sacred"], meaning: "Made holy" },
      { word: "ETERNAL", hints: ["7 letters", "Lasting forever", "Without end"], meaning: "Lasting forever" },
      { word: "INFINITE", hints: ["8 letters", "Without limits", "Endless"], meaning: "Limitless or endless" },
      { word: "PERFECT", hints: ["7 letters", "Without flaws", "Ideal"], meaning: "Without defects" },
      { word: "COMPLETE", hints: ["8 letters", "Having all parts", "Finished"], meaning: "Having all necessary parts" },
      { word: "ABSOLUTE", hints: ["8 letters", "Total and complete", "Not qualified"], meaning: "Not qualified or diminished" },
      { word: "ULTIMATE", hints: ["8 letters", "Final and best", "Greatest"], meaning: "Being the best possible" },
      { word: "SUPREME", hints: ["7 letters", "Highest in authority", "Greatest"], meaning: "Highest in authority" },
      { word: "DIVINE", hints: ["6 letters", "Of or like God", "Excellent"], meaning: "Of God or a god" },
      { word: "SACRED", hints: ["6 letters", "Connected to God", "Holy"], meaning: "Connected with God" },
      { word: "BLESSED", hints: ["7 letters", "Made holy", "Fortunate"], meaning: "Made holy or consecrated" }
    ],
    pro: [
      { word: "ENLIGHTENMENT", hints: ["13 letters", "Spiritual awakening", "Deep understanding of truth"], meaning: "State of having knowledge" },
      { word: "TRANSCENDENCE", hints: ["12 letters", "Rising above", "Going beyond normal limits"], meaning: "Existence beyond physical" },
      { word: "BENEVOLENCE", hints: ["11 letters", "Desire to do good", "Kindness and generosity"], meaning: "Disposition to do good" },
      { word: "MAGNANIMOUS", hints: ["11 letters", "Very generous", "Noble in spirit"], meaning: "Generous and forgiving" },
      { word: "EQUANIMITY", hints: ["10 letters", "Mental calmness", "Composure under stress"], meaning: "Mental calmness and composure" },
      { word: "ALTRUISTIC", hints: ["10 letters", "Selfless concern", "Putting others first"], meaning: "Showing unselfish concern" },
      { word: "PERSEVERANCE", hints: ["12 letters", "Never giving up", "Continued effort despite difficulty"], meaning: "Persistence in doing something" },
      { word: "RIGHTEOUSNESS", hints: ["13 letters", "Moral correctness", "Being morally right"], meaning: "Quality of being morally right" },
      { word: "CONTEMPLATION", hints: ["13 letters", "Deep thoughtful observation", "Reflective meditation"], meaning: "Deep reflective thought" },
      { word: "COMPASSIONATE", hints: ["13 letters", "Showing deep care", "Feeling others' pain"], meaning: "Showing compassion" },
      { word: "PHILOSOPHICAL", hints: ["13 letters", "Deep thinking", "Relating to wisdom"], meaning: "Relating to philosophy" },
      { word: "UNDERSTANDING", hints: ["13 letters", "Comprehending others", "Sympathetic awareness"], meaning: "Sympathetic awareness" },
      { word: "UNCONDITIONAL", hints: ["13 letters", "Without limits", "No conditions attached"], meaning: "Not subject to conditions" },
      { word: "TRANSFORMATION", hints: ["14 letters", "Complete change", "Thorough alteration"], meaning: "Marked change in form" },
      { word: "INTROSPECTION", hints: ["13 letters", "Looking within", "Examining your thoughts"], meaning: "Examination of one's thoughts" },
      { word: "APPRECIATION", hints: ["12 letters", "Recognizing value", "Grateful recognition"], meaning: "Recognition of worth" },
      { word: "REJUVENATION", hints: ["12 letters", "Feeling young again", "Restoration of energy"], meaning: "Process of making young again" },
      { word: "ENLIGHTENING", hints: ["12 letters", "Giving knowledge", "Providing insight"], meaning: "Giving insight or knowledge" },
      { word: "INSPIRATIONAL", hints: ["13 letters", "Motivating others", "Filling with enthusiasm"], meaning: "Providing creative stimulus" },
      { word: "EXTRAORDINARY", hints: ["13 letters", "Beyond ordinary", "Remarkably exceptional"], meaning: "Very unusual or remarkable" },
      { word: "PHENOMENAL", hints: ["10 letters", "Remarkable", "Extraordinary"], meaning: "Very remarkable" },
      { word: "MAGNIFICENT", hints: ["11 letters", "Impressively beautiful", "Splendid"], meaning: "Impressively beautiful" },
      { word: "SPECTACULAR", hints: ["11 letters", "Visually striking", "Impressive display"], meaning: "Beautiful in dramatic way" },
      { word: "EXCEPTIONAL", hints: ["11 letters", "Unusually good", "Outstanding"], meaning: "Unusually good" },
      { word: "OUTSTANDING", hints: ["11 letters", "Clearly excellent", "Prominent"], meaning: "Clearly noticeable" },
      { word: "REMARKABLE", hints: ["10 letters", "Worth noticing", "Extraordinary"], meaning: "Worth paying attention to" },
      { word: "INCREDIBLE", hints: ["10 letters", "Hard to believe", "Amazing"], meaning: "Impossible to believe" },
      { word: "ASTONISHING", hints: ["11 letters", "Extremely surprising", "Amazing"], meaning: "Extremely surprising" },
      { word: "BREATHTAKING", hints: ["12 letters", "Extremely exciting", "Awe-inspiring"], meaning: "Astonishing or awe-inspiring" },
      { word: "OVERWHELMING", hints: ["12 letters", "Very intense", "Too much to handle"], meaning: "Very intense" },
      { word: "UNFORGETTABLE", hints: ["13 letters", "Impossible to forget", "Memorable"], meaning: "Impossible to forget" },
      { word: "UNBELIEVABLE", hints: ["12 letters", "Hard to believe", "Incredible"], meaning: "Not able to be believed" },
      { word: "INDESCRIBABLE", hints: ["13 letters", "Too extreme for words", "Cannot be described"], meaning: "Too extreme to describe" },
      { word: "IMMEASURABLE", hints: ["12 letters", "Too great to measure", "Limitless"], meaning: "Too great to measure" },
      { word: "INEXHAUSTIBLE", hints: ["13 letters", "Never running out", "Unlimited supply"], meaning: "Available in unlimited quantity" },
      { word: "INCOMPARABLE", hints: ["12 letters", "Without equal", "Unique"], meaning: "Without an equal" },
      { word: "IRREPLACEABLE", hints: ["13 letters", "Cannot be replaced", "Unique"], meaning: "Impossible to replace" },
      { word: "INVINCIBLE", hints: ["10 letters", "Too strong to defeat", "Unbeatable"], meaning: "Too powerful to defeat" },
      { word: "UNSTOPPABLE", hints: ["11 letters", "Cannot be stopped", "Determined"], meaning: "Impossible to stop" },
      { word: "UNSHAKEABLE", hints: ["11 letters", "Cannot be moved", "Firm belief"], meaning: "Not able to be changed" },
      { word: "UNWAVERING", hints: ["10 letters", "Steady and resolute", "Not changing"], meaning: "Steady or resolute" },
      { word: "UNDAUNTED", hints: ["9 letters", "Not intimidated", "Fearless"], meaning: "Not intimidated" },
      { word: "FEARLESS", hints: ["8 letters", "Without fear", "Brave"], meaning: "Showing no fear" },
      { word: "LIMITLESS", hints: ["9 letters", "Without boundaries", "Infinite"], meaning: "Without end or limit" },
      { word: "BOUNDLESS", hints: ["9 letters", "Without limits", "Unlimited"], meaning: "Unlimited or immense" },
      { word: "ENDLESS", hints: ["7 letters", "Having no end", "Continuing forever"], meaning: "Having no end or limit" },
      { word: "TIMELESS", hints: ["8 letters", "Not affected by time", "Eternal"], meaning: "Not affected by passage of time" },
      { word: "PRICELESS", hints: ["9 letters", "Too valuable to price", "Invaluable"], meaning: "So valuable as to be priceless" },
      { word: "WORTHLESS", hints: ["9 letters", "Having no value", "Useless"], meaning: "Having no real value" },
      { word: "MEANINGLESS", hints: ["11 letters", "Without meaning", "Insignificant"], meaning: "Having no meaning" },
      { word: "PURPOSEFUL", hints: ["10 letters", "Having clear aim", "Determined"], meaning: "Having or showing determination" },
      { word: "INTENTIONAL", hints: ["11 letters", "Done on purpose", "Deliberate"], meaning: "Done consciously" },
      { word: "DELIBERATE", hints: ["10 letters", "Done consciously", "Careful"], meaning: "Done consciously" },
      { word: "THOUGHTFUL", hints: ["10 letters", "Showing consideration", "Caring"], meaning: "Showing consideration" },
      { word: "CONSIDERATE", hints: ["11 letters", "Careful not to harm", "Thoughtful"], meaning: "Careful not to cause inconvenience" }
    ]
  }

  const getCurrentWordList = (): WordData[] => wordDatabase[difficulty as keyof typeof wordDatabase]

  useEffect(() => {
    generateNewWord()
  }, [])

  const scrambleWord = (word: string) => {
    const letters = word.split('')
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[letters[i], letters[j]] = [letters[j], letters[i]]
    }
    return letters.join('')
  }

  const generateNewWord = () => {
    const currentWords = getCurrentWordList()
    const availableWords = currentWords.filter(w => !wordsCompleted.includes(w.word))
    
    if (availableWords.length === 0) {
      // All words completed, reset or advance difficulty
      setWordsCompleted([])
      setRound(1)
    }
    
    const wordList = availableWords.length > 0 ? availableWords : currentWords
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)]
    
    setCurrentWord(randomWord.word)
    setScrambledWord(scrambleWord(randomWord.word))
    setUserInput("")
    setIsCorrect(false)
    setShowHint(false)
    setCurrentHintLevel(0)
  }

  const checkAnswer = () => {
    if (userInput.toUpperCase() === currentWord) {
      setIsCorrect(true)
      setWordsCompleted((prev: string[]) => [...prev, currentWord])
      
      // Score based on difficulty and hints used
      const baseScore = difficulty === 'easy' ? 10 : difficulty === 'hard' ? 20 : 30
      const hintPenalty = currentHintLevel * 2
      const finalScore = Math.max(baseScore - hintPenalty, 5)
      setScore((prev: number) => prev + finalScore)
      
      setTimeout(() => {
        setRound((prev: number) => prev + 1)
        generateNewWord()
      }, 2000)
    }
  }

  const getCurrentWordData = (): WordData | undefined => {
    return getCurrentWordList().find(w => w.word === currentWord)
  }

  const nextHint = () => {
    const wordData = getCurrentWordData()
    if (wordData && currentHintLevel < wordData.hints.length - 1) {
      setCurrentHintLevel((prev: number) => prev + 1)
    }
  }

  const getProgressPercentage = () => {
    const totalWords = getCurrentWordList().length
    return Math.round((wordsCompleted.length / totalWords) * 100)
  }

  const resetGame = () => {
    setScore(0)
    setRound(1)
    setWordsCompleted([])
    setCurrentHintLevel(0)
    generateNewWord()
  }

  const changeDifficulty = (newDifficulty: DifficultyLevel) => {
    setDifficulty(newDifficulty)
    setScore(0)
    setRound(1)
    setWordsCompleted([])
    setCurrentHintLevel(0)
    setTimeout(() => generateNewWord(), 100)
  }

  const getLetterColor = (letter: string, index: number) => {
    const colors = [
      'bg-pink-200 text-pink-800',
      'bg-blue-200 text-blue-800', 
      'bg-green-200 text-green-800',
      'bg-purple-200 text-purple-800',
      'bg-yellow-200 text-yellow-800',
      'bg-indigo-200 text-indigo-800'
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Kind Words Puzzle</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">500 words with hints - Easy, Hard & Pro levels</p>
      </div>

      {/* Difficulty Selection */}
      <Card className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 mb-4">
        <div className="text-center mb-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Choose Difficulty Level</h4>
        </div>
        <div className="flex justify-center space-x-2">
          {(['easy', 'hard', 'pro'] as const).map((level) => (
            <Button
              key={level}
              variant={difficulty === level ? "default" : "outline"}
              size="lg"
              onClick={() => changeDifficulty(level)}
              onTouchEnd={(e) => { e.preventDefault(); changeDifficulty(level) }}
              className={`capitalize touch-manipulation ${
                difficulty === level 
                  ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                  : 'hover:bg-purple-50'
              }`}
            >
              {level === 'easy' && '🟢'} {level === 'hard' && '🟡'} {level === 'pro' && '🔴'}
              <span className="ml-1">{level}</span>
            </Button>
          ))}
        </div>
        <div className="text-center mt-2">
          <div className="text-xs text-gray-600">
            Progress: {wordsCompleted.length}/{getCurrentWordList().length} words ({getProgressPercentage()}%)
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm font-semibold">
            Score: {score}
            <br />
            <span className="text-xs text-gray-600 capitalize">{difficulty} Mode</span>
          </div>
          <div className="text-sm font-semibold">
            Round: {round}
            <br />
            <span className="text-xs text-gray-600">{getCurrentWordList().length} Total Words</span>
          </div>
        </div>

        {/* Scrambled Word Display */}
        <div className="text-center mb-8">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Unscramble this kind word:</h4>
          <div className="flex justify-center space-x-2 mb-6">
            {scrambledWord.split('').map((letter: string, index: number) => (
              <div
                key={index}
                className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg transform transition-all duration-300 hover:scale-110 ${getLetterColor(letter, index)}`}
              >
                {letter}
              </div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="text-center mb-6">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
            placeholder="Type your answer here..."
            className="w-full max-w-xs p-3 text-center text-lg font-semibold border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none"
            disabled={isCorrect}
          />
          
          <div className="mt-4 space-x-4">
            <Button 
              onClick={checkAnswer} 
              onTouchEnd={(e) => { e.preventDefault(); checkAnswer() }}
              size="lg"
              className="bg-purple-500 hover:bg-purple-600 touch-manipulation"
              disabled={!userInput || isCorrect}
            >
              <Check className="w-4 h-4 mr-2" />
              Check Answer
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setShowHint(!showHint)}
              onTouchEnd={(e) => { e.preventDefault(); setShowHint(!showHint) }}
              size="lg"
              className="touch-manipulation"
              disabled={isCorrect}
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {showHint ? 'Hide' : 'Show'} Hint
            </Button>
            
            {showHint && !isCorrect && getCurrentWordData() && currentHintLevel < getCurrentWordData()!.hints.length - 1 && (
              <Button 
                variant="ghost" 
                size="lg"
                onClick={nextHint}
                onTouchEnd={(e) => { e.preventDefault(); nextHint() }}
                className="text-blue-600 hover:text-blue-700 touch-manipulation"
              >
                More Hint →
              </Button>
            )}
          </div>
        </div>

        {/* Progressive Hint Display */}
        {showHint && !isCorrect && getCurrentWordData() && (
          <Card className="p-4 bg-yellow-50 mb-6">
            <div className="text-center">
              <h4 className="text-sm font-semibold text-yellow-800 mb-2">💡 Hint Level {currentHintLevel + 1}</h4>
              <p className="text-sm text-yellow-700 mb-2">
                {getCurrentWordData()!.hints[currentHintLevel]}
              </p>
              {currentHintLevel < getCurrentWordData()!.hints.length - 1 && (
                <p className="text-xs text-yellow-600">
                  Click "More Hint" for additional clues (but lower score!)
                </p>
              )}
            </div>
          </Card>
        )}

        {/* Success Display */}
        {isCorrect && (
          <Card className="p-6 bg-gradient-to-r from-green-100 to-emerald-100 mb-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🎉</div>
              <h4 className="text-lg font-bold text-green-800 mb-2">Correct!</h4>
              <p className="text-green-700 font-semibold text-xl mb-2">{currentWord}</p>
              <p className="text-sm text-green-600">
                <strong>Meaning:</strong> {getCurrentWordData()?.meaning}
              </p>
            </div>
          </Card>
        )}

        {/* Word Meaning Library */}
        <Card className="p-4 bg-white mb-4">
          <h4 className="font-semibold text-gray-700 mb-3 text-center">✨ Kind Words You've Discovered:</h4>
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
            {getCurrentWordList().filter((wordData: WordData) => wordsCompleted.includes(wordData.word)).map((wordData: WordData, index: number) => (
              <div key={index} className="text-center p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <div className="font-semibold text-sm text-purple-700">{wordData.word}</div>
                <div className="text-xs text-purple-600">{wordData.meaning}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          <Button 
            variant="outline" 
            onClick={generateNewWord} 
            onTouchEnd={(e) => { e.preventDefault(); generateNewWord() }}
            size="lg"
            className="touch-manipulation"
            disabled={isCorrect}
          >
            Skip Word
          </Button>
          
          <Button 
            variant="outline" 
            onClick={resetGame}
            onTouchEnd={(e) => { e.preventDefault(); resetGame() }}
            size="lg"
            className="touch-manipulation"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New Game
          </Button>
        </div>

        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-800 text-center">
            <strong>📝 Benefits:</strong> Improves mood • Builds positive word associations • Enhances vocabulary • Promotes optimistic thinking
          </p>
        </div>
      </Card>
    </div>
  )
}