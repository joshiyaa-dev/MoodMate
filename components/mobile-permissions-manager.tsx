"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mic, Bell, Save, Camera, Shield, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { 
  requestMicrophonePermission, 
  requestNotificationPermission, 
  requestStoragePermission, 
  requestCameraPermission,
  checkPermissionStatus,
  type PermissionType,
  type PermissionResult 
} from "@/lib/permissions"
import { addNotification } from "@/components/notification-system"

interface MobilePermissionsManagerProps {
  onBack: () => void
}

interface PermissionStatus {
  granted: boolean
  message: string
  loading: boolean
}

export default function MobilePermissionsManager({ onBack }: MobilePermissionsManagerProps) {
  const [permissions, setPermissions] = useState<Record<PermissionType, PermissionStatus>>({
    microphone: { granted: false, message: 'Not checked', loading: false },
    notifications: { granted: false, message: 'Not checked', loading: false },
    storage: { granted: false, message: 'Not checked', loading: false },
    camera: { granted: false, message: 'Not checked', loading: false }
  })

  useEffect(() => {
    checkAllPermissions()
  }, [])

  const checkAllPermissions = async () => {
    const types: PermissionType[] = ['microphone', 'notifications', 'storage', 'camera']
    
    for (const type of types) {
      try {
        const granted = await checkPermissionStatus(type)
        setPermissions(prev => ({
          ...prev,
          [type]: {
            granted,
            message: granted ? 'Permission granted' : 'Permission not granted',
            loading: false
          }
        }))
      } catch (error) {
        setPermissions(prev => ({
          ...prev,
          [type]: {
            granted: false,
            message: 'Error checking permission',
            loading: false
          }
        }))
      }
    }
  }

  const requestPermission = async (type: PermissionType) => {
    setPermissions(prev => ({
      ...prev,
      [type]: { ...prev[type], loading: true }
    }))

    let result: PermissionResult

    try {
      switch (type) {
        case 'microphone':
          result = await requestMicrophonePermission()
          break
        case 'notifications':
          result = await requestNotificationPermission()
          break
        case 'storage':
          result = await requestStoragePermission()
          break
        case 'camera':
          result = await requestCameraPermission()
          break
        default:
          result = { granted: false, message: 'Unknown permission type' }
      }

      setPermissions(prev => ({
        ...prev,
        [type]: {
          granted: result.granted,
          message: result.message,
          loading: false
        }
      }))

      // Add notification about permission result
      addNotification({
        type: 'selfcare',
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Permission`,
        message: result.message,
        data: { permission: type, granted: result.granted }
      })

    } catch (error) {
      setPermissions(prev => ({
        ...prev,
        [type]: {
          granted: false,
          message: 'Error requesting permission',
          loading: false
        }
      }))
    }
  }

  const getPermissionIcon = (type: PermissionType) => {
    const icons = {
      microphone: <Mic className="w-5 h-5" />,
      notifications: <Bell className="w-5 h-5" />,
      storage: <Save className="w-5 h-5" />,
      camera: <Camera className="w-5 h-5" />
    }
    return icons[type]
  }

  const getPermissionDescription = (type: PermissionType) => {
    const descriptions = {
      microphone: 'Required for voice journaling and audio recording features',
      notifications: 'Required for mood reminders and wellness notifications',
      storage: 'Required for saving journal entries and mood data',
      camera: 'Required for photo journaling and mood visualization'
    }
    return descriptions[type]
  }

  const getPermissionTitle = (type: PermissionType) => {
    const titles = {
      microphone: 'Microphone Access',
      notifications: 'Notifications',
      storage: 'File Storage',
      camera: 'Camera Access'
    }
    return titles[type]
  }

  const getStatusIcon = (permission: PermissionStatus) => {
    if (permission.loading) {
      return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    }
    if (permission.granted) {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    }
    return <XCircle className="w-5 h-5 text-red-500" />
  }

  const getStatusBadge = (permission: PermissionStatus) => {
    if (permission.loading) {
      return <Badge variant="secondary">Checking...</Badge>
    }
    if (permission.granted) {
      return <Badge className="bg-green-100 text-green-800">Granted</Badge>
    }
    return <Badge variant="destructive">Denied</Badge>
  }

  const allGranted = Object.values(permissions).every(p => p.granted)

  return (
    <div className="mobile-container min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-md mx-auto pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-2">
          <Button variant="ghost" onClick={onBack} className="touch-manipulation">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="text-center flex-1 mx-2">
            <h1 className="mobile-heading font-bold text-gray-800">App Permissions</h1>
            <p className="mobile-subtext text-gray-600">Manage your privacy settings</p>
          </div>
          <div className="w-8" />
        </div>

        {/* Status Overview */}
        <Card className="mobile-card mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6" />
              <div>
                <h3 className="font-semibold mobile-text">Permission Status</h3>
                <p className="mobile-subtext opacity-90">
                  {Object.values(permissions).filter(p => p.granted).length} of {Object.keys(permissions).length} granted
                </p>
              </div>
            </div>
            {allGranted ? (
              <CheckCircle className="w-8 h-8 text-green-300" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-yellow-300" />
            )}
          </div>
        </Card>

        {/* Permission Cards */}
        <div className="space-y-3">
          {(Object.keys(permissions) as PermissionType[]).map((type) => {
            const permission = permissions[type]
            return (
              <Card key={type} className="mobile-card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                      {getPermissionIcon(type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold mobile-text">{getPermissionTitle(type)}</h4>
                      <p className="mobile-subtext text-gray-600 mt-1">
                        {getPermissionDescription(type)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {getStatusIcon(permission)}
                    {getStatusBadge(permission)}
                  </div>
                </div>

                <div className="mb-3">
                  <p className="mobile-subtext text-gray-600">
                    <strong>Status:</strong> {permission.message}
                  </p>
                </div>

                <Button
                  onClick={() => requestPermission(type)}
                  disabled={permission.loading || permission.granted}
                  className="w-full touch-manipulation"
                  variant={permission.granted ? "outline" : "default"}
                >
                  {permission.loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Requesting...
                    </>
                  ) : permission.granted ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Permission Granted
                    </>
                  ) : (
                    <>
                      {getPermissionIcon(type)}
                      <span className="ml-2">Request Permission</span>
                    </>
                  )}
                </Button>
              </Card>
            )
          })}
        </div>

        {/* Info Card */}
        <Card className="mobile-card mt-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold mobile-text text-yellow-800 mb-1">Why These Permissions?</h4>
              <div className="mobile-subtext text-yellow-700 space-y-1">
                <p>• <strong>Microphone:</strong> Voice journaling and mood recording</p>
                <p>• <strong>Notifications:</strong> Wellness reminders and check-ins</p>
                <p>• <strong>Storage:</strong> Save your journal entries and progress</p>
                <p>• <strong>Camera:</strong> Photo journaling and visual mood tracking</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          <Button
            onClick={checkAllPermissions}
            variant="outline"
            className="w-full touch-manipulation"
          >
            <Shield className="w-4 h-4 mr-2" />
            Refresh Permission Status
          </Button>
          
          {!allGranted && (
            <Card className="mobile-card bg-blue-50 border-blue-200">
              <p className="mobile-subtext text-blue-800 text-center">
                <strong>Note:</strong> Some features may not work properly without the required permissions. 
                You can always change these settings later in your device's app settings.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

// Export permission request functions for use in other components
export {
  requestMicrophonePermission,
  requestNotificationPermission,
  requestStoragePermission,
  requestCameraPermission
}