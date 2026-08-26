"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mic, FileText, Bell, Check, X, AlertCircle, Shield } from 'lucide-react'

interface PermissionStatus {
  microphone: 'granted' | 'denied' | 'prompt' | 'unknown'
  notifications: 'granted' | 'denied' | 'default' | 'unknown'
  storage: 'granted' | 'denied' | 'prompt' | 'unknown'
}

interface MobilePermissionsProps {
  onComplete: () => void
  onSkip?: () => void
}

export default function MobilePermissions({ onComplete, onSkip }: MobilePermissionsProps) {
  const [permissions, setPermissions] = useState<PermissionStatus>({
    microphone: 'unknown',
    notifications: 'unknown',
    storage: 'unknown'
  })
  
  const [isChecking, setIsChecking] = useState(false)
  const [currentStep, setCurrentStep] = useState<'intro' | 'requesting' | 'completed'>('intro')

  // Check current permission status
  useEffect(() => {
    checkPermissions()
  }, [])

  const checkPermissions = async () => {
    try {
      // Check microphone permission
      if (navigator.permissions) {
        const micResult = await navigator.permissions.query({ name: 'microphone' as PermissionName })
        setPermissions(prev => ({ ...prev, microphone: micResult.state as any }))
      }

      // Check notification permission
      if ('Notification' in window) {
        const notificationStatus = Notification.permission
        setPermissions(prev => ({ ...prev, notifications: notificationStatus as any }))
      }

      // Storage permission is usually always granted for web apps
      setPermissions(prev => ({ ...prev, storage: 'granted' }))
    } catch (error) {
      console.log('Permission check error:', error)
    }
  }

  const requestMicrophonePermission = async () => {
    try {
      setIsChecking(true)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop()) // Stop the stream immediately
      setPermissions(prev => ({ ...prev, microphone: 'granted' }))
      return true
    } catch (error) {
      console.log('Microphone permission denied:', error)
      setPermissions(prev => ({ ...prev, microphone: 'denied' }))
      return false
    } finally {
      setIsChecking(false)
    }
  }

  const requestNotificationPermission = async () => {
    try {
      setIsChecking(true)
      if ('Notification' in window) {
        const permission = await Notification.requestPermission()
        setPermissions(prev => ({ ...prev, notifications: permission as any }))
        return permission === 'granted'
      }
      return false
    } catch (error) {
      console.log('Notification permission error:', error)
      return false
    } finally {
      setIsChecking(false)
    }
  }

  const requestAllPermissions = async () => {
    setCurrentStep('requesting')
    
    // Request microphone (mandatory)
    await requestMicrophonePermission()
    
    // Request notifications (optional)
    await requestNotificationPermission()
    
    setCurrentStep('completed')
  }

  const getPermissionIcon = (status: string) => {
    switch (status) {
      case 'granted':
        return <Check className="w-5 h-5 text-green-500" />
      case 'denied':
        return <X className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
    }
  }

  const getPermissionBadge = (status: string) => {
    switch (status) {
      case 'granted':
        return <Badge variant="default" className="text-xs">Granted</Badge>
      case 'denied':
        return <Badge variant="destructive" className="text-xs">Denied</Badge>
      default:
        return <Badge variant="secondary" className="text-xs">Pending</Badge>
    }
  }

  if (currentStep === 'intro') {
    return (
      <div className="mobile-container keyboard-aware-container bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="flex flex-col h-full justify-center space-y-6 max-w-md mx-auto">
          {/* Header */}
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              App Permissions
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mobile-subtext leading-relaxed">
              To provide the best experience, MOOD MATE needs some permissions. Don't worry - your privacy is our priority!
            </p>
          </div>

          {/* Permission Cards */}
          <div className="space-y-4">
            {/* Microphone - Mandatory */}
            <Card className="mobile-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <Mic className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-white mobile-text">
                      Microphone
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Required for voice journal entries
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="destructive" className="text-xs">Required</Badge>
                  {getPermissionIcon(permissions.microphone)}
                </div>
              </div>
            </Card>

            {/* Notifications - Optional */}
            <Card className="mobile-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-white mobile-text">
                      Notifications
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Gentle reminders for check-ins
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">Optional</Badge>
                  {getPermissionIcon(permissions.notifications)}
                </div>
              </div>
            </Card>

            {/* Storage - Always Granted */}
            <Card className="mobile-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-white mobile-text">
                      Local Storage
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Save your data locally & securely
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="default" className="text-xs">Auto</Badge>
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              </div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button 
              onClick={requestAllPermissions}
              className="w-full mobile-button touch-target"
              size="lg"
              disabled={isChecking}
            >
              {isChecking ? 'Requesting Permissions...' : 'Grant Permissions'}
            </Button>
            
            {onSkip && (
              <Button 
                variant="outline" 
                onClick={onSkip}
                className="w-full mobile-button touch-target"
                size="lg"
              >
                Skip for Now
              </Button>
            )}
          </div>

          {/* Privacy Note */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              🔒 All data stays on your device. We never access or store your personal information.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 'requesting') {
    return (
      <div className="mobile-container keyboard-aware-container bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="flex flex-col h-full justify-center items-center space-y-6 max-w-md mx-auto">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center animate-pulse">
            <Shield className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Requesting Permissions
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mobile-subtext">
              Please allow permissions in the browser dialogs...
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Completed step
  return (
    <div className="mobile-container keyboard-aware-container bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
      <div className="flex flex-col h-full justify-center space-y-6 max-w-md mx-auto">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            Setup Complete!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mobile-subtext">
            Your permissions have been configured. You can change these anytime in settings.
          </p>
        </div>

        {/* Permission Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Mic className="w-4 h-4" />
              <span className="mobile-text">Microphone</span>
            </div>
            {getPermissionBadge(permissions.microphone)}
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span className="mobile-text">Notifications</span>
            </div>
            {getPermissionBadge(permissions.notifications)}
          </div>
        </div>

        <Button 
          onClick={onComplete}
          className="w-full mobile-button touch-target"
          size="lg"
        >
          Continue to App
        </Button>
      </div>
    </div>
  )
}