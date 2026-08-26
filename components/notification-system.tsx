"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, CheckCircle, Calendar, BookOpen, Heart, Wind, TrendingUp, Trash2, MoreVertical } from 'lucide-react'

interface Notification {
  id: string
  type: 'mood' | 'journal' | 'selfcare' | 'report' | 'reminder'
  title: string
  message: string
  timestamp: Date
  read: boolean
  data?: any
}

interface NotificationSystemProps {
  onBack: () => void
}

export default function NotificationSystem({ onBack }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem('MoodMate-notifications')
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications).map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp)
      })))
    }
  }, [])

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n)
      localStorage.setItem('MoodMate-notifications', JSON.stringify(updated))
      return updated
    })
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id)
      localStorage.setItem('MoodMate-notifications', JSON.stringify(updated))
      return updated
    })
  }

  const clearAllNotifications = () => {
    setNotifications([])
    localStorage.removeItem('MoodMate-notifications')
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'mood': return <Heart className="w-5 h-5 text-pink-500" />
      case 'journal': return <BookOpen className="w-5 h-5 text-blue-500" />
      case 'selfcare': return <Wind className="w-5 h-5 text-green-500" />
      case 'report': return <TrendingUp className="w-5 h-5 text-purple-500" />
      case 'reminder': return <Bell className="w-5 h-5 text-orange-500" />
      default: return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mood': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300'
      case 'journal': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'selfcare': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'report': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
      case 'reminder': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return timestamp.toLocaleDateString()
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="mobile-container min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-md mx-auto pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-2">
          <Button variant="ghost" onClick={onBack} className="touch-manipulation">
            <span>← Back</span>
          </Button>
          <div className="text-center flex-1 mx-2">
            <h1 className="mobile-heading font-bold text-gray-800 dark:text-white">Notifications</h1>
            <p className="mobile-subtext text-gray-600 dark:text-gray-300">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
            </p>
          </div>
          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllNotifications}
              className="touch-manipulation mobile-subtext"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Notifications List - Scrollable */}
        <div className="max-h-[calc(100vh-120px)] overflow-y-auto mobile-scroll space-y-3 pb-8">
          {notifications.length === 0 ? (
            <Card className="mobile-card text-center py-8">
              <Bell className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2 mobile-text">No notifications yet</h4>
              <p className="mobile-subtext text-gray-600 dark:text-gray-400">
                Your app notifications will appear here when you use features like mood tracking, journaling, and self-care activities.
              </p>
            </Card>
          ) : (
            notifications
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
              .map((notification) => (
                <Card
                  key={notification.id}
                  className={`mobile-card ${
                    !notification.read ? 'border-blue-300 bg-blue-50/50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-800 dark:text-white mobile-subtext truncate">
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <Badge className={`text-xs px-2 py-1 ${getTypeColor(notification.type)}`}>
                          {notification.type}
                        </Badge>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                      <p className="mobile-subtext text-gray-600 dark:text-gray-400 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {formatTime(notification.timestamp)}
                        </span>
                        <div className="flex items-center space-x-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs h-8 px-2 touch-manipulation"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Read
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-xs h-8 px-2 text-red-500 hover:text-red-700 touch-manipulation"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
          )}
        </div>
      </div>
    </div>
  )
}

// Helper function to add notifications (call this from other components)
export const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
  const newNotification: Notification = {
    ...notification,
    id: Date.now().toString(),
    timestamp: new Date(),
    read: false
  }

  // Get existing notifications
  const existingNotifications = JSON.parse(localStorage.getItem('MoodMate-notifications') || '[]')
  
  // Add new notification to the beginning
  const updatedNotifications = [newNotification, ...existingNotifications]
  
  // Keep only the last 50 notifications
  const trimmedNotifications = updatedNotifications.slice(0, 50)
  
  // Save to localStorage
  localStorage.setItem('MoodMate-notifications', JSON.stringify(trimmedNotifications))
  
  return newNotification
}

// Helper function to get unread count
export const getUnreadNotificationCount = (): number => {
  const notifications = JSON.parse(localStorage.getItem('MoodMate-notifications') || '[]')
  return notifications.filter((n: Notification) => !n.read).length
}