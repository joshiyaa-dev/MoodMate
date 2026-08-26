"use client"

interface MoodEntry {
  id: string
  date: string
  mood: number
  comment: string
  timestamp: number
}

interface JournalEntry {
  id: string
  date: string
  content: string
  timestamp: number
}

export class AIMoodAnalyzer {
  static checkForCrisisIndicators(moodEntries: MoodEntry[], journalEntries: JournalEntry[]): boolean {
    // Check for consistently low mood scores
    const recentEntries = moodEntries.slice(-7) // Last 7 entries
    const lowMoodCount = recentEntries.filter(entry => entry.mood <= 2).length
    
    if (lowMoodCount >= 5) return true // 5 or more low mood entries in recent history
    
    // Check for crisis keywords in journal entries
    const crisisKeywords = [
      'suicide', 'kill myself', 'end it all', 'no point', 'hopeless', 
      'worthless', 'can\'t go on', 'want to die', 'hurt myself'
    ]
    
    const recentJournalEntries = journalEntries.slice(-5) // Last 5 journal entries
    const hasCrisisContent = recentJournalEntries.some(entry => 
      crisisKeywords.some(keyword => 
        entry.content.toLowerCase().includes(keyword.toLowerCase())
      )
    )
    
    return hasCrisisContent
  }

  static analyzeWeeklyMood(moodEntries: MoodEntry[]): string {
    if (moodEntries.length === 0) {
      return "No mood data available for analysis."
    }

    const last7Days = moodEntries.slice(-7)
    const average = last7Days.reduce((sum, entry) => sum + entry.mood, 0) / last7Days.length
    
    if (average >= 4) {
      return "Your mood has been consistently positive this week. You're doing great! Keep up the good work with your self-care routine."
    } else if (average >= 3) {
      return "Your mood has been stable this week. Consider incorporating more activities that bring you joy to boost your overall wellbeing."
    } else if (average >= 2) {
      return "Your mood has been lower than usual this week. This is a good time to focus on self-care and reach out for support if needed."
    } else {
      return "Your mood has been quite low this week. Please consider talking to someone you trust or using your crisis support resources."
    }
  }

  static detectMoodPatterns(moodEntries: MoodEntry[]): string[] {
    const patterns: string[] = []
    
    if (moodEntries.length < 7) {
      return ["Need more data to detect patterns. Keep tracking your mood daily!"]
    }

    // Check for improving trend
    const last7Days = moodEntries.slice(-7)
    const first3 = last7Days.slice(0, 3)
    const last3 = last7Days.slice(-3)
    
    const first3Avg = first3.reduce((sum, entry) => sum + entry.mood, 0) / first3.length
    const last3Avg = last3.reduce((sum, entry) => sum + entry.mood, 0) / last3.length
    
    if (last3Avg > first3Avg + 0.5) {
      patterns.push("📈 Your mood is trending upward - great progress!")
    } else if (first3Avg > last3Avg + 0.5) {
      patterns.push("📉 Your mood has been declining recently. Consider what might be affecting you.")
    }

    // Check for volatility
    const moodChanges = last7Days.slice(1).map((entry, i) => Math.abs(entry.mood - last7Days[i].mood))
    const avgChange = moodChanges.reduce((sum, change) => sum + change, 0) / moodChanges.length
    
    if (avgChange > 1.5) {
      patterns.push("🎢 Your mood has been quite variable. Try to identify triggers and coping strategies.")
    } else if (avgChange < 0.5) {
      patterns.push("📊 Your mood has been stable, which is a positive sign of emotional regulation.")
    }

    // Check for weekend patterns
    const weekendEntries = moodEntries.filter(entry => {
      const day = new Date(entry.date).getDay()
      return day === 0 || day === 6 // Sunday or Saturday
    })
    
    const weekdayEntries = moodEntries.filter(entry => {
      const day = new Date(entry.date).getDay()
      return day >= 1 && day <= 5 // Monday to Friday
    })

    if (weekendEntries.length > 0 && weekdayEntries.length > 0) {
      const weekendAvg = weekendEntries.reduce((sum, entry) => sum + entry.mood, 0) / weekendEntries.length
      const weekdayAvg = weekdayEntries.reduce((sum, entry) => sum + entry.mood, 0) / weekdayEntries.length
      
      if (weekendAvg > weekdayAvg + 0.5) {
        patterns.push("🌅 Your mood tends to be better on weekends. Consider bringing weekend activities into your weekdays.")
      } else if (weekdayAvg > weekendAvg + 0.5) {
        patterns.push("💼 Your mood is better during weekdays. You might thrive on routine and structure.")
      }
    }

    return patterns.length > 0 ? patterns : ["Keep tracking to discover your unique mood patterns!"]
  }

  static generateJournalInsights(journalEntries: JournalEntry[]): string {
    if (journalEntries.length === 0) {
      return "Start journaling to gain insights into your thoughts and feelings."
    }

    const recentEntries = journalEntries.slice(-5)
    const totalWords = recentEntries.reduce((sum, entry) => sum + entry.content.split(' ').length, 0)
    const avgWordsPerEntry = Math.round(totalWords / recentEntries.length)

    // Analyze sentiment keywords
    const positiveWords = ['happy', 'grateful', 'excited', 'proud', 'accomplished', 'joy', 'love', 'peaceful', 'content', 'hopeful']
    const negativeWords = ['sad', 'angry', 'frustrated', 'worried', 'anxious', 'stressed', 'overwhelmed', 'tired', 'lonely', 'disappointed']
    
    let positiveCount = 0
    let negativeCount = 0
    
    recentEntries.forEach(entry => {
      const content = entry.content.toLowerCase()
      positiveWords.forEach(word => {
        if (content.includes(word)) positiveCount++
      })
      negativeWords.forEach(word => {
        if (content.includes(word)) negativeCount++
      })
    })

    if (positiveCount > negativeCount) {
      return `Your recent journal entries show a positive outlook with an average of ${avgWordsPerEntry} words per entry. You're expressing gratitude and joy - keep it up!`
    } else if (negativeCount > positiveCount) {
      return `Your recent entries reflect some challenges with an average of ${avgWordsPerEntry} words per entry. Journaling is helping you process difficult emotions.`
    } else {
      return `Your journal entries show balanced emotional expression with an average of ${avgWordsPerEntry} words per entry. This self-reflection is valuable for your mental health.`
    }
  }
}