"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Heart, ScanFace } from "lucide-react"
import { addNotification } from "@/components/notification-system"
import MoodScan from "@/components/mood-scan"
import { getSupportiveReply, crisisCheck, type SupportiveReply } from "@/lib/supportive-replies"

interface MoodEntry {
  id: string
  date: string
  mood: number
  comment: string
  timestamp: number
}

interface MoodCheckInProps {
  moodEntries: MoodEntry[]
  setMoodEntries: (entries: MoodEntry[]) => void
  journalEntries?: any[]
  onBack: () => void
}

export default function MoodCheckIn({ moodEntries, setMoodEntries, journalEntries = [], onBack }: MoodCheckInProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showScan, setShowScan] = useState(false)
  const [supportive, setSupportive] = useState<SupportiveReply | null>(null)

  // Map an estimated expression to a suggested 1-5 mood for pre-fill,
  // and generate an emotion-aware supportive response.
  const applyExpression = (expression: string) => {
    const mapping: Record<string, number> = {
      happy: 5, surprised: 4, neutral: 3, sad: 2, fearful: 2, angry: 1, disgusted: 1,
    }
    setSelectedMood(mapping[expression] ?? 3)
    const reply = getSupportiveReply(expression as any)
    setSupportive(reply)
    setShowScan(false)
    // Emotion-aware TTS: voice tone adapts to the estimated expression.
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const tones: Record<string, { rate: number; pitch: number }> = {
        sad: { rate: 0.85, pitch: 0.9 },
        fearful: { rate: 0.85, pitch: 0.9 },
        angry: { rate: 0.8, pitch: 0.85 },
        happy: { rate: 1.05, pitch: 1.1 },
        neutral: { rate: 1, pitch: 1 },
        surprised: { rate: 1, pitch: 1.05 },
        disgusted: { rate: 0.9, pitch: 0.95 },
      }
      const t = tones[expression] ?? tones.neutral
      const u = new SpeechSynthesisUtterance(reply.message)
      u.rate = t.rate
      u.pitch = t.pitch
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(u)
    }
    const crisis = crisisCheck(journalEntries.slice(-3).map((j: any) => j.content || "").join(" "))
    if (crisis) addNotification({ title: "Support resources", message: crisis, type: "reminder" })
  }

  // Load additional app data for AI insights
  const getHabitsData = () => {
    try {
      return JSON.parse(localStorage.getItem("user_habits") || "[]")
    } catch {
      return []
    }
  }

  const getGoalsData = () => {
    try {
      return JSON.parse(localStorage.getItem("user_goals") || "[]")
    } catch {
      return []
    }
  }

  // Advanced AI Insights Algorithm with Deep Pattern Analysis
  const generateAIInsights = (mood: number) => {
    const habits = getHabitsData()
    const goals = getGoalsData()
    const recentMoods = moodEntries.slice(-14) // Last 14 days for better pattern analysis
    const recentJournals = journalEntries.slice(-10) // Last 10 entries
    const today = new Date()
    const dayOfWeek = today.getDay()
    const timeOfDay = today.getHours()

    // Deep Pattern Analysis
    const analyzePatterns = () => {
      // Weekly mood patterns
      const weeklyPattern: { [key: number]: number[] } = {}
      recentMoods.forEach(entry => {
        const day = new Date(entry.date).getDay()
        if (!weeklyPattern[day]) weeklyPattern[day] = []
        weeklyPattern[day].push(entry.mood)
      })

      // Time-based patterns
      const morningMoods = recentMoods.filter(entry => new Date(entry.date).getHours() < 12)
      const eveningMoods = recentMoods.filter(entry => new Date(entry.date).getHours() >= 18)

      // Habit-mood correlation
      const habitMoodCorrelation: { [key: string]: number } = {}
      habits.forEach((habit: any) => {
        const completedDays = habit.completedDates || []
        const moodsOnCompletedDays = recentMoods.filter(mood =>
          completedDays.includes(new Date(mood.date).toDateString())
        )
        if (moodsOnCompletedDays.length > 0) {
          habitMoodCorrelation[habit.name] = moodsOnCompletedDays.reduce((sum: number, m: any) => sum + m.mood, 0) / moodsOnCompletedDays.length
        }
      })

      return { weeklyPattern, morningMoods, eveningMoods, habitMoodCorrelation }
    }

    const patterns = analyzePatterns()

    // Advanced Sentiment Analysis
    const analyzeSentiment = () => {
      const emotionalKeywords = {
        joy: ['happy', 'excited', 'thrilled', 'delighted', 'cheerful', 'elated', 'joyful', 'blissful'],
        gratitude: ['grateful', 'thankful', 'blessed', 'appreciate', 'fortunate', 'lucky'],
        achievement: ['accomplished', 'achieved', 'success', 'proud', 'completed', 'finished', 'won'],
        stress: ['stressed', 'overwhelmed', 'pressure', 'busy', 'hectic', 'rushed', 'deadline'],
        anxiety: ['anxious', 'worried', 'nervous', 'scared', 'afraid', 'panic', 'concern'],
        sadness: ['sad', 'depressed', 'down', 'blue', 'melancholy', 'gloomy', 'upset'],
        anger: ['angry', 'frustrated', 'annoyed', 'irritated', 'mad', 'furious'],
        hope: ['hope', 'optimistic', 'positive', 'confident', 'determined', 'motivated'],
        relationships: ['friend', 'family', 'love', 'support', 'together', 'connection'],
        growth: ['learn', 'grow', 'improve', 'better', 'progress', 'develop', 'change']
      }

      const sentimentScores: { [key: string]: number } = {}
      Object.keys(emotionalKeywords).forEach(emotion => {
        sentimentScores[emotion] = 0
        recentJournals.forEach((entry: any) => {
          const content = (entry.content || '').toLowerCase()
          emotionalKeywords[emotion as keyof typeof emotionalKeywords].forEach((keyword: string) => {
            if (content.includes(keyword)) sentimentScores[emotion]++
          })
        })
      })

      return sentimentScores
    }

    const sentimentAnalysis = analyzeSentiment()

    // Interest and Activity Analysis
    const analyzeInterests = () => {
      const activityKeywords = {
        exercise: ['workout', 'gym', 'run', 'walk', 'exercise', 'fitness', 'yoga', 'sport'],
        creative: ['art', 'draw', 'paint', 'music', 'write', 'create', 'design', 'craft'],
        social: ['friends', 'party', 'meet', 'talk', 'call', 'visit', 'hangout', 'social'],
        learning: ['read', 'study', 'learn', 'course', 'book', 'research', 'discover'],
        nature: ['outside', 'nature', 'park', 'garden', 'beach', 'hiking', 'outdoor'],
        relaxation: ['relax', 'rest', 'sleep', 'meditation', 'calm', 'peaceful', 'quiet'],
        work: ['work', 'job', 'career', 'project', 'meeting', 'deadline', 'office'],
        hobbies: ['hobby', 'game', 'movie', 'tv', 'cook', 'bake', 'garden', 'collect']
      }

      const interests: { [key: string]: number } = {}
      Object.keys(activityKeywords).forEach(activity => {
        interests[activity] = 0
        recentJournals.forEach((entry: any) => {
          const content = (entry.content || '').toLowerCase()
          activityKeywords[activity as keyof typeof activityKeywords].forEach((keyword: string) => {
            if (content.includes(keyword)) interests[activity]++
          })
        })
      })

      return interests
    }

    const userInterests = analyzeInterests()

    // Generate Comprehensive Insights
    let insights = []
    let workPlan = []
    let personalizedTips = []

    // Current mood analysis with context
    const moodLabels = ['', 'very sad', 'sad', 'neutral', 'happy', 'very happy']
    insights.push(`Today you're feeling ${moodLabels[mood]}. Let me analyze your patterns to understand why.`)

    // Weekly pattern insights
    const todayPattern = patterns.weeklyPattern[dayOfWeek]
    if (todayPattern && todayPattern.length > 1) {
      const avgTodayMood = todayPattern.reduce((sum, m) => sum + m, 0) / todayPattern.length
      if (mood > avgTodayMood) {
        insights.push(`🔍 Pattern Alert: You're feeling better than your usual ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]} mood (${avgTodayMood.toFixed(1)}/5). Something positive is working!`)
      } else if (mood < avgTodayMood) {
        insights.push(`🔍 Pattern Alert: Your mood is lower than your typical ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]} (${avgTodayMood.toFixed(1)}/5). Let's identify what might help.`)
      }
    }

    // Habit-mood correlation insights
    const bestHabits = Object.entries(patterns.habitMoodCorrelation)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)

    if (bestHabits.length > 0) {
      insights.push(`📊 Data shows these habits boost your mood most: ${bestHabits.map(([habit, score]) => `${habit} (+${(score - 3).toFixed(1)})`).join(', ')}`)
    }

    // Sentiment-based insights
    const topEmotions = Object.entries(sentimentAnalysis)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .filter(([, score]) => score > 0)

    if (topEmotions.length > 0) {
      insights.push(`💭 Your journal reveals these emotional themes: ${topEmotions.map(([emotion, score]) => `${emotion} (${score} mentions)`).join(', ')}`)
    }

    // Interest-based insights
    const topInterests = Object.entries(userInterests)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .filter(([, score]) => score > 0)

    if (topInterests.length > 0) {
      insights.push(`🎯 Your interests show focus on: ${topInterests.map(([interest, score]) => `${interest} (${score} mentions)`).join(', ')}`)
    }

    // Generate Detailed Work Plan
    if (mood >= 4) {
      workPlan.push("🌟 POSITIVE ENERGY OPTIMIZATION PLAN:")
      workPlan.push("• Morning: Continue your successful routine that led to this positive mood")
      workPlan.push("• Midday: Channel this energy into your most important goal or habit")
      workPlan.push("• Evening: Reflect and journal about what worked well today")

      if (topInterests.length > 0) {
        workPlan.push(`• Engage in your favorite activity: ${topInterests[0][0]} (you mention this often!)`)
      }

      if (bestHabits.length > 0) {
        workPlan.push(`• Maintain your mood-boosting habit: ${bestHabits[0][0]}`)
      }
    } else if (mood === 3) {
      workPlan.push("⚖️ NEUTRAL DAY ACTIVATION PLAN:")
      workPlan.push("• Start small: Pick one easy habit to complete for a quick win")
      workPlan.push("• Mid-morning: Do 5 minutes of your favorite activity to spark interest")
      workPlan.push("• Afternoon: Take a short walk or step outside for natural mood boost")
      workPlan.push("• Evening: Write 3 things you're grateful for, however small")

      if (userInterests.creative > 0) {
        workPlan.push("• Try 10 minutes of creative activity - your journal shows you enjoy this")
      }
    } else {
      workPlan.push("💙 GENTLE RECOVERY PLAN:")
      workPlan.push("• Immediate: Take 3 deep breaths and remind yourself this feeling is temporary")
      workPlan.push("• Next hour: Do something nurturing - warm drink, soft music, or comfort item")
      workPlan.push("• Midday: Gentle movement like stretching or slow walking")
      workPlan.push("• Afternoon: Connect with someone who cares about you")
      workPlan.push("• Evening: Early rest and self-compassion practices")

      if (sentimentAnalysis.stress > sentimentAnalysis.sadness) {
        workPlan.push("• Your journal shows stress patterns - try breathing exercises or meditation")
      } else {
        workPlan.push("• Your journal shows sadness themes - consider gentle self-care activities")
      }
    }

    // Personalized tips based on data
    if (habits.length === 0) {
      personalizedTips.push("💡 Start with one tiny habit - even 1 minute of something positive daily can improve mood patterns")
    }

    if (goals.length === 0) {
      personalizedTips.push("💡 Set a small, achievable goal - having direction boosts mental wellbeing significantly")
    }

    if (recentJournals.length < 3) {
      personalizedTips.push("💡 Regular journaling helps me give you better insights - try writing just 2-3 sentences daily")
    }

    // Time-based recommendations
    if (timeOfDay < 10) {
      personalizedTips.push("🌅 Morning insight: Starting your day with intention sets a positive tone")
    } else if (timeOfDay > 20) {
      personalizedTips.push("🌙 Evening insight: Reflecting on the day helps process emotions and plan tomorrow")
    }

    // Reliable fallbacks for minimal data
    if (insights.length < 3) {
      insights.push("🧠 Building your data profile - each entry helps me understand you better")
      insights.push("📈 Consistency in tracking leads to more personalized insights over time")
    }

    if (workPlan.length < 3) {
      workPlan.push("• Focus on one small positive action right now")
      workPlan.push("• Use the self-care tools in the app for immediate support")
      workPlan.push("• Remember: small steps lead to big changes over time")
    }

    return { insights, workPlan, personalizedTips }
  }

  const moodOptions = [
    { value: 1, emoji: "😢", label: "Very Sad", color: "text-red-500", bg: "bg-red-50" },
    { value: 2, emoji: "😔", label: "Sad", color: "text-orange-500", bg: "bg-orange-50" },
    { value: 3, emoji: "😐", label: "Neutral", color: "text-yellow-500", bg: "bg-yellow-50" },
    { value: 4, emoji: "😊", label: "Happy", color: "text-green-500", bg: "bg-green-50" },
    { value: 5, emoji: "😄", label: "Very Happy", color: "text-blue-500", bg: "bg-blue-50" },
  ]

  const handleSubmit = async () => {
    if (selectedMood === null) return

    setIsSubmitting(true)

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood: selectedMood,
      comment: comment.trim(),
      timestamp: Date.now(),
    }

    // Remove any existing entry for today
    const today = new Date().toDateString()
    const filteredEntries = moodEntries.filter((entry) => new Date(entry.date).toDateString() !== today)

    setMoodEntries([...filteredEntries, newEntry])

    // Add notification for mood entry
    const moodLabels = ['', 'very sad', 'sad', 'neutral', 'happy', 'very happy']
    addNotification({
      type: 'mood',
      title: 'Mood Entry Saved',
      message: `Today's mood logged as "${moodLabels[selectedMood]}" with ${comment.trim() ? 'notes' : 'no additional notes'}`,
      data: { mood: selectedMood, comment: comment.trim() }
    })

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    onBack()
  }

  const getTodaysEntry = () => {
    const today = new Date().toDateString()
    return moodEntries.find((entry) => new Date(entry.date).toDateString() === today)
  }

  const todaysEntry = getTodaysEntry()

  if (todaysEntry) {
    const aiInsights = generateAIInsights(todaysEntry.mood)

    return (
      <div className="mobile-container mobile-constrained bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={onBack} className="mobile-button touch-target">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="mobile-heading text-gray-800 dark:text-white ml-2">Today's Check-in</h1>
        </div>

        <Card className="mobile-card text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="mobile-heading text-gray-800 dark:text-white mb-3">Already Completed!</h2>
          <p className="mobile-text text-gray-600 dark:text-gray-300 mb-4">You've already checked in today. Great job staying consistent!</p>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-center mb-2">
              <span className="text-2xl mr-2">{moodOptions.find((m) => m.value === todaysEntry.mood)?.emoji}</span>
              <span className="font-semibold mobile-text text-gray-800 dark:text-white">{moodOptions.find((m) => m.value === todaysEntry.mood)?.label}</span>
            </div>
            {todaysEntry.comment && <p className="text-xs text-gray-700 dark:text-gray-300 italic">"{todaysEntry.comment}"</p>}
          </div>

            {/* Enhanced AI Insights for completed entry */}
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-left">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                🤖 AI Analysis of Your Day
              </h3>
              <div className="space-y-4">
                {/* Pattern Insights */}
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2 text-sm">📊 Pattern Analysis:</h4>
                  <div className="space-y-1">
                    {aiInsights.insights.map((insight, index) => (
                      <p key={index} className="text-xs text-gray-700 dark:text-gray-300">• {insight}</p>
                    ))}
                  </div>
                </div>

                {/* Detailed Work Plan */}
                {aiInsights.workPlan.length > 0 && (
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                    <h4 className="font-medium text-gray-800 dark:text-white mb-2 text-sm">📋 Your Personalized Action Plan:</h4>
                    <div className="space-y-1">
                      {aiInsights.workPlan.map((plan, index) => (
                        <p key={index} className="text-xs text-green-700 dark:text-green-300">{plan}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Personalized Tips */}
                {aiInsights.personalizedTips.length > 0 && (
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                    <h4 className="font-medium text-gray-800 dark:text-white mb-2 text-sm">💡 Smart Recommendations:</h4>
                    <div className="space-y-1">
                      {aiInsights.personalizedTips.map((tip, index) => (
                        <p key={index} className="text-xs text-blue-700 dark:text-blue-300">{tip}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Come back tomorrow for your next check-in!</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="mobile-container mobile-constrained bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={onBack} className="mobile-button touch-target">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="mobile-heading text-gray-800 dark:text-white ml-2">Daily Mood Check-in</h1>
        </div>

        <Card className="mobile-card shadow-lg">
          <div className="text-center mb-6">
            <h2 className="mobile-heading text-gray-800 dark:text-white mb-3">How are you feeling today?</h2>
            <p className="mobile-text text-gray-600 dark:text-gray-300">Take a moment to reflect on your current mood</p>
          </div>

          <div className="space-y-4 mb-6">
            <Label className="mobile-text font-medium">Select your mood:</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`p-3 rounded-xl border-2 transition-all min-h-[90px] flex flex-col items-center justify-center touch-target ${selectedMood === mood.value
                    ? `${mood.bg} dark:bg-opacity-20 border-current ${mood.color} scale-105 shadow-lg`
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105"
                    }`}
                >
                  <div className="text-2xl mb-2">{mood.emoji}</div>
                  <div className="mobile-subtext font-medium text-gray-800 dark:text-gray-200 text-center">{mood.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6 text-center">
            {!showScan ? (
              <button
                onClick={() => setShowScan(true)}
                className="mx-auto flex items-center gap-2 rounded-full border-2 border-pink-300 bg-pink-50 px-5 py-2.5 text-sm font-bold text-pink-600 transition-all hover:bg-pink-100 dark:border-pink-700 dark:bg-pink-900/30 dark:text-pink-300 dark:hover:bg-pink-900/50"
              >
                <ScanFace className="h-4 w-4" />
                Scan my expression (optional, on-device)
              </button>
            ) : (
              <MoodScan onAccept={(key) => applyExpression(key)} onClose={() => setShowScan(false)} />
            )}
          </div>

          {supportive && !showScan && (
            <div className="mb-6 rounded-xl border border-pink-200 bg-pink-50 p-4 dark:border-pink-800 dark:bg-pink-900/20">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{supportive.message}</p>
              <p className="mt-1 text-xs text-pink-600 dark:text-pink-300">
                Suggested tool: {supportive.toolSuggestion} · Template-based response, estimated expression
              </p>
            </div>
          )}

          <div className="space-y-2 mb-6">
            <Label htmlFor="comment" className="mobile-text font-medium">
              What's on your mind? (Optional)
            </Label>
            <Textarea
              id="comment"
              placeholder="Share any thoughts, feelings, or what happened today..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="mobile-text"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={selectedMood === null || isSubmitting}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 mobile-button touch-target"
          >
            {isSubmitting ? "Saving..." : "Complete Check-in"}
          </Button>

          {selectedMood !== null && (
            <Card className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                🤖 AI Analysis Based on Your Data
              </h3>
              {(() => {
                const aiInsights = generateAIInsights(selectedMood)
                return (
                  <div className="space-y-4">
                    {/* Pattern Insights */}
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white mb-2 text-sm">📊 Pattern Analysis:</h4>
                      <div className="space-y-1">
                        {aiInsights.insights.map((insight, index) => (
                          <p key={index} className="text-xs text-gray-700 dark:text-gray-300">• {insight}</p>
                        ))}
                      </div>
                    </div>

                    {/* Detailed Work Plan */}
                    {aiInsights.workPlan.length > 0 && (
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                        <h4 className="font-medium text-gray-800 dark:text-white mb-2 text-sm">📋 Your Personalized Action Plan:</h4>
                        <div className="space-y-1">
                          {aiInsights.workPlan.map((plan, index) => (
                            <p key={index} className="text-xs text-green-700 dark:text-green-300">{plan}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Personalized Tips */}
                    {aiInsights.personalizedTips.length > 0 && (
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                        <h4 className="font-medium text-gray-800 dark:text-white mb-2 text-sm">💡 Smart Recommendations:</h4>
                        <div className="space-y-1">
                          {aiInsights.personalizedTips.map((tip, index) => (
                            <p key={index} className="text-xs text-blue-700 dark:text-blue-300">{tip}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })()}
            </Card>
          )}
        </Card>

        {/* Recent Mood History */}
        {moodEntries.length > 0 && (
          <Card className="mt-6 mobile-card shadow-lg">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4 mobile-heading">Recent Check-ins</h3>
            <div className="space-y-3">
              {moodEntries
                .slice(-5)
                .reverse()
                .map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400 mobile-subtext">{new Date(entry.date).toLocaleDateString()}</span>
                    <div className="flex items-center">
                      <span className="mr-3 text-xl">{moodOptions.find((m) => m.value === entry.mood)?.emoji}</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200 mobile-subtext">{moodOptions.find((m) => m.value === entry.mood)?.label}</span>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
