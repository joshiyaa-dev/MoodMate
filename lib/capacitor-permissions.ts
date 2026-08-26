"use client"

import { Capacitor } from '@capacitor/core'
import { Camera } from '@capacitor/camera'
import { Device } from '@capacitor/device'
import { LocalNotifications } from '@capacitor/local-notifications'

export interface CapacitorPermissionResults {
  microphone: 'granted' | 'denied' | 'prompt'
  notifications: 'granted' | 'denied' | 'prompt'
  camera: 'granted' | 'denied' | 'prompt'
  files: 'granted' | 'denied' | 'prompt'
}

/**
 * Enhanced permission manager using Capacitor's native APIs
 */
export class CapacitorPermissions {
  
  /**
   * Check all permissions status
   */
  static async checkAllPermissions(): Promise<CapacitorPermissionResults> {
    const results: CapacitorPermissionResults = {
      microphone: 'prompt',
      notifications: 'prompt', 
      camera: 'prompt',
      files: 'prompt'
    }

    if (!Capacitor.isNativePlatform()) {
      // Web fallback
      return this.checkWebPermissions()
    }

    try {
      // Check microphone permission
      results.microphone = await this.checkMicrophonePermission()
      
      // Check notification permission
      results.notifications = await this.checkNotificationPermission()
      
      // Check camera permission
      results.camera = await this.checkCameraPermission()
      
      // Files are generally accessible on mobile
      results.files = 'granted'
      
    } catch (error) {
      console.error('Error checking permissions:', error)
    }

    return results
  }

