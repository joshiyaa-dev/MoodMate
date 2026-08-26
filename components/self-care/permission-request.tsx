"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Mic, FileText, Check, X } from "lucide-react"
import { requestNotificationPermission, requestMicrophonePermission, requestStoragePermission } from "@/lib/permissions"

interface PermissionRequestProps {
  onPermissionsGranted: () => void
}

export default function PermissionRequest({ onPermissionsGranted }: PermissionRequestProps) {
  const [permissions, setPermissions] = useState({
    notifications: false,
    microphone: false,
    files: false
  })
  const [requesting, setRequesting] = useState(false)

  const requestPermissions = async () => {
    setRequesting(true)
    
    try {
      const notificationResult = await requestNotificationPermission()
      const microphoneResult = await requestMicrophonePermission()
      const storageResult = await requestStoragePermission()
      
      const results = {
        notifications: notificationResult.granted,
        microphone: microphoneResult.granted,
        files: storageResult.granted
      }
      
      setPermissions(results)
      
      if (results.notifications && results.microphone && results.files) {
        onPermissionsGranted()
      }
    } catch (error) {
      console.error('Error requesting permissions:', error)
    }
    
    setRequesting(false)
  }

  const allGranted = permissions.notifications && permissions.microphone && permissions.files

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="mobile-heading text-gray-800 dark:text-gray-100 mb-2">App Permissions</h3>
        <p className="mobile-text text-gray-600 dark:text-gray-300">Enable features for the best experience</p>
      </div>

      <Card className="mobile-card bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="space-y-4">
          {/* Notifications */}
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-semibold text-sm">Notifications</div>
                <div className="text-xs text-gray-600">Meditation reminders & progress alerts</div>
              </div>
            </div>
            {permissions.notifications ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <X className="w-5 h-5 text-gray-400" />
            )}
          </div>

          {/* Microphone */}
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div className="flex items-center space-x-3">
              <Mic className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-semibold text-sm">Microphone</div>
                <div className="text-xs text-gray-600">Voice-guided exercises, tone matching & journal entries</div>
              </div>
            </div>
            {permissions.microphone ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <X className="w-5 h-5 text-gray-400" />
            )}
          </div>

          {/* Files */}
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-purple-600" />
              <div>
                <div className="font-semibold text-sm">File Access</div>
                <div className="text-xs text-gray-600">Save artwork & export progress</div>
              </div>
            </div>
            {permissions.files ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <X className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Button 
            onClick={requestPermissions}
            disabled={requesting || allGranted}
            className="mobile-button touch-target w-full bg-blue-500 hover:bg-blue-600"
          >
            {requesting ? 'Requesting...' : allGranted ? 'All Permissions Granted!' : 'Grant Permissions'}
          </Button>

          {allGranted && (
            <Button 
              onClick={onPermissionsGranted}
              className="mobile-button touch-target w-full bg-green-500 hover:bg-green-600"
            >
              Continue to Self-Care Tools
            </Button>
          )}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="mobile-subtext text-blue-800 text-center">
            <strong>🔒 Privacy:</strong> Permissions are used only for app features. No data is shared externally.
          </p>
        </div>
      </Card>
    </div>
  )
}