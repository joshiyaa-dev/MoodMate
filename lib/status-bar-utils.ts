"use client"

import { StatusBar, Style } from '@capacitor/status-bar'
import { Capacitor } from '@capacitor/core'

/**
 * Status bar utility functions for mobile app
 */
export class StatusBarUtils {
  private static statusBarHeight: number = 24

  /**
   * Initialize status bar handling
   */
  static async initialize(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      // Web platform - use default fallback
      this.setStatusBarHeight(0)
      return
    }

    try {
      // Get status bar info
      const info = await StatusBar.getInfo()
      
      // StatusBar.getInfo() returns { visible: boolean } but not height
      // We need to use platform-specific fallbacks for height
      const platform = Capacitor.getPlatform()
      if (platform === 'ios') {
        this.statusBarHeight = info.visible ? 44 : 0
      } else if (platform === 'android') {
        this.statusBarHeight = info.visible ? 24 : 0
      } else {
        this.statusBarHeight = 0 // Web platform
      }
      
      // Set CSS custom property for dynamic height
      this.setStatusBarHeight(this.statusBarHeight)
      
      // Configure status bar appearance
      await StatusBar.setStyle({ 
        style: Style.Light
      })
      
      if (platform === 'android') {
        await StatusBar.setBackgroundColor({ color: '#3B82F6' })
      }

      console.log(`Status bar initialized: platform=${platform}, visible=${info.visible}, height=${this.statusBarHeight}px`)
    } catch (error) {
      console.warn('Status bar initialization failed:', error)
      // Fallback to platform defaults
      const platform = Capacitor.getPlatform()
      const fallbackHeight = platform === 'ios' ? 44 : platform === 'android' ? 24 : 0
      this.setStatusBarHeight(fallbackHeight)
    }
  }

  /**
   * Set status bar height in CSS custom property
   */
  private static setStatusBarHeight(height: number): void {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--status-bar-height', `${height}px`)
      this.statusBarHeight = height
    }
  }

  /**
   * Get current status bar height
   */
  static getHeight(): number {
    return this.statusBarHeight
  }

  /**
   * Show status bar
   */
  static async show(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        await StatusBar.show()
      } catch (error) {
        console.warn('Failed to show status bar:', error)
      }
    }
  }

  /**
   * Hide status bar
   */
  static async hide(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        await StatusBar.hide()
      } catch (error) {
        console.warn('Failed to hide status bar:', error)
      }
    }
  }

  /**
   * Set status bar overlay mode
   */
  static async setOverlay(overlay: boolean): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        await StatusBar.setOverlaysWebView({ overlay })
        
        // Adjust CSS accordingly
        if (overlay) {
          const info = await StatusBar.getInfo()
          const platform = Capacitor.getPlatform()
          let height = 0
          
          if (info.visible) {
            height = platform === 'ios' ? 44 : 24
          }
          
          this.setStatusBarHeight(height)
        } else {
          this.setStatusBarHeight(0)
        }
      } catch (error) {
        console.warn('Failed to set status bar overlay:', error)
      }
    }
  }

  /**
   * Apply safe area classes to body for consistent spacing
   */
  static applySafeAreaClasses(): void {
    if (typeof document !== 'undefined') {
      const body = document.body
      
      // Add status bar safe class
      body.classList.add('status-bar-aware')
      
      // Add platform-specific classes
      if (Capacitor.getPlatform() === 'ios') {
        body.classList.add('platform-ios')
      } else if (Capacitor.getPlatform() === 'android') {
        body.classList.add('platform-android')
      } else {
        body.classList.add('platform-web')
      }
    }
  }
}

/**
 * React hook for status bar utilities
 */
export function useStatusBar() {
  const initialize = async () => {
    await StatusBarUtils.initialize()
    StatusBarUtils.applySafeAreaClasses()
  }

  const getHeight = () => StatusBarUtils.getHeight()
  
  const show = () => StatusBarUtils.show()
  
  const hide = () => StatusBarUtils.hide()
  
  const setOverlay = (overlay: boolean) => StatusBarUtils.setOverlay(overlay)

  return {
    initialize,
    getHeight,
    show,
    hide,
    setOverlay
  }
}