"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Target, BookOpen, TrendingUp, Shield, Settings, Smile, Meh, Frown, Wind, Calendar, Award, Users, Music } from "lucide-react"
import OnboardingFlow from "@/components/onboarding-flow"
import MoodCheckIn from "@/components/mood-check-in"
import JournalEntry from "@/components/journal-entry"
import SelfCareTools from "@/components/self-care-tools"
import Analytics from "@/components/analytics"
import AppSettings from "@/components/app-settings"
import { useLocalStorage } from "@/hooks/use-local-storage"
import NotificationManager from "@/components/notification-manager"
import SplashScreen from "@/components/splash-screen"
import TTSManagerComponent from "@/components/tts-manager"
import HelpGuide from "@/components/help-guide"
import FeedbackForm from "@/components/feedback-form"
import GoalsTracker from "@/components/goals-tracker"
import HabitsTracker from "@/components/habits-tracker"
import CommunitySupport from "@/components/community-support"
import { useMobileBackHandler } from "@/hooks/use-mobile-back-handler"
import { useMobileKeyboard } from "@/hooks/use-mobile-keyboard"
import MobileHomeDashboard from "@/components/mobile-home-dashboard"
import EnhancedMusicPlayer from "@/components/self-care/enhanced-music-player"
import NotificationSystem from "@/components/notification-system"
import MoodHeatmap from "@/components/mood-heatmap"
import DataPrivacyCenter from "@/components/data-privacy-center"
import PinLock from "@/components/pin-lock"

function MoodHeatmapScreen({ moodEntries, onBack }: { moodEntries: any[]; onBack: () => void }) {
  return (
    <div className="mobile-container mobile-constrained bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-lg mx-auto space-y-4 p-4 pt-6">
        <button onClick={onBack} className="text-sm font-bold text-gray-500 dark:text-gray-300">← Back</button>
        <h1 className="text-2xl font-black text-gray-800 dark:text-white">Mood Calendar</h1>
        <MoodHeatmap entries={moodEntries} />
      </div>
    </div>
  )
}

function PrivacyCenterScreen({ moodEntries, onBack }: { moodEntries: any[]; onBack: () => void }) {
  return (
    <div className="mobile-container mobile-constrained bg-gradient-to-br from-slate-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-lg mx-auto space-y-4 p-4 pt-6">
        <button onClick={onBack} className="text-sm font-bold text-gray-500 dark:text-gray-300">← Back</button>
        <DataPrivacyCenter moodEntries={moodEntries} />
      </div>
    </div>
  )
}

interface ThemeContextType {
  theme: string
  fontSize: string
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

type Screen =
  | "splash"
  | "onboarding"
  | "home"
  | "mood"
  | "journal"
  | "goals"
  | "habits"
  | "community"
  | "self-care"
  | "analytics"
 | "heatmap"
 | "privacy"
  | "settings"
  | "help"
  | "feedback"
  | "music-player"
  | "notifications"

interface UserProfile {
  name: string
  language: string
  emergencyContact: string
}

interface MoodEntry {
  id: string
  date: string
  mood: number // 1-5 scale
  comment: string
  timestamp: number
}

// Helper function to generate user-specific key
const getUserKey = (profile: UserProfile | null, suffix: string) => {
  if (!profile) return suffix
  return `${profile.name.toLowerCase()}_${suffix}`
}

export default function MentalHealthApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash")
const [pinUnlocked, setPinUnlocked] = useState(false)
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>("user_profile", null)
  
  // Mobile optimizations
  const { keyboardState } = useMobileKeyboard()
  
  // User-specific data - initialized with empty defaults
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [journalEntries, setJournalEntries] = useState<any[]>([])
  const [notifications, setNotifications] = useState({
    moodReminders: true,
    journalReminders: true,
    selfCareReminders: false,
    weeklyReports: true,
  })
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(false)
  
  const [theme, setTheme] = useLocalStorage<"light" | "dark" | "auto">("app_theme", "dark")
  const [fontSize, setFontSize] = useLocalStorage<"small" | "medium" | "large">("app_font_size", "medium")
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("dark")

