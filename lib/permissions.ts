import { Capacitor } from '@capacitor/core'

// Permission types
export type PermissionType = 'microphone' | 'notifications' | 'storage' | 'camera'

export interface PermissionResult {
  granted: boolean
  message: string
}

// Check if we're running on a native platform
const isNative = () => Capacitor.isNativePlatform()

// Request microphone permission
export async function requestMicrophonePermission(): Promise<PermissionResult> {
  if (!isNative()) {
    // Web platform - use browser API
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop()) // Stop the stream immediately
      return { granted: true, message: 'Microphone permission granted' }
    } catch (error) {
      return { granted: false, message: 'Microphone permission denied. Please allow microphone access in your browser settings.' }
    }
  }

  // Native platform - permissions are handled by the system
  // We'll simulate the permission request for now
  try {
    // On native platforms, permissions are typically requested when the feature is first used
    // For now, we'll return true and let the actual microphone usage trigger the system permission
    return { granted: true, message: 'Microphone permission will be requested when recording starts' }
  } catch (error) {
    console.error('Microphone permission error:', error)
    return { granted: false, message: 'Error requesting microphone permission' }
  }
}

// Request notification permission
export async function requestNotificationPermission(): Promise<PermissionResult> {
  if (!isNative()) {
    // Web platform
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission()
        return {
          granted: permission === 'granted',
          message: permission === 'granted' ? 'Notification permission granted' : 'Notification permission denied. Please enable notifications in your browser settings.'
        }
      }
      return { granted: false, message: 'Notifications not supported in this browser' }
    } catch (error) {
      return { granted: false, message: 'Error requesting notification permission' }
    }
  }

  // Native platform
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications')
    
    const permission = await LocalNotifications.checkPermissions()
    
    if (permission.display === 'granted') {
      return { granted: true, message: 'Notification permission already granted' }
    }

    const result = await LocalNotifications.requestPermissions()
    
    return {
      granted: result.display === 'granted',
      message: result.display === 'granted' ? 'Notification permission granted' : 'Notification permission denied. Please enable notifications in your device settings.'
    }
  } catch (error) {
    console.error('Notification permission error:', error)
    return { granted: false, message: 'Error requesting notification permission' }
  }
}

// Request storage permission
export async function requestStoragePermission(): Promise<PermissionResult> {
  if (!isNative()) {
    // Web platform - storage is generally available
    return { granted: true, message: 'Storage permission granted (web storage available)' }
  }

  // Native platform
  try {
    const { Filesystem } = await import('@capacitor/filesystem')
    
    // Try to write a test file to check permissions
    try {
      const { Directory } = await import('@capacitor/filesystem')
      
      await Filesystem.writeFile({
        path: 'test-permission.txt',
        data: 'test',
        directory: Directory.Documents
      })
      
      // Clean up test file
      await Filesystem.deleteFile({
        path: 'test-permission.txt',
        directory: Directory.Documents
      })
      
      return { granted: true, message: 'Storage permission granted' }
    } catch (error) {
      return { granted: false, message: 'Storage permission denied. Please enable file access in your device settings.' }
    }
  } catch (error) {
    console.error('Storage permission error:', error)
    return { granted: false, message: 'Error requesting storage permission' }
  }
}

// Request camera permission
export async function requestCameraPermission(): Promise<PermissionResult> {
  if (!isNative()) {
    // Web platform
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach(track => track.stop())
      return { granted: true, message: 'Camera permission granted' }
    } catch (error) {
      return { granted: false, message: 'Camera permission denied. Please allow camera access in your browser settings.' }
    }
  }

  // Native platform - permissions are handled by the system
  try {
    // On native platforms, camera permissions are typically requested when the camera is first used
    return { granted: true, message: 'Camera permission will be requested when camera is accessed' }
  } catch (error) {
    console.error('Camera permission error:', error)
    return { granted: false, message: 'Error requesting camera permission' }
  }
}

// Request all permissions at once
export async function requestAllPermissions(): Promise<Record<PermissionType, PermissionResult>> {
  const results = await Promise.allSettled([
    requestMicrophonePermission(),
    requestNotificationPermission(),
    requestStoragePermission(),
    requestCameraPermission()
  ])

  return {
    microphone: results[0].status === 'fulfilled' ? results[0].value : { granted: false, message: 'Failed to request microphone permission' },
    notifications: results[1].status === 'fulfilled' ? results[1].value : { granted: false, message: 'Failed to request notification permission' },
    storage: results[2].status === 'fulfilled' ? results[2].value : { granted: false, message: 'Failed to request storage permission' },
    camera: results[3].status === 'fulfilled' ? results[3].value : { granted: false, message: 'Failed to request camera permission' }
  }
}

// Check permission status without requesting
export async function checkPermissionStatus(type: PermissionType): Promise<boolean> {
  if (!isNative()) {
    // Web platform checks
    switch (type) {
      case 'microphone':
        try {
          const result = await navigator.permissions.query({ name: 'microphone' as PermissionName })
          return result.state === 'granted'
        } catch {
          return false
        }
      case 'notifications':
        return 'Notification' in window && Notification.permission === 'granted'
      case 'storage':
        return true // Generally available on web
      case 'camera':
        try {
          const result = await navigator.permissions.query({ name: 'camera' as PermissionName })
          return result.state === 'granted'
        } catch {
          return false
        }
      default:
        return false
    }
  }

  // Native platform
  try {
    switch (type) {
      case 'microphone':
        // Will be checked when actually used
        return true
      case 'notifications':
        const { LocalNotifications } = await import('@capacitor/local-notifications')
        const notifPermission = await LocalNotifications.checkPermissions()
        return notifPermission.display === 'granted'
      case 'storage':
        // Will be checked when actually used
        return true
      case 'camera':
        // Will be checked when actually used
        return true
      default:
        return false
    }
  } catch (error) {
    console.error(`Error checking ${type} permission:`, error)
    return false
  }
}