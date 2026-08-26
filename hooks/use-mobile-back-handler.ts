"use client"

import { useEffect, useRef } from 'react'

interface BackHandlerOptions {
  onBack: () => boolean // Return true to prevent default back action
  enabled?: boolean
  isHomeScreen?: boolean // Special handling for home screen
}

export function useMobileBackHandler({ onBack, enabled = true, isHomeScreen = false }: BackHandlerOptions) {
  const backPressCount = useRef(0)
  const backPressTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!enabled) return

    const handleBackButton = (event: PopStateEvent) => {
      event.preventDefault()
      
      const shouldPreventDefault = onBack()
      
      if (!shouldPreventDefault) {
        // If we're at the home screen, require double tap with confirmation to exit
        if (isHomeScreen) {
          backPressCount.current += 1
          
          if (backPressCount.current === 1) {
            // Show confirmation message
            if (typeof window !== 'undefined' && 'Capacitor' in window) {
              // For Capacitor apps, show native toast
              import('@capacitor/toast').then(({ Toast }) => {
                Toast.show({
                  text: 'Press back again to exit MOOD MATE',
                  duration: 'long',
                  position: 'bottom'
                })
              }).catch(() => {
                // Fallback for web - create custom toast
                showWebToast('Press back again to exit MOOD MATE')
              })
            } else {
              // Web fallback
              showWebToast('Press back again to exit MOOD MATE')
            }
            
            // Reset counter after 3 seconds
            backPressTimer.current = setTimeout(() => {
              backPressCount.current = 0
            }, 3000)
          } else {
            // Second press - show exit confirmation
            if (typeof window !== 'undefined' && 'Capacitor' in window) {
              // For Capacitor, show confirmation dialog
              import('@capacitor/app').then(({ App }) => {
                // Show confirmation dialog
                const confirmed = confirm('Are you sure you want to exit MOOD MATE?')
                if (confirmed) {
                  App.exitApp()
                }
              }).catch(() => {
                // Fallback for web
                const confirmed = confirm('Are you sure you want to exit MOOD MATE?')
                if (confirmed) {
                  try {
                    window.close()
                  } catch {
                    window.location.href = 'about:blank'
                  }
                }
              })
            } else {
              // Web confirmation
              const confirmed = confirm('Are you sure you want to exit MOOD MATE?')
              if (confirmed) {
                try {
                  window.close()
                } catch {
                  window.location.href = 'about:blank'
                }
              }
            }
            // Reset counter after confirmation
            backPressCount.current = 0
          }
        } else {
          // For non-home screens, just execute the onBack function
          // This should have been handled by returning true from onBack
          console.log('Back button pressed on non-home screen')
        }
      }
    }

    // Add state to history to handle back button
    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', handleBackButton)

    return () => {
      window.removeEventListener('popstate', handleBackButton)
      if (backPressTimer.current) {
        clearTimeout(backPressTimer.current)
      }
    }
  }, [onBack, enabled, isHomeScreen])

  // Reset back press count when component unmounts or changes
  useEffect(() => {
    return () => {
      backPressCount.current = 0
      if (backPressTimer.current) {
        clearTimeout(backPressTimer.current)
      }
    }
  }, [])
}

// Web toast fallback function
function showWebToast(message: string) {
  // Create toast element
  const toast = document.createElement('div')
  toast.textContent = message
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 10000;
    animation: fadeInOut 3s ease-in-out;
  `
  
  // Add animation styles
  const style = document.createElement('style')
  style.textContent = `
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
      10% { opacity: 1; transform: translateX(-50%) translateY(0); }
      90% { opacity: 1; transform: translateX(-50%) translateY(0); }
      100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
  `
  document.head.appendChild(style)
  
  // Add to DOM and remove after animation
  document.body.appendChild(toast)
  setTimeout(() => {
    document.body.removeChild(toast)
    document.head.removeChild(style)
  }, 3000)
}