  // Detect system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light')
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Get effective theme
  const getEffectiveTheme = () => {
    if (theme === "auto") return systemTheme
    return theme
  }

  // Load user-specific data when profile changes
  useEffect(() => {
    if (userProfile) {
      setCurrentScreen("home")
      loadUserData(userProfile)
    } else {
      // Reset data when no user is logged in
      setMoodEntries([])
      setJournalEntries([])
      setNotifications({
        moodReminders: true,
        journalReminders: true,
        selfCareReminders: false,
        weeklyReports: true,
      })
      setTtsEnabled(false)
    }
  }, [userProfile])

  // Save user data whenever it changes
  useEffect(() => {
    if (userProfile) {
      saveUserData(userProfile, 'mood_entries', moodEntries)
    }
  }, [moodEntries, userProfile])

  useEffect(() => {
    if (userProfile) {
      saveUserData(userProfile, 'journal_entries', journalEntries)
    }
  }, [journalEntries, userProfile])

  useEffect(() => {
    if (userProfile) {
      saveUserData(userProfile, 'app_notifications', notifications)
    }
  }, [notifications, userProfile])

  useEffect(() => {
    if (userProfile) {
      saveUserData(userProfile, 'tts_enabled', ttsEnabled)
    }
  }, [ttsEnabled, userProfile])

