// Universal Mobile Touch & Drag Fix Utility
// Apply this to ALL games and exercises that aren't working

import { useEffect, useRef, useState } from 'react'

export interface TouchPosition {
  x: number
  y: number
}

export interface SwipeDirection {
  direction: 'up' | 'down' | 'left' | 'right' | null
  distance: number
}

// Hook for touch/swipe detection
export function useSwipeDetection(
  onSwipe?: (direction: SwipeDirection) => void,
  minDistance: number = 30
) {
  const [touchStart, setTouchStart] = useState<TouchPosition | null>(null)
  const [touchEnd, setTouchEnd] = useState<TouchPosition | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    setTouchEnd({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    if (!touchStart || !touchEnd) return

    const deltaX = touchEnd.x - touchStart.x
    const deltaY = touchEnd.y - touchStart.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    if (distance < minDistance) return

    let direction: 'up' | 'down' | 'left' | 'right' | null = null

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left'
    } else {
      direction = deltaY > 0 ? 'down' : 'up'
    }

    onSwipe?.({ direction, distance })
    setTouchStart(null)
    setTouchEnd(null)
  }

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    touchStart,
    touchEnd
  }
}

// Hook for drag detection
export function useDragDetection(
  onDrag?: (position: TouchPosition, delta: TouchPosition) => void,
  onDragEnd?: (position: TouchPosition) => void
) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<TouchPosition | null>(null)
  const elementRef = useRef<HTMLElement>(null)

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    setDragStart({ x: clientX, y: clientY })
  }

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || !dragStart) return
    e.preventDefault()
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    const currentPos = { x: clientX, y: clientY }
    const delta = { 
      x: currentPos.x - dragStart.x, 
      y: currentPos.y - dragStart.y 
    }
    
    onDrag?.(currentPos, delta)
  }

  const handleEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY
    
    onDragEnd?.({ x: clientX, y: clientY })
    setIsDragging(false)
    setDragStart(null)
  }

  return {
    isDragging,
    dragHandlers: {
      onTouchStart: handleStart,
      onTouchMove: handleMove,
      onTouchEnd: handleEnd,
      onMouseDown: handleStart,
      onMouseMove: handleMove,
      onMouseUp: handleEnd,
    },
    elementRef
  }
}

// Hook for tap detection (with double-tap support)
export function useTapDetection(
  onTap?: (position: TouchPosition) => void,
  onDoubleTap?: (position: TouchPosition) => void,
  doubleTapDelay: number = 300
) {
  const [lastTap, setLastTap] = useState<number>(0)
  const [tapCount, setTapCount] = useState<number>(0)

  const handleTap = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    const position = { x: clientX, y: clientY }
    
    const now = Date.now()
    
    if (now - lastTap < doubleTapDelay) {
      setTapCount(prev => prev + 1)
      if (tapCount === 0) {
        onDoubleTap?.(position)
        setTapCount(0)
      }
    } else {
      setTapCount(0)
      onTap?.(position)
    }
    
    setLastTap(now)
  }

  return {
    tapHandlers: {
      onTouchEnd: handleTap,
      onClick: handleTap,
    }
  }
}

// Mobile-friendly CSS classes
export const mobileStyles = {
  touchArea: "touch-manipulation select-none",
  preventScroll: "overscroll-none",
  noPointerEvents: "pointer-events-none",
  enablePointerEvents: "pointer-events-auto",
  preventUserSelect: "user-select-none",
  enableUserSelect: "user-select-auto",
}

// Apply to any game/exercise container
export function makeMobileFriendly(element: HTMLElement | null) {
  if (!element) return

  // Prevent default touch behaviors
  element.style.touchAction = 'none'
  element.style.userSelect = 'none'
  ;(element.style as any).webkitUserSelect = 'none'
  ;(element.style as any).webkitTouchCallout = 'none'
  
  // Add passive: false to prevent scrolling during touch
  const preventScroll = (e: Event) => e.preventDefault()
  
  element.addEventListener('touchstart', preventScroll, { passive: false })
  element.addEventListener('touchmove', preventScroll, { passive: false })
  
  return () => {
    element.removeEventListener('touchstart', preventScroll)
    element.removeEventListener('touchmove', preventScroll)
  }
}

// Quick fix component wrapper
interface MobileFriendlyWrapperProps {
  children: React.ReactNode
  className?: string
  onSwipe?: (direction: SwipeDirection) => void
  onDrag?: (position: TouchPosition, delta: TouchPosition) => void
  onTap?: (position: TouchPosition) => void
}

export function MobileFriendlyWrapper({
  children,
  className = "",
  onSwipe,
  onDrag,
  onTap
}: MobileFriendlyWrapperProps) {
  const swipe = useSwipeDetection(onSwipe)
  const drag = useDragDetection(onDrag)
  const tap = useTapDetection(onTap)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return makeMobileFriendly(ref.current)
  }, [])

  return (
    <div
      ref={ref}
      className={`${mobileStyles.touchArea} ${mobileStyles.preventScroll} ${className}`}
      style={{ touchAction: 'none' }}
      {...swipe}
      {...drag.dragHandlers}
      {...tap.tapHandlers}
    >
      {children}
    </div>
  )
}