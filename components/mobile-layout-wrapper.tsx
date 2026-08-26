"use client"

import { useEffect } from 'react'
import { StatusBarUtils } from '@/lib/status-bar-utils'

interface MobileLayoutWrapperProps {
  children: React.ReactNode
}

/**
 * Layout wrapper that handles mobile-specific initialization
 * including status bar setup and safe area handling
 */
export default function MobileLayoutWrapper({ children }: MobileLayoutWrapperProps) {
  useEffect(() => {
    const initializeMobileLayout = async () => {
      try {
        // Initialize status bar with proper height detection
        await StatusBarUtils.initialize()
        
        // Apply safe area classes to body
        StatusBarUtils.applySafeAreaClasses()
        
        // Add mobile-ready class to body
        if (typeof document !== 'undefined') {
          document.body.classList.add('mobile-ready')
        }
        
        console.log('Mobile layout initialized successfully')
      } catch (error) {
        console.error('Failed to initialize mobile layout:', error)
        
        // Fallback initialization
        if (typeof document !== 'undefined') {
          document.documentElement.style.setProperty('--status-bar-height', '24px')
          document.body.classList.add('mobile-ready', 'status-bar-aware')
        }
      }
    }

    // Run initialization
    initializeMobileLayout()

    // Cleanup function
    return () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('mobile-ready', 'status-bar-aware')
      }
    }
  }, [])

  return (
    <div className="mobile-app-container">
      {children}
    </div>
  )
}