"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, Calendar, BarChart3, PieChart, Sparkles, AlertTriangle } from "lucide-react"
import { AIMoodAnalyzer } from "@/components/ai-mood-analyzer"

interface MoodEntry {
  id: string
  date: string
  mood: number
  comment: string
  timestamp: number
}

interface AnalyticsProps {
  moodEntries: MoodEntry[]
  journalEntries: any[]
  onBack: () => void
}

export default function Analytics({ moodEntries, journalEntries, onBack }: AnalyticsProps) {
  const getMoodStats = () => {
    if (moodEntries.length === 0) return null

    const moods = moodEntries.map((entry) => entry.mood)
    const average = moods.reduce((sum, mood) => sum + mood, 0) / moods.length
    const highest = Math.max(...moods)
    const lowest = Math.min(...moods)

    return { average, highest, lowest }
  }

  const getWeeklyTrend = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toDateString()
    }).reverse()

    return last7Days.map((dateStr) => {
      const entry = moodEntries.find((entry) => new Date(entry.date).toDateString() === dateStr)
      return {
        date: new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" }),
        mood: entry ? entry.mood : null,
      }
    })
  }

  const getMoodDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    moodEntries.forEach((entry) => {
      distribution[entry.mood as keyof typeof distribution]++
    })
    return distribution
  }

  const getInsights = () => {
    const stats = getMoodStats()
    if (!stats) return []

    const insights = []

    if (stats.average >= 4) {
      insights.push({
        type: "positive",
        title: "Great Progress!",
        description: "Your average mood has been consistently positive. Keep up the great work!",
      })
    } else if (stats.average <= 2) {
      insights.push({
        type: "concern",
        title: "Challenging Period",
        description:
          "Your mood has been lower recently. Consider reaching out for support or trying self-care activities.",
      })
    }

    if (journalEntries.length > 7) {
      insights.push({
        type: "achievement",
        title: "Consistent Journaling",
        description: "You've been keeping up with your journal entries. This consistency is great for mental health!",
      })
    }

    const recentEntries = moodEntries.slice(-7)
    const hasImprovement =
      recentEntries.length >= 3 &&
      recentEntries.slice(-3).every((entry, i, arr) => i === 0 || entry.mood >= arr[i - 1].mood)

    if (hasImprovement) {
      insights.push({
        type: "positive",
        title: "Upward Trend",
        description: "Your mood has been improving over the past few days. Great progress!",
      })
    }

    return insights
  }

  const stats = getMoodStats()
  const weeklyTrend = getWeeklyTrend()
  const moodDistribution = getMoodDistribution()
  const insights = getInsights()

  const moodLabels = {
    1: "Very Sad",
    2: "Sad",
    3: "Neutral",
    4: "Happy",
    5: "Very Happy",
  }

  const moodColors = {
    1: "bg-red-500",
    2: "bg-orange-500",
    3: "bg-yellow-500",
    4: "bg-green-500",
    5: "bg-blue-500",
  }

  return (
    <div className="mobile-container min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md mx-auto pb-6">
        {AIMoodAnalyzer.checkForCrisisIndicators(moodEntries, journalEntries) && (
          <Card className="p-4 bg-red-100 border-red-200 mb-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div className="min-w-0">
                <h3 className="font-semibold text-red-800 text-sm">Wellness Check</h3>
                <p className="text-sm text-red-700">
                  I've noticed some concerning patterns in your mood. Consider reaching out to someone you trust or
                  using your crisis plan.
                </p>
              </div>
            </div>
          </Card>
        )}
        <div className="flex items-center justify-between mb-4 px-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="touch-manipulation">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="mobile-heading font-bold text-gray-800 dark:text-white flex-1 text-center mx-2">Analytics & Insights</h1>
          <div className="w-8" />
        </div>

        {moodEntries.length === 0 ? (
          <Card className="mobile-card text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3 mobile-text">No Data Yet</h3>
            <p className="text-gray-600 dark:text-gray-300 mobile-subtext">Start tracking your mood to see insights and trends here.</p>
          </Card>
        ) : (
          <div className="space-y-4 pb-8">
            {/* Overview Stats */}
            <Card className="mobile-card">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center mobile-text">
                <TrendingUp className="w-5 h-5 mr-2" />
                Overview
              </h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="mobile-text font-bold text-blue-600">{stats?.average.toFixed(1)}</div>
                  <div className="mobile-subtext text-gray-600 dark:text-gray-400">Average Mood</div>
                </div>
                <div>
                  <div className="mobile-text font-bold text-green-600">{moodEntries.length}</div>
                  <div className="mobile-subtext text-gray-600 dark:text-gray-400">Total Check-ins</div>
                </div>
                <div>
                  <div className="mobile-text font-bold text-purple-600">{journalEntries.length}</div>
                  <div className="mobile-subtext text-gray-600 dark:text-gray-400">Journal Entries</div>
                </div>
              </div>
            </Card>

          {/* Weekly Trend */}
          <Card className="mobile-card">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center mobile-text">
              <Calendar className="mobile-icon mr-2" />
              7-Day Trend
            </h3>
            <div className="space-y-2">
              {weeklyTrend.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 w-10">{day.date}</span>
                  <div className="flex-1 mx-2">
                    {day.mood ? (
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${moodColors[day.mood as keyof typeof moodColors]}`}
                            style={{ width: `${(day.mood / 5) * 100}%` }}
                          />
                        </div>
                        <span className="ml-2 text-xs font-medium">{day.mood}</span>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400">No data</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Mood Distribution */}
          <Card className="mobile-card">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center mobile-text">
              <PieChart className="mobile-icon mr-2" />
              Mood Distribution
            </h3>
            <div className="space-y-2">
              {Object.entries(moodDistribution).map(([mood, count]) => (
                <div key={mood} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <div className={`w-3 h-3 rounded-full ${moodColors[parseInt(mood) as keyof typeof moodColors]} flex-shrink-0`} />
                    <span className="text-xs text-gray-700 truncate">{moodLabels[parseInt(mood) as keyof typeof moodLabels]}</span>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${moodColors[parseInt(mood) as keyof typeof moodColors]}`}
                        style={{ width: `${(count / moodEntries.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Analysis */}
          <Card className="mobile-card">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center mobile-text">
              <Sparkles className="mobile-icon mr-2" />
              AI Analysis
            </h3>
            <div className="space-y-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-1 text-xs">Weekly Summary</h4>
                <p className="text-xs text-blue-700">{AIMoodAnalyzer.analyzeWeeklyMood(moodEntries)}</p>
              </div>

              {AIMoodAnalyzer.detectMoodPatterns(moodEntries).map((pattern, index) => (
                <div key={index} className="p-2 bg-yellow-50 rounded-lg">
                  <p className="text-xs text-yellow-800">{pattern}</p>
                </div>
              ))}

              <div className="p-2 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-1 text-xs">Journal Insights</h4>
                <p className="text-xs text-green-700">{AIMoodAnalyzer.generateJournalInsights(journalEntries)}</p>
              </div>
            </div>
          </Card>

          {/* AI Insights */}
          {insights.length > 0 && (
            <Card className="mobile-card">
              <h3 className="font-semibold text-gray-800 mb-3 mobile-text">AI Insights</h3>
              <div className="space-y-2">
                {insights.map((insight, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg ${
                      insight.type === "positive"
                        ? "bg-green-50 border border-green-200"
                        : insight.type === "concern"
                          ? "bg-red-50 border border-red-200"
                          : "bg-blue-50 border border-blue-200"
                    }`}
                  >
                    <h4
                      className={`font-medium text-xs ${
                        insight.type === "positive"
                          ? "text-green-800"
                          : insight.type === "concern"
                            ? "text-red-800"
                            : "text-blue-800"
                      }`}
                    >
                      {insight.title}
                    </h4>
                    <p
                      className={`text-xs ${
                        insight.type === "positive"
                          ? "text-green-700"
                          : insight.type === "concern"
                            ? "text-red-700"
                            : "text-blue-700"
                      }`}
                    >
                      {insight.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Recommendations */}
          <Card className="mobile-card bg-gradient-to-r from-purple-100 to-pink-100">
            <h3 className="font-semibold text-gray-800 mb-3 mobile-text">Recommendations</h3>
            <div className="space-y-1 text-xs text-gray-700">
              <p>• Continue your daily mood check-ins for better insights</p>
              <p>• Try journaling when you notice mood patterns</p>
              <p>• Use self-care tools during challenging periods</p>
              <p>• Celebrate your progress and positive trends</p>
            </div>
          </Card>
          </div>
        )}
      </div>
    </div>
  )
}
