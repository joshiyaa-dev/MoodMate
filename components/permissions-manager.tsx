"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic, Bell, FileText, Check, X, AlertCircle } from "lucide-react"

interface PermissionsManagerProps {
  onPermissionsGranted?: () => void
}

interface PermissionStatus {
  microphone: 'granted' | 'denied' | 'prompt' | 'unknown'
  notifications: 'granted' | 'denied' | 'default' | 'unknown'
  files: 'granted' | 'denied' | 'unknown'
}

export default function PermissionsManager({ onPermissionsGranted }: PermissionsManagerProps) {
  const [permissions, setPermissions] = useState<PermissionStatus>({
    microphone: 'unknown',
    notifications: 'unknown',
    files: 'unknown'
  })
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    checkPermissions()
  }, [])

  const checkPermissions = async () => {
    setIsChecking(true)
    
    try {
      // Check microphone permission
      let micStatus: PermissionStatus['microphone'] = 'unknown'
      if (navigator.permissions) {
        try {
          const micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName })
          micStatus = micPermission.state as PermissionStatus['microphone']
        } catch (error) {
          console.log('Microphone permission check not supported')
          micStatus = 'unknown'
        }
      }

      // Check notification permission
      let notificationStatus: PermissionStatus['notifications'] = 'unknown'
      if ('Notification' in window) {
        notificationStatus = Notification.permission as PermissionStatus['notifications']
      }

      // File permission is generally granted by default in browsers
      let fileStatus: PermissionStatus['files'] = 'granted'

      setPermissions({
        microphone: micStatus,
        notifications: notificationStatus,
        files: fileStatus
      })
    } catch (error) {
      console.error('Error checking permissions:', error)
    } finally {
      setIsChecking(false)
    }
  }

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop()) // Stop the stream immediately
      setPermissions(prev => ({ ...prev, microphone: 'granted' }))
    } catch (error) {
      console.error('Microphone permission denied:', error)
      setPermissions(prev => ({ ...prev, microphone: 'denied' }))
    }
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission()
        setPermissions(prev => ({ ...prev, notifications: permission as PermissionStatus['notifications'] }))
        
        // Show a test notification if granted
        if (permission === 'granted') {
          new Notification('MOOD MATE', {
            body: 'Notifications are now enabled! We\'ll send you gentle reminders for your mental health journey.',
            icon: '/mood-mate-logo.svg'
          })
        }
      } catch (error) {
        console.error('Notification permission error:', error)
      }
    }
  }

  const requestFilePermission = async () => {
    try {
      // Test file access by creating a temporary file picker
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json,.txt'
      input.style.display = 'none'
      
      input.onchange = () => {
        setPermissions(prev => ({ ...prev, files: 'granted' }))
        document.body.removeChild(input)
      }
      
      input.oncancel = () => {
        document.body.removeChild(input)
      }
      
      document.body.appendChild(input)
      input.click()
    } catch (error) {
      console.error('File permission error:', error)
      setPermissions(prev => ({ ...prev, files: 'denied' }))
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'granted':
        return <Check className="w-5 h-5 text-green-500" />
      case 'denied':
        return <X className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'granted':
        return 'Granted'
      case 'denied':
        return 'Denied'
      case 'default':
        return 'Not requested'
      case 'prompt':
        return 'Prompt'
      default:
        return 'Unknown'
    }
  }

  const allPermissionsGranted = permissions.microphone === 'granted' && 
                                permissions.notifications === 'granted' && 
                                permissions.files === 'granted'

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4">
      <Card className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">App Permissions</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            MOOD MATE needs these permissions to provide the best experience
          </p>
        </div>

        <div className="space-y-4">
          {/* Microphone Permission */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <Mic className="w-6 h-6 text-blue-500" />
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white">Microphone</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">For voice recording features</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(permissions.microphone)}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {getStatusText(permissions.microphone)}
              </span>
              {permissions.microphone !== 'granted' && (
                <Button size="sm" onClick={requestMicrophonePermission}>
                  Grant
                </Button>
              )}
            </div>
          </div>

          {/* Notification Permission */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="w-6 h-6 text-green-500" />
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white">Notifications</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">For mood reminders and alerts</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(permissions.notifications)}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {getStatusText(permissions.notifications)}
              </span>
              {permissions.notifications !== 'granted' && (
                <Button size="sm" onClick={requestNotificationPermission}>
                  Grant
                </Button>
              )}
            </div>
          </div>

          {/* File Permission */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-purple-500" />
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white">File Access</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">For data import/export</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(permissions.files)}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {getStatusText(permissions.files)}
              </span>
              {permissions.files !== 'granted' && (
                <Button size="sm" onClick={requestFilePermission}>
                  Test
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <Button variant="outline" onClick={checkPermissions} disabled={isChecking}>
            {isChecking ? 'Checking...' : 'Refresh Status'}
          </Button>
          
          {allPermissionsGranted && onPermissionsGranted && (
            <Button onClick={onPermissionsGranted} className="bg-green-500 hover:bg-green-600">
              Continue
            </Button>
          )}
        </div>

        {allPermissionsGranted && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <p className="text-sm text-green-700 dark:text-green-300">
              ✅ All permissions granted! You're ready to use MOOD MATE.
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}