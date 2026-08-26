"use client"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Bell, Download, Trash2, HelpCircle, LogOut, Eye } from "lucide-react"
import { getUnreadNotificationCount } from "@/components/notification-system"

interface AppSettingsProps {
  userProfile: any
  setUserProfile: (profile: any) => void
  notifications: any
  setNotifications: (notifications: any) => void
  ttsEnabled: boolean
  setTtsEnabled: (enabled: boolean) => void
  theme: "light" | "dark" | "auto"
  setTheme: (theme: "light" | "dark" | "auto") => void
  fontSize: "small" | "medium" | "large"
  setFontSize: (size: "small" | "medium" | "large") => void
  onBack: () => void
  onNavigate: (screen: string) => void
  onLogout: () => void
}

export default function AppSettings({
  userProfile,
  setUserProfile,
  notifications,
  setNotifications,
  ttsEnabled,
  setTtsEnabled,
  theme,
  setTheme,
  fontSize,
  setFontSize,
  onBack,
  onNavigate,
  onLogout,
}: AppSettingsProps) {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Update unread count on component mount and periodically
    const updateCount = () => setUnreadCount(getUnreadNotificationCount())
    updateCount()
    
    const interval = setInterval(updateCount, 1000) // Check every second
    return () => clearInterval(interval)
  }, [])

  const handleProfileUpdate = (field: string, value: any) => {
    setUserProfile({
      ...userProfile,
      [field]: value,
    })
  }

  const handleExportData = () => {
    try {
      // Get all data from localStorage
      const userData = {
        profile: JSON.parse(localStorage.getItem("user_profile") || "null"),
        moodEntries: JSON.parse(localStorage.getItem("mood_entries") || "[]"),
        journalEntries: JSON.parse(localStorage.getItem("journal_entries") || "[]"),
        settings: {
          theme: localStorage.getItem("app_theme") || "light",
          fontSize: localStorage.getItem("app_font_size") || "medium",
        },
        exportDate: new Date().toISOString(),
      }

      // Create and download JSON file
      const dataStr = JSON.stringify(userData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `mood-mate-data-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      alert("Your data has been exported successfully!")
    } catch (error) {
      alert("Error exporting data. Please try again.")
    }
  }

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all your data? This action cannot be undone.")) {
      try {
        // Clear all app data from localStorage
        localStorage.removeItem("user_profile")
        localStorage.removeItem("mood_entries")
        localStorage.removeItem("journal_entries")
        localStorage.removeItem("app_theme")
        localStorage.removeItem("app_font_size")

        alert("All data has been cleared successfully. The app will reload.")
        window.location.reload()
      } catch (error) {
        alert("Error clearing data. Please try again.")
      }
    }
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications({
      ...notifications,
      [key]: value,
    })
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 p-4 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={onBack} className="mobile-button">
            <ArrowLeft className="mobile-icon" />
          </Button>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex-1 text-center mx-2">Settings</h1>
          <div className="w-8" />
        </div>

        <div className="space-y-6 pb-8">
          {/* Profile Settings */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Profile
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={userProfile?.name || ""}
                  onChange={(e) => handleProfileUpdate("name", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={userProfile?.age || ""}
                  onChange={(e) => handleProfileUpdate("age", Number.parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Select
                  value={userProfile?.language || "English"}
                  onValueChange={(value) => handleProfileUpdate("language", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Español</SelectItem>
                    <SelectItem value="French">Français</SelectItem>
                    <SelectItem value="German">Deutsch</SelectItem>
                    <SelectItem value="Portuguese">Português</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="emergency">Emergency Contact</Label>
                <Input
                  id="emergency"
                  value={userProfile?.emergencyContact || ""}
                  onChange={(e) => handleProfileUpdate("emergencyContact", e.target.value)}
                  placeholder="Name & Phone Number"
                />
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notifications
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate("notifications")}
                className="flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
                {unreadCount > 0 && (
                  <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5 ml-1">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="mood-reminders">Daily Mood Check-in</Label>
                  <p className="text-xs text-gray-600">Remind me to log my mood</p>
                </div>
                <Switch
                  id="mood-reminders"
                  checked={notifications.moodReminders}
                  onCheckedChange={(checked) => handleNotificationChange("moodReminders", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="journal-reminders">Journal Reminders</Label>
                  <p className="text-xs text-gray-600">Encourage regular journaling</p>
                </div>
                <Switch
                  id="journal-reminders"
                  checked={notifications.journalReminders}
                  onCheckedChange={(checked) => handleNotificationChange("journalReminders", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="selfcare-reminders">Self-Care Reminders</Label>
                  <p className="text-xs text-gray-600">Prompts for breathing exercises</p>
                </div>
                <Switch
                  id="selfcare-reminders"
                  checked={notifications.selfCareReminders}
                  onCheckedChange={(checked) => handleNotificationChange("selfCareReminders", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-reports">Weekly Reports</Label>
                  <p className="text-xs text-gray-600">AI-generated mood summaries</p>
                </div>
                <Switch
                  id="weekly-reports"
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => handleNotificationChange("weeklyReports", checked)}
                />
              </div>
            </div>
          </Card>

          {/* App Settings */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">App Settings</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto (System)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fontSize">Font Size</Label>
                <Select value={fontSize} onValueChange={setFontSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (12px)</SelectItem>
                    <SelectItem value="medium">Medium (14px)</SelectItem>
                    <SelectItem value="large">Large (16px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="tts">Text-to-Speech</Label>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Read content aloud</p>
                </div>
                <Switch
                  id="tts"
                  checked={ttsEnabled}
                  onCheckedChange={setTtsEnabled}
                />
              </div>
            </div>
          </Card>

          {/* Account Actions */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Account</h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" 
                onClick={onLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
              <p className="text-xs text-gray-500">
                Logging out will take you back to the welcome screen. Your data will remain saved for this user profile.
              </p>
            </div>
          </Card>

          {/* Data Management */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Data Management</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleExportData}>
                <Download className="w-4 h-4 mr-2" />
                Export My Data
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent"
                onClick={handleClearData}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">All data is stored locally on your device for privacy</p>
          </Card>

          {/* Help & Support */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
              <HelpCircle className="w-5 h-5 mr-2" />
              Help & Support
            </h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => onNavigate("help")}
              >
                User Guide
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => onNavigate("feedback")}
              >
                Send Feedback
              </Button>
            </div>
          </Card>

          {/* App Info */}
          <Card className="p-6 bg-gray-50 dark:bg-gray-800">
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <p className="font-semibold text-lg">MOOD MATE v1.0</p>
              <p className="text-base mt-2">Your offline mental health companion</p>
              <p className="mt-3 text-sm">Built with privacy in mind • All data stays on your device</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
