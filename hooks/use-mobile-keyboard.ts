"use client"

import { useEffect, useState, useCallback } from 'react'

interface KeyboardState {
  isOpen: boolean
  height: number
  isVisible: boolean
}

export function useMobileKeyboard() {
  const [keyboardState, setKeyboardState] = useState<KeyboardState>({
    isOpen: false,
    height: 0,
    isVisible: false
  })

  const [activeInput, setActiveInput] = useState<HTMLElement | null>(null)

  const scrollToInput = useCallback((element: HTMLElement) => {
    if (!element) return

    // Small delay to ensure keyboard is fully open
    setTimeout(() => {
      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const keyboardHeight = keyboardState.height || 300 // Fallback height
      
      // Calculate if input is hidden by keyboard
      const availableHeight = windowHeight - keyboardHeight
      
      if (rect.bottom > availableHeight) {
        const scrollAmount = rect.bottom - availableHeight + 20 // 20px padding
        window.scrollBy({
          top: scrollAmount,
          behavior: 'smooth'
        })
      }
    }, 100)
  }, [keyboardState.height])

  const handleInputFocus = useCallback((event: FocusEvent) => {
    const target = event.target as HTMLElement
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      setActiveInput(target)
      
      // Add focused class for styling
      target.classList.add('mobile-input-focused')
      target.parentElement?.classList.add('input-container', 'focused')
      
      // Scroll to input when keyboard opens
      setTimeout(() => scrollToInput(target), 300)
    }
  }, [scrollToInput])

  const handleInputBlur = useCallback((event: FocusEvent) => {
    const target = event.target as HTMLElement
    if (target) {
      target.classList.remove('mobile-input-focused')
      target.parentElement?.classList.remove('focused')
    }
    setActiveInput(null)
  }, [])

  useEffect(() => {
    let initialViewportHeight = window.innerHeight
    
    const handleResize = () => {
      const currentHeight = window.innerHeight
      const heightDifference = initialViewportHeight - currentHeight
      
      // Keyboard is likely open if height decreased significantly
      const keyboardOpen = heightDifference > 150
      const keyboardHeight = keyboardOpen ? heightDifference : 0
      
      setKeyboardState({
        isOpen: keyboardOpen,
        height: keyboardHeight,
        isVisible: keyboardOpen
      })

      // Update CSS custom property for keyboard height
      document.documentElement.style.setProperty('--keyboard-height', `${keyboardHeight}px`)
      
      // Add/remove keyboard classes to body
      if (keyboardOpen) {
        document.body.classList.add('keyboard-open')
        document.body.classList.add('ios-keyboard-fix')
      } else {
        document.body.classList.remove('keyboard-open')
        document.body.classList.remove('ios-keyboard-fix')
      }

      // Scroll to active input if keyboard opened
      if (keyboardOpen && activeInput) {
        scrollToInput(activeInput)
      }
    }

    const handleVisualViewportChange = () => {
      if ('visualViewport' in window && window.visualViewport) {
        const viewport = window.visualViewport
        const keyboardHeight = window.innerHeight - viewport.height
        const keyboardOpen = keyboardHeight > 150
        
        setKeyboardState({
          isOpen: keyboardOpen,
          height: keyboardHeight,
          isVisible: keyboardOpen
        })

        document.documentElement.style.setProperty('--keyboard-height', `${keyboardHeight}px`)
        
        if (keyboardOpen) {
          document.body.classList.add('keyboard-open')
        } else {
          document.body.classList.remove('keyboard-open')
        }
      }
    }

    // Listen for viewport changes (more reliable on modern mobile browsers)
    if ('visualViewport' in window && window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportChange)
    } else {
      // Fallback to window resize
      window.addEventListener('resize', handleResize)
    }

    // Listen for input focus/blur events
    document.addEventListener('focusin', handleInputFocus)
    document.addEventListener('focusout', handleInputBlur)

    // Store initial height
    initialViewportHeight = window.innerHeight

    return () => {
      if ('visualViewport' in window && window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportChange)
      } else {
        window.removeEventListener('resize', handleResize)
      }
      document.removeEventListener('focusin', handleInputFocus)
      document.removeEventListener('focusout', handleInputBlur)
      
      // Cleanup
      document.body.classList.remove('keyboard-open', 'ios-keyboard-fix')
      document.documentElement.style.removeProperty('--keyboard-height')
    }
  }, [activeInput, handleInputFocus, handleInputBlur, scrollToInput])

  return {
    keyboardState,
    activeInput,
    scrollToInput
  }
}

// Hook for input components to handle mobile keyboard properly
export function useMobileInput() {
  const { keyboardState, scrollToInput } = useMobileKeyboard()

  const createInputProps = useCallback((baseProps: any = {}) => {
    return {
      ...baseProps,
      className: `mobile-input ${baseProps.className || ''}`,
      onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
        baseProps.onFocus?.(e)
        
        // Ensure input is visible
        setTimeout(() => {
          scrollToInput(e.target)
        }, 100)
      },
      onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
        baseProps.onBlur?.(e)
      }
    }
  }, [scrollToInput])

  const createTextareaProps = useCallback((baseProps: any = {}) => {
    return {
      ...baseProps,
      className: `mobile-textarea ${baseProps.className || ''}`,
      onFocus: (e: React.FocusEvent<HTMLTextAreaElement>) => {
        baseProps.onFocus?.(e)
        
        // Ensure textarea is visible
        setTimeout(() => {
          scrollToInput(e.target)
        }, 100)
      },
      onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => {
        baseProps.onBlur?.(e)
      }
    }
  }, [scrollToInput])

  return {
    keyboardState,
    createInputProps,
    createTextareaProps
  }
}