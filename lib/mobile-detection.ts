"use client"

/**
 * Mobile device detection utilities
 */
export class MobileDetection {
  
  /**
   * Check if the current device is likely a mobile device
   */
  static isMobileDevice(): boolean {
    if (typeof window === 'undefined') return false
    
    // Check screen size first (most reliable)
    const screenWidth = window.screen.width
    const screenHeight = window.screen.height
    const isSmallScreen = Math.min(screenWidth, screenHeight) <= 768
    
    // Check user agent for mobile indicators
    const userAgent = navigator.userAgent.toLowerCase()
    const mobileKeywords = [
      'mobile', 'android', 'iphone', 'ipad', 'ipod', 
      'blackberry', 'windows phone', 'opera mini'
    ]
    
    const hasMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword))
    
    // Check for touch support
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    
    // Check viewport dimensions
    const viewportWidth = window.innerWidth
    const isMobileViewport = viewportWidth <= 768
    
    // Check pixel density (mobile devices often have higher DPR)
    const pixelRatio = window.devicePixelRatio || 1
    const isHighDensity = pixelRatio >= 2
    
    // Combine factors for final decision
    const mobileScore = [
      isSmallScreen,
      hasMobileUA, 
      hasTouch,
      isMobileViewport,
      isHighDensity
    ].filter(Boolean).length
    
    // Consider it mobile if 3 or more factors are true
    return mobileScore >= 3
  }
  
  /**
   * Check if device is specifically a tablet
   */
  static isTablet(): boolean {
    if (typeof window === 'undefined') return false
    
    const userAgent = navigator.userAgent.toLowerCase()
    const screenWidth = window.screen.width
    const screenHeight = window.screen.height
    const maxDimension = Math.max(screenWidth, screenHeight)
    const minDimension = Math.min(screenWidth, screenHeight)
    
    // iPad detection
    const isIPad = userAgent.includes('ipad') || 
      (userAgent.includes('macintosh') && 'ontouchend' in document)
    
    // Android tablet detection (typically larger screens)
    const isAndroidTablet = userAgent.includes('android') && 
      !userAgent.includes('mobile') && 
      minDimension >= 600 && maxDimension >= 960
    
    // Generic tablet detection by screen size
    const isTabletSize = minDimension >= 768 && maxDimension >= 1024
    
    return isIPad || isAndroidTablet || isTabletSize
  }
  
  /**
   * Check if device is specifically a phone
   */
  static isPhone(): boolean {
    return this.isMobileDevice() && !this.isTablet()
  }
  
  /**
   * Get device type string
   */
  static getDeviceType(): 'desktop' | 'tablet' | 'phone' {
    if (this.isPhone()) return 'phone'
    if (this.isTablet()) return 'tablet'
    return 'desktop'
  }
  
  /**
   * Check if device supports touch
   */
  static hasTouchSupport(): boolean {
    if (typeof window === 'undefined') return false
    
    return 'ontouchstart' in window || 
           navigator.maxTouchPoints > 0 ||
           (navigator as any).msMaxTouchPoints > 0
  }
  
  /**
   * Get screen characteristics
   */
  static getScreenInfo() {
    if (typeof window === 'undefined') {
      return {
        width: 0,
        height: 0,
        pixelRatio: 1,
        orientation: 'unknown',
        isSmall: false
      }
    }
    
    const width = window.screen.width
    const height = window.screen.height
    const pixelRatio = window.devicePixelRatio || 1
    
    let orientation = 'unknown'
    if (width > height) {
      orientation = 'landscape'
    } else if (height > width) {
      orientation = 'portrait'
    } else {
      orientation = 'square'
    }
    
    const isSmall = Math.min(width, height) <= 600
    
    return {
      width,
      height,
      pixelRatio,
      orientation,
      isSmall
    }
  }
  
  /**
   * Check if device has good performance for heavy animations
   */
  static hasGoodPerformance(): boolean {
    if (typeof window === 'undefined') return false
    
    // Check for modern browser features
    const hasWebGL = !!window.WebGLRenderingContext
    const hasRequestAnimationFrame = !!window.requestAnimationFrame
    
    // Check memory (if available)
    const memory = (navigator as any).deviceMemory
    const hasEnoughMemory = !memory || memory >= 4
    
    // Check CPU cores (if available)  
    const cores = navigator.hardwareConcurrency || 2
    const hasEnoughCores = cores >= 4
    
    // Check pixel ratio (very high ratios can impact performance)
    const pixelRatio = window.devicePixelRatio || 1
    const reasonablePixelRatio = pixelRatio <= 3
    
    return hasWebGL && hasRequestAnimationFrame && hasEnoughMemory && 
           hasEnoughCores && reasonablePixelRatio
  }
}

/**
 * React hook for mobile detection
 */
export function useMobileDetection() {
  const isMobile = MobileDetection.isMobileDevice()
  const isTablet = MobileDetection.isTablet()
  const isPhone = MobileDetection.isPhone()
  const deviceType = MobileDetection.getDeviceType()
  const hasTouch = MobileDetection.hasTouchSupport()
  const screenInfo = MobileDetection.getScreenInfo()
  const hasGoodPerformance = MobileDetection.hasGoodPerformance()
  
  return {
    isMobile,
    isTablet,
    isPhone,
    deviceType,
    hasTouch,
    screenInfo,
    hasGoodPerformance
  }
}