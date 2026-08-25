'use client'

import { useState, useEffect } from 'react'

// Mood data from the original project
const moods = [
  { key: 'great', emoji: '🙂', label: 'Good', tone: 'signal', note: 'Positive state detected. Log what worked today.', activities: ['Write one win from today', 'Share it with a friend'] },
  { key: 'okay', emoji: '😐', label: 'Okay', tone: 'violet', note: 'Neutral state. Small stimulus usually helps.', activities: ['10-minute walk', 'Tidy one small space'] },
  { key: 'low', emoji: '😔', label: 'Low', tone: 'amber', note: 'Low mood pattern. Gentle structure recommended.', activities: ['Journal 3 lines', 'Call someone you trust', 'Slow breathing ×10'] },
  { key: 'angry', emoji: '😡', label: 'Frustrated', tone: 'rose', note: 'High arousal detected. Release before reflect.', activities: ['Physical reset — 20 squats', 'Write the unsent message'] },
  { key: 'tired', emoji: '😴', label: 'Tired', tone: 'fog', note: 'Energy deficit. Recovery beats productivity.', activities: ['20-minute nap (max)', 'Hydrate + stretch'] },
]

export default function MoodMate() {
  const [currentMood, setCurrentMood] = useState(moods[0])
  const [moodHistory, setMoodHistory] = useState<{ key: string; date: string }[]>([])
  const [dailyStreak, setDailyStreak] = useState(0)

  useEffect(() => {
    const savedHistory = localStorage.getItem('moodMateHistory')
    if (savedHistory) setMoodHistory(JSON.parse(savedHistory))
    const savedStreak = localStorage.getItem('moodMateStreak')
    if (savedStreak) setDailyStreak(parseInt(savedStreak, 10))
  }, [])

  useEffect(() => {
    localStorage.setItem('moodMateHistory', JSON.stringify(moodHistory))
    localStorage.setItem('moodMateStreak', dailyStreak.toString())
  }, [moodHistory, dailyStreak])

  const addMoodEntry = (moodKey: string) => {
    const mood = moods.find(m => m.key === moodKey)
    if (!mood) return

    const now = new Date()
    const dateStr = now.toISOString().split('T')[0]

    // Check if same mood was recorded today
    const todayEntry = moodHistory.find(h => h.date === dateStr)
    if (todayEntry && todayEntry.key === moodKey) {
      // Increment streak if same mood consecutive
      setDailyStreak(dailyStreak + 1)
    } else {
      setMoodHistory(prev => [...prev, { key: moodKey, date: dateStr }])
    }

    setCurrentMood(mood)
  }

  const getStreakClass = (tone: string | undefined) => {
    if (tone === 'signal') return 'text-success'
    if (tone === 'amber') return 'text-warning'
    if (tone === 'rose') return 'text-danger'
    return 'text-fog'
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-ink mb-2">
            MoodMate
          </h1>
          <p className="text-lg text-muted">
            Mood-tracking wellness companion built with Next.js 16.3 and React 19.2.
          </p>
        </header>

        {/* Mood Selection */}
        <section className="mb-6 rounded-md p-4 bg-card border border-border">
          <h2 className="text-2xl font-bold text-ink mb-4">How Are You Feeling?</h2>
          <div className="grid grid-cols-5 gap-2">
            {moods.map((m) => {
              const isSelected = currentMood?.key === m.key
              const buttonClass = isSelected
                ? 'btn rounded-md p-3 transition-colors cursor-pointer bg-accent/20 border-accent'
                : 'btn rounded-md p-3 transition-colors cursor-pointer border-border hover:bg-accent/5'
              const moodClass = m.tone === 'signal' ? 'text-success' :
                        m.tone === 'amber' ? 'text-warning' :
                        m.tone === 'rose' ? 'text-danger' : 'text-fog'
              return (
                <button
                  key={m.key}
                  className={buttonClass}
                  onClick={() => addMoodEntry(m.key)}
                  aria-label={`Select ${m.label} mood`}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <p className="text-caption mt-1 text-center">{m.label}</p>
                </button>
              )
            })}
          </div>
        </section>

        {/* Current Mood Display */}
        <section className="mb-6">
          <div className="card-surface p-6 text-center">
            <span className="text-4xl">{currentMood?.emoji}</span>
            <h2 className="text-3xl font-bold {getStreakClass(currentMood?.tone)} mb-1">{currentMood?.label}</h2>
            <p className="text-muted mb-2">{currentMood?.note}</p>
            <p className="text-sm text-muted-line">
              {currentMood?.activities[0]} • {currentMood?.activities[1]}
            </p>
          </div>
        </section>

        {/* Daily Streak */}
        <section className="mb-6">
          <div className="card-surface p-4">
            <h3 className="text-xl font-bold text-ink mb-2">Today's Streak</h3>
            <p className="text-5xl font-bold {getStreakClass(currentMood?.tone)}">{dailyStreak} days</p>
            <p className="text-muted">Keep going! Consistency builds resilience.</p>
          </div>
        </section>

        {/* Activity Recommendations */}
        <section>
          <h2 className="text-2xl font-bold text-ink mb-4">Suggested Activities</h2>
          <div className="grid grid-cols-2 gap-3">
            {currentMood?.activities.map((activity, i) => (
              <div key={i} className="card-surface p-3 rounded-md">
                <div className="flex items-start gap-2">
                  <span className="text-xl">{i === 0 ? '📝' : '💧'}</span>
                  <div>
                    <p className="font-medium text-ink">{activity}</p>
                    <p className="text-xs text-muted-line">Recommended for {currentMood?.label.toLowerCase()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}