  // Load user-specific data
  const loadUserData = (profile: UserProfile) => {
    const userKey = `${profile.name.toLowerCase()}`
    
    try {
      const moodData = localStorage.getItem(`${userKey}_mood_entries`)
      if (moodData) {
        setMoodEntries(JSON.parse(moodData))
      }

      const journalData = localStorage.getItem(`${userKey}_journal_entries`)
      if (journalData) {
        setJournalEntries(JSON.parse(journalData))
      }

      const notificationData = localStorage.getItem(`${userKey}_app_notifications`)
      if (notificationData) {
        setNotifications(JSON.parse(notificationData))
      }

      const ttsData = localStorage.getItem(`${userKey}_tts_enabled`)
      if (ttsData) {
        setTtsEnabled(JSON.parse(ttsData))
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  // Save user-specific data
  const saveUserData = (profile: UserProfile, key: string, data: any) => {
    const userKey = `${profile.name.toLowerCase()}_${key}`
    try {
      localStorage.setItem(userKey, JSON.stringify(data))
    } catch (error) {
      console.error('Error saving user data:', error)
    }
  }

  // Handle user logout
  const handleLogout = () => {
    setUserProfile(null)
    setCurrentScreen("onboarding")
  }

  // Handle profile completion - check if user data exists
  const handleProfileComplete = (newProfile: UserProfile) => {
    setUserProfile(newProfile)
  }

  const getTodaysMood = () => {
    const today = new Date().toDateString()
    return moodEntries.find((entry) => new Date(entry.date).toDateString() === today)
  }

  const getRecentMoodTrend = () => {
    const recent = moodEntries.slice(-7)
    if (recent.length === 0) return "neutral"
    const avg = recent.reduce((sum, entry) => sum + entry.mood, 0) / recent.length
    if (avg >= 4) return "positive"
    if (avg <= 2) return "concerning"
    return "neutral"
  }

  const renderScreen = () => {
    // PIN privacy gate: checked once boot reaches past the splash.
    if (typeof window !== "undefined" && localStorage.getItem("moodmate-pin") && !pinUnlocked && currentScreen !== "splash" && currentScreen !== "onboarding") {
      return <PinLock onUnlocked={() => setPinUnlocked(true)} />
    }
    switch (currentScreen) {
      case "splash":
        return <SplashScreen onComplete={() => setCurrentScreen(userProfile ? "home" : "onboarding")} />
      case "onboarding":
        return <OnboardingFlow onComplete={handleProfileComplete} />
      case "mood":
        return (
          <MoodCheckIn
            moodEntries={moodEntries}
            setMoodEntries={setMoodEntries}
            journalEntries={journalEntries}
            onBack={() => setCurrentScreen("home")}
          />
        )
      case "journal":
        return (
          <JournalEntry
            journalEntries={journalEntries}
            setJournalEntries={setJournalEntries}
            onBack={() => setCurrentScreen("home")}
          />
        )
      case "goals":
        return <GoalsTracker onBack={() => setCurrentScreen("home")} />
      case "habits":
        return <HabitsTracker onBack={() => setCurrentScreen("home")} />
      case "community":
        return <CommunitySupport onBack={() => setCurrentScreen("home")} />

      case "self-care":
        return <SelfCareTools onBack={() => setCurrentScreen("home")} />

      case "analytics":
        return (
          <Analytics
            moodEntries={moodEntries}
            journalEntries={journalEntries}
            onBack={() => setCurrentScreen("home")}
          />
        )
      case "heatmap":
        return <MoodHeatmapScreen moodEntries={moodEntries} onBack={() => setCurrentScreen("home")} />
      case "privacy":
        return <PrivacyCenterScreen moodEntries={moodEntries} onBack={() => setCurrentScreen("home")} />
      case "settings":
        return (
          <AppSettings
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            notifications={notifications}
            setNotifications={setNotifications}
            onBack={() => setCurrentScreen("home")}
            ttsEnabled={ttsEnabled}
            setTtsEnabled={setTtsEnabled}
            theme={theme}
            setTheme={setTheme}
            fontSize={fontSize}
            setFontSize={setFontSize}
            onNavigate={(screen: string) => setCurrentScreen(screen as Screen)}
            onLogout={handleLogout}
          />
        )
      case "help":
        return <HelpGuide onBack={() => setCurrentScreen("settings")} />
      case "feedback":
        return <FeedbackForm onBack={() => setCurrentScreen("settings")} />
      case "music-player":
        return <EnhancedMusicPlayer onBack={() => setCurrentScreen("home")} />
      case "notifications":
        return <NotificationSystem onBack={() => setCurrentScreen("settings")} />
      default:
        return renderHomeScreen()
    }
  }

  const renderHomeScreen = () => {
    const todaysMood = getTodaysMood()
    const moodTrend = getRecentMoodTrend()

    return (
      <MobileHomeDashboard 
        userProfile={userProfile}
        todaysMood={todaysMood}
        moodTrend={moodTrend}
        onNavigate={(screen: string) => setCurrentScreen(screen as Screen)}
        onSettingsOpen={() => setCurrentScreen("settings")}
        moodEntries={moodEntries}
        journalEntries={journalEntries}
      />
    )
  }

  // Handle mobile back button
  const handleBackButton = () => {
    if (currentScreen === "home") {
      // At home screen - return false to allow double-tap exit with confirmation
      return false
    } else if (currentScreen === "splash" || currentScreen === "onboarding") {
      // Don't handle back button for splash and onboarding
      return false
    } else if (currentScreen === "help" || currentScreen === "feedback" || currentScreen === "notifications") {
      // Navigate back to settings
      setCurrentScreen("settings")
      return true
    } else if (currentScreen === "music-player") {
      // Navigate back to home from music player
      setCurrentScreen("home")
      return true
    } else {
      // Navigate back to home from other screens
      setCurrentScreen("home")
      return true
    }
  }

  // Enable back button handler for all screens
  useMobileBackHandler({
    onBack: handleBackButton,
    enabled: currentScreen !== "splash" && currentScreen !== "onboarding",
    isHomeScreen: currentScreen === "home"
  })

  const effectiveTheme = getEffectiveTheme()
  const getFontSizeClass = () => {
    switch (fontSize) {
      case "small": return "text-xs"
      case "large": return "text-base"
      default: return "text-sm"
    }
  }

  return (
    <ThemeContext.Provider value={{ theme: effectiveTheme, fontSize }}>
      <NotificationManager notifications={notifications} />
      <TTSManagerComponent language={userProfile?.language || "English"} enabled={ttsEnabled} />
      <div
        className={`${effectiveTheme === "dark" ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"} ${getFontSizeClass()} min-h-screen ${keyboardState.isOpen ? 'keyboard-open' : ''} transition-colors`}
        style={{
          paddingBottom: keyboardState.isOpen ? `${keyboardState.height}px` : '0px'
        }}
      >
        {renderScreen()}
      </div>
    </ThemeContext.Provider>
  )
}