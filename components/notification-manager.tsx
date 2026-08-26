"use client"

import { useEffect } from "react"

interface NotificationManagerProps {
  notifications: {
    moodReminders: boolean
    journalReminders: boolean
    selfCareReminders: boolean
    weeklyReports: boolean
  }
}

export default function NotificationManager({ notifications }: NotificationManagerProps) {
  useEffect(() => {
    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }

    // Set up notification schedules
    if (notifications.moodReminders) {
      scheduleMoodReminder()
    }

    if (notifications.journalReminders) {
      scheduleJournalReminder()
    }

    if (notifications.selfCareReminders) {
      scheduleSelfCareReminder()
    }
  }, [notifications])

  const scheduleMoodReminder = () => {
    // Schedule daily mood check-in reminder at 9 AM
    const now = new Date()
    const reminderTime = new Date()
    reminderTime.setHours(9, 0, 0, 0)

    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1)
    }

    const timeUntilReminder = reminderTime.getTime() - now.getTime()

    setTimeout(() => {
      if (Notification.permission === "granted") {
        new Notification("MoodMate Reminder", {
          body: "Time for your daily mood check-in! How are you feeling today?",
          icon: "/favicon.ico",
          tag: "mood-reminder",
        })
      }

      // Schedule next day
      setInterval(
        () => {
          if (Notification.permission === "granted") {
            new Notification("MoodMate Reminder", {
              body: "Time for your daily mood check-in! How are you feeling today?",
              icon: "/favicon.ico",
              tag: "mood-reminder",
            })
          }
        },
        24 * 60 * 60 * 1000,
      ) // 24 hours
    }, timeUntilReminder)
  }

  const scheduleJournalReminder = () => {
    // Schedule journal reminder at 8 PM
    const now = new Date()
    const reminderTime = new Date()
    reminderTime.setHours(20, 0, 0, 0)

    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1)
    }

    const timeUntilReminder = reminderTime.getTime() - now.getTime()

    setTimeout(() => {
      if (Notification.permission === "granted") {
        new Notification("MoodMate Journal", {
          body: "Take a moment to reflect and write in your journal.",
          icon: "/favicon.ico",
          tag: "journal-reminder",
        })
      }

      // Schedule next day
      setInterval(
        () => {
          if (Notification.permission === "granted") {
            new Notification("MoodMate Journal", {
              body: "Take a moment to reflect and write in your journal.",
              icon: "/favicon.ico",
              tag: "journal-reminder",
            })
          }
        },
        24 * 60 * 60 * 1000,
      )
    }, timeUntilReminder)
  }

  const scheduleSelfCareReminder = () => {
    // Schedule self-care reminders every 4 hours
    const interval = 4 * 60 * 60 * 1000 // 4 hours

    setInterval(() => {
      if (Notification.permission === "granted") {
        const messages = [
          "Take a deep breath and relax for a moment.",
          "Remember to stay hydrated! 💧",
          "Time for a quick breathing exercise.",
          "How about a short walk or stretch?",
          "Take a moment to practice gratitude.",
        ]

        const randomMessage = messages[Math.floor(Math.random() * messages.length)]

        new Notification("MoodMate Self-Care", {
          body: randomMessage,
          icon: "/favicon.ico",
          tag: "selfcare-reminder",
        })
      }
    }, interval)
  }

  return null // This component doesn't render anything
}
