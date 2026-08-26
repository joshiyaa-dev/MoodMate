"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Heart, 
  Target, 
  BookOpen, 
  TrendingUp, 
  Settings, 
  Smile, 
  Meh, 
  Frown, 
  Wind, 
  Calendar, 
  Award, 
  Users, 
  Music,
  Home,
  MoreHorizontal,
  Sparkles,
  Shield
} from 'lucide-react'

interface MobileHomeDashboardProps {
  userProfile: any
  todaysMood: any
  moodTrend: string
  onNavigate: (screen: string) => void
  onSettingsOpen: () => void
  moodEntries: any[]
  journalEntries: any[]
}

export default function MobileHomeDashboard({ 
  userProfile, 
  todaysMood, 
  moodTrend, 
  onNavigate, 
  onSettingsOpen,
  moodEntries,
  journalEntries 
}: MobileHomeDashboardProps) {
  const [activeTab, setActiveTab] = useState("home")

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const getStats = () => {
    const todayEntries = journalEntries.filter(entry => 
      new Date(entry.date).toDateString() === new Date().toDateString()
    )
    const weekMoods = moodEntries.filter(entry => {
      const entryDate = new Date(entry.date)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return entryDate >= weekAgo
    })

    return {
      todayJournals: todayEntries.length,
      weekMoods: weekMoods.length,
      streak: calculateStreak()
    }
  }

  const calculateStreak = () => {
    if (moodEntries.length === 0) return 0
    
    let streak = 0
    const sortedEntries = [...moodEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    const today = new Date()
    
    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date)
      const expectedDate = new Date(today)
      expectedDate.setDate(today.getDate() - i)
      
      if (entryDate.toDateString() === expectedDate.toDateString()) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  const stats = getStats()

  const renderHomeTab = () => (
    <div className="space-y-6 pb-8">
      {/* Welcome Header */}
      <div className="text-center py-3">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          {getGreeting()}, {userProfile?.name} 👋
        </h1>
        <p className="mobile-subtext text-gray-600 dark:text-gray-300 mt-2">
          How are you feeling today?
        </p>
      </div>

      {/* Today's Mood Status */}
      <Card className="mobile-card">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 dark:text-white mobile-text">Today's Check-in</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {todaysMood ? "Completed" : "Not yet completed"}
            </p>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            {todaysMood ? (
              <>
                {todaysMood.mood >= 4 ? (
                  <Smile className="mobile-icon text-green-500" />
                ) : todaysMood.mood === 3 ? (
                  <Meh className="mobile-icon text-yellow-500" />
                ) : (
                  <Frown className="mobile-icon text-red-500" />
                )}
                <Badge
                  variant={
                    moodTrend === "positive" ? "default" : moodTrend === "concerning" ? "destructive" : "secondary"
                  }
                  className="text-xs px-2 py-1"
                >
                  {moodTrend}
                </Badge>
              </>
            ) : (
              <Button size="sm" onClick={() => onNavigate("mood")} className="mobile-button text-xs">
                Check In
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="mobile-card text-center">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
            <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-lg font-bold text-gray-800 dark:text-white">{stats.streak}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Day Streak</div>
        </Card>
        <Card className="mobile-card text-center">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
            <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-lg font-bold text-gray-800 dark:text-white">{stats.todayJournals}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Today's Entries</div>
        </Card>
        <Card className="mobile-card text-center">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
            <Heart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-lg font-bold text-gray-800 dark:text-white">{stats.weekMoods}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">This Week</div>
        </Card>
      </div>

      {/* Primary Actions */}
      <div className="mobile-grid-responsive">
        <Card
          className="mobile-card mobile-card-interactive touch-target min-h-[120px] flex flex-col justify-center"
          onClick={() => onNavigate("mood")}
        >
          <div className="text-center">
            <Heart className="w-8 h-8 mx-auto mb-3 text-pink-500" />
            <h3 className="font-semibold mobile-text mb-1">Mood Check</h3>
            <p className="mobile-subtext text-gray-600 dark:text-gray-400">Daily tracking</p>
          </div>
        </Card>

        <Card
          className="mobile-card mobile-card-interactive touch-target min-h-[120px] flex flex-col justify-center"
          onClick={() => onNavigate("journal")}
        >
          <div className="text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-3 text-blue-500" />
            <h3 className="font-semibold mobile-text mb-1">Journal</h3>
            <p className="mobile-subtext text-gray-600 dark:text-gray-400">Write thoughts</p>
          </div>
        </Card>

        <Card
          className="mobile-card mobile-card-interactive touch-target min-h-[120px] flex flex-col justify-center"
          onClick={() => onNavigate("self-care")}
        >
          <div className="text-center">
            <Wind className="w-8 h-8 mx-auto mb-3 text-green-500" />
            <h3 className="font-semibold mobile-text mb-1">Self-Care</h3>
            <p className="mobile-subtext text-gray-600 dark:text-gray-400">Breathe & relax</p>
          </div>
        </Card>

        <Card
          className="mobile-card mobile-card-interactive touch-target min-h-[120px] flex flex-col justify-center"
          onClick={() => onNavigate("analytics")}
        >
          <div className="text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-3 text-purple-500" />
            <h3 className="font-semibold mobile-text mb-1">Insights</h3>
            <p className="mobile-subtext text-gray-600 dark:text-gray-400">View progress</p>
          </div>
        </Card>
      </div>

      {/* AI Insights */}
      {moodEntries.length > 0 && (
        <Card className="mobile-card bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2 mobile-text">AI Insight</h3>
              <p className="mobile-subtext text-gray-700 dark:text-gray-300 leading-relaxed">
                {moodTrend === "positive"
                  ? "You've been maintaining a positive mood lately! Keep up the great work with your self-care routine."
                  : moodTrend === "concerning"
                    ? "I've noticed your mood has been lower recently. Consider trying some breathing exercises or reaching out to someone you trust."
                    : "Your mood has been stable. Remember to check in with yourself regularly and practice self-compassion."}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )

  const renderToolsTab = () => (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="text-center py-3">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Your Wellness Tools</h2>
        <p className="mobile-subtext text-gray-600 dark:text-gray-300 mt-2">
          Everything you need for your mental health journey
        </p>
      </div>

      {/* Tools Grid */}
      <div className="mobile-grid-extended">
        <Button
          variant="outline"
          size="lg"
          onClick={() => onNavigate("goals")}
          className="flex flex-col items-center p-4 h-auto touch-target min-h-[80px] mobile-button"
        >
          <Target className="w-6 h-6 mb-2 text-purple-500" />
          <span className="mobile-subtext font-medium">Goals</span>
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => onNavigate("habits")}
          className="flex flex-col items-center p-4 h-auto touch-target min-h-[80px] mobile-button"
        >
          <Award className="w-6 h-6 mb-2 text-yellow-500" />
          <span className="mobile-subtext font-medium">Habits</span>
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => onNavigate("community")}
          className="flex flex-col items-center p-4 h-auto touch-target min-h-[80px] mobile-button"
        >
          <Users className="w-6 h-6 mb-2 text-blue-500" />
          <span className="mobile-subtext font-medium">Community</span>
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => onNavigate("music-player")}
          className="flex flex-col items-center p-4 h-auto touch-target min-h-[80px] mobile-button"
        >
          <Music className="w-6 h-6 mb-2 text-green-500" />
          <span className="mobile-subtext font-medium">Music</span>
        </Button>



        <Button
          variant="outline"
          size="lg"
          onClick={() => onNavigate("analytics")}
          className="flex flex-col items-center p-4 h-auto touch-target min-h-[80px] mobile-button"
        >
          <TrendingUp className="w-6 h-6 mb-2 text-indigo-500" />
          <span className="mobile-subtext font-medium">Analytics</span>
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => onNavigate("heatmap")}
          className="flex flex-col items-center p-4 h-auto touch-target min-h-[80px] mobile-button"
        >
          <Calendar className="w-6 h-6 mb-2 text-rose-500" />
          <span className="mobile-subtext font-medium">Mood Calendar</span>
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => onNavigate("privacy")}
          className="flex flex-col items-center p-4 h-auto touch-target min-h-[80px] mobile-button"
        >
          <Shield className="w-6 h-6 mb-2 text-emerald-500" />
          <span className="mobile-subtext font-medium">Data &amp; Privacy</span>
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800 dark:text-white mobile-text">Quick Actions</h3>
        <div className="space-y-2">
          <Card 
            className="mobile-card mobile-card-interactive p-3 cursor-pointer"
            onClick={() => onNavigate("mood")}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 dark:text-white mobile-text">Quick Mood Check</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Log how you're feeling right now</p>
              </div>
            </div>
          </Card>

          <Card 
            className="mobile-card mobile-card-interactive p-3 cursor-pointer"
            onClick={() => onNavigate("self-care")}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Wind className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 dark:text-white mobile-text">Self-Care Tools</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Wellness activities and exercises</p>
              </div>
            </div>
          </Card>

          <Card 
            className="mobile-card mobile-card-interactive p-3 cursor-pointer"
            onClick={() => onNavigate("journal")}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 dark:text-white mobile-text">Voice Journal</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Speak your thoughts and feelings</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )

  return (
    <div className="mobile-container keyboard-aware-container bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
      {/* Top Header with Settings */}
      <div className="flex items-center justify-between py-3 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-800 dark:text-white">MOOD MATE</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-10 h-10 p-0 rounded-full"
            onClick={onSettingsOpen}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Dual Tab Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger 
            value="home" 
            className="flex items-center space-x-2 mobile-button"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </TabsTrigger>
          <TabsTrigger 
            value="tools" 
            className="flex items-center space-x-2 mobile-button"
          >
            <MoreHorizontal className="w-4 h-4" />
            <span>Tools</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="mt-0">
          {renderHomeTab()}
        </TabsContent>

        <TabsContent value="tools" className="mt-0">
          {renderToolsTab()}
        </TabsContent>
      </Tabs>
    </div>
  )
}