  /**
   * Request microphone permission
   */
  static async requestMicrophonePermission(): Promise<'granted' | 'denied'> {
    if (!Capacitor.isNativePlatform()) {
      // Web fallback
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100
          }
        })
        stream.getTracks().forEach(track => track.stop())
        return 'granted'
      } catch {
        return 'denied'
      }
    }

    try {
      const deviceInfo = await Device.getInfo()
      
      if (deviceInfo.platform === 'android') {
        // Android: Use generic permission request
        const permission = await this.requestAndroidPermission('android.permission.RECORD_AUDIO')
        return permission
      } else if (deviceInfo.platform === 'ios') {
        // iOS: Test microphone access
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
          stream.getTracks().forEach(track => track.stop())
          return 'granted'
        } catch {
          return 'denied'  
        }
      }
    } catch (error) {
      console.error('Microphone permission request failed:', error)
    }

    return 'denied'
  }

  /**
   * Request notification permission
   */
  static async requestNotificationPermission(): Promise<'granted' | 'denied'> {
    try {
      const permission = await LocalNotifications.requestPermissions()
      
      if (permission.display === 'granted') {
        // Schedule a welcome notification
        await LocalNotifications.schedule({
          notifications: [{
            title: 'Welcome to MOOD MATE! 🧠',
            body: 'You\'ll receive gentle reminders to help maintain your mental wellness routine.',
            id: 1,
            schedule: { at: new Date(Date.now() + 2000) }, // 2 seconds from now
            sound: 'beep.wav',
            attachments: undefined,
            actionTypeId: '',
            extra: { welcome: true }
          }]
        })
        
        return 'granted'
      }
      
      return 'denied'
    } catch (error) {
      console.error('Notification permission request failed:', error)
      return 'denied'
    }
  }

  /**
   * Request camera permission
   */
  static async requestCameraPermission(): Promise<'granted' | 'denied'> {
    try {
      const permission = await Camera.requestPermissions({ permissions: ['camera'] })
      return permission.camera === 'granted' ? 'granted' : 'denied'
    } catch (error) {
      console.error('Camera permission request failed:', error)
      return 'denied'
    }
  }

  /**
   * Request file access permission
   */
  static async requestFilePermission(): Promise<'granted' | 'denied'> {
    // On mobile, file access is generally available through file pickers
    // This is mainly for user consent and explaining what we'll do with files
    try {
      if (Capacitor.isNativePlatform()) {
        // On native platforms, file access through Capacitor is available
        return 'granted'
      } else {
        // Web: Test file picker availability
        if ('showOpenFilePicker' in window) {
          return 'granted'
        } else {
          // Fallback file input test
          return new Promise((resolve) => {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = '.json,.txt,.png,.jpg'
            input.style.display = 'none'
            
            input.onchange = () => {
              document.body.removeChild(input)
              resolve('granted')
            }
            
            input.oncancel = () => {
              if (document.body.contains(input)) {
                document.body.removeChild(input)
              }
              resolve('denied')
            }
            
            // Auto-cancel after 8 seconds
            setTimeout(() => {
              if (document.body.contains(input)) {
                document.body.removeChild(input)
                resolve('denied')
              }
            }, 8000)
            
            document.body.appendChild(input)
            input.click()
          })
        }
      }
    } catch (error) {
      console.error('File permission request failed:', error)
      return 'denied'
    }
  }

  /**
   * Check microphone permission status
   */
  private static async checkMicrophonePermission(): Promise<'granted' | 'denied' | 'prompt'> {
    if (!Capacitor.isNativePlatform()) {
      // Web permissions API
      try {
        if ('permissions' in navigator) {
          const result = await navigator.permissions.query({ name: 'microphone' as PermissionName })
          return result.state as any
        }
      } catch {
        // Permission API not supported
      }
      return 'prompt'
    }

    // For native platforms, we'll need to test access or use platform-specific checks
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false
      })
      stream.getTracks().forEach(track => track.stop())
      return 'granted'
    } catch (error: any) {
      if (error.name === 'NotAllowedError') {
        return 'denied'  
      }
      return 'prompt'
    }
  }

  /**
   * Check notification permission status
   */
  private static async checkNotificationPermission(): Promise<'granted' | 'denied' | 'prompt'> {
    try {
      const permission = await LocalNotifications.checkPermissions()
      
      if (permission.display === 'granted') {
        return 'granted'
      } else if (permission.display === 'denied') {
        return 'denied'
      }
      
      return 'prompt'
    } catch (error) {
      console.error('Error checking notification permission:', error)
      return 'prompt'
    }
  }

  /**
   * Check camera permission status
   */
  private static async checkCameraPermission(): Promise<'granted' | 'denied' | 'prompt'> {
    try {
      const permission = await Camera.checkPermissions()
      
      if (permission.camera === 'granted') {
        return 'granted'
      } else if (permission.camera === 'denied') {
        return 'denied'
      }
      
      return 'prompt'
    } catch (error) {
      console.error('Error checking camera permission:', error)
      return 'prompt'
    }
  }

  /**
   * Generic Android permission request
   */
  private static async requestAndroidPermission(permission: string): Promise<'granted' | 'denied'> {
    try {
      // This would typically use a Capacitor plugin for Android permissions
      // For now, we'll use the web API as fallback
      return await this.requestMicrophoneWebFallback()
    } catch (error) {
      console.error('Android permission request failed:', error)
      return 'denied'
    }
  }

  /**
   * Web fallback for microphone permission
   */
  private static async requestMicrophoneWebFallback(): Promise<'granted' | 'denied'> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      })
      
      // Test the stream briefly then stop
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop())
      }, 100)
      
      return 'granted'
    } catch (error) {
      console.error('Microphone web fallback failed:', error)
      return 'denied'
    }
  }

  /**
   * Web permissions fallback
   */
  private static async checkWebPermissions(): Promise<CapacitorPermissionResults> {
    const results: CapacitorPermissionResults = {
      microphone: 'prompt',
      notifications: 'prompt',
      camera: 'prompt', 
      files: 'granted' // Files are accessible via file input on web
    }

    try {
      // Check microphone
      if ('permissions' in navigator) {
        try {
          const micResult = await navigator.permissions.query({ name: 'microphone' as PermissionName })
          results.microphone = micResult.state as any
        } catch {
          // Microphone permission check not supported
        }
      }

      // Check notifications
      if ('Notification' in window) {
        results.notifications = Notification.permission as any
      }

      // Check camera
      if ('permissions' in navigator) {
        try {
          const cameraResult = await navigator.permissions.query({ name: 'camera' as PermissionName })
          results.camera = cameraResult.state as any
        } catch {
          // Camera permission check not supported
        }
      }
    } catch (error) {
      console.error('Error checking web permissions:', error)
    }

    return results
  }
}