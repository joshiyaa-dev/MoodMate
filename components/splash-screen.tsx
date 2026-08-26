"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Heart, Sparkles, Brain, Shield, Zap, Users } from "lucide-react"

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("Awakening MOOD MATE...")
  const [showWelcome, setShowWelcome] = useState(false)
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number, color: string}>>([])

  useEffect(() => {
    // Generate colorful floating particles
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD']
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))
    setParticles(newParticles)

    // Extended 8-second duration for better experience
    const totalDuration = 8000
    const steps = 100 // 100 steps for smooth 1% increments
    const stepDuration = totalDuration / steps

    const loadingMessages = [
      "Awakening MOOD MATE...",
      "Loading your data...",
      "Preparing AI insights...",
      "Setting up your space...",
      "Almost ready...",
      "Welcome back!"
    ]

    let currentProgress = 0
    let messageIndex = 0

    const interval = setInterval(() => {
      currentProgress += 1 // Increment by 1% each step
      setProgress(currentProgress)

      // Change message every 500ms (approximately)
      const messageChangePoints = [0, 20, 40, 60, 80, 95]
      if (messageChangePoints.includes(currentProgress) && messageIndex < loadingMessages.length - 1) {
        setLoadingText(loadingMessages[messageIndex])
        messageIndex++
      }

      // Show welcome at 90%
      if (currentProgress >= 90 && !showWelcome) {
        setShowWelcome(true)
      }

      // Complete exactly at 100%
      if (currentProgress >= 100) {
        clearInterval(interval)
        // Small delay to show 100% completion
        setTimeout(onComplete, 200)
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="mobile-full-screen mobile-safe-area bg-gradient-to-br from-rose-500 via-violet-500 to-cyan-500 flex items-center justify-center relative overflow-hidden">
      {/* Colorful Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: '5s',
            backgroundColor: particle.color,
            boxShadow: `0 0 8px ${particle.color}`
          }}
        />
      ))}

      {/* Animated Background Rings - Mobile Optimized */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 sm:w-72 sm:h-72 border border-white/15 rounded-full animate-spin-slow" style={{ animationDuration: '25s' }}></div>
        <div className="absolute w-48 h-48 sm:w-56 sm:h-56 border border-white/10 rounded-full animate-spin-slow" style={{ animationDuration: '18s', animationDirection: 'reverse' }}></div>
        <div className="absolute w-32 h-32 sm:w-40 sm:h-40 border border-white/15 rounded-full animate-spin-slow" style={{ animationDuration: '12s' }}></div>
      </div>

      <Card className="w-full max-w-xs mx-4 mobile-card text-center bg-white/15 backdrop-blur-2xl border-white/25 shadow-2xl relative z-10 transform transition-all duration-1000 rounded-2xl">
        <div className="space-y-4 p-2">
          {/* Enhanced Logo Animation */}
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-rose-300/20 to-cyan-300/20 flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20">
              <div className="relative">
                <img 
                  src="/mood-mate-logo.svg" 
                  alt="MOOD MATE Logo" 
                  className={`w-12 h-12 transition-all duration-1000 ${progress > 60 ? 'animate-pulse' : 'animate-bounce'}`}
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-400/20 to-cyan-400/20 animate-ping"></div>
              </div>
            </div>
            
            {/* Orbiting Icons with Color */}
            <div className="absolute top-0 left-0 w-full h-full animate-spin" style={{ animationDuration: '10s' }}>
              <Sparkles className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-4 h-4 text-yellow-400 animate-bounce" />
              <Brain className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-4 h-4 text-cyan-400 animate-pulse" />
              <Shield className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-4 text-emerald-400 animate-bounce" style={{ animationDelay: '0.6s' }} />
              <Zap className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-4 h-4 text-rose-400 animate-pulse" style={{ animationDelay: '1.2s' }} />
            </div>
          </div>

          {/* App Name with Vibrant Tagline */}
          <div className={`transition-all duration-1000 px-2 ${showWelcome ? 'transform translate-y-0 opacity-100' : 'transform translate-y-4 opacity-70'}`}>
            <h1 className="text-2xl font-extrabold text-white mb-2 bg-gradient-to-r from-rose-300 via-yellow-200 to-cyan-300 bg-clip-text text-transparent">
              MOOD MATE
            </h1>
            <p className="text-white/95 mobile-subtext font-semibold tracking-wide">
              Empower Your Mind, Embrace Your Journey
            </p>
          </div>

          {/* Enhanced Loading Progress */}
          <div className="space-y-2">
            <div className="relative">
              <div className="w-full bg-white/25 rounded-full h-2 shadow-inner">
                <div
                  className="bg-gradient-to-r from-rose-400 via-yellow-400 to-cyan-400 h-2 rounded-full transition-all duration-300 ease-out shadow-lg relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                </div>
              </div>
              <div className="text-right text-white/70 text-xs mt-1 font-mono">{Math.round(progress)}%</div>
            </div>
            
            <div className={`transition-all duration-500 ${showWelcome ? 'text-cyan-300' : 'text-white/95'}`}>
              <p className="text-sm font-semibold animate-pulse">{loadingText}</p>
            </div>
          </div>

          {/* Enhanced Features Grid */}
          <div className="grid grid-cols-2 gap-2 px-2">
            <div className={`flex items-center space-x-2 p-2 rounded-lg bg-white/10 backdrop-blur-sm transition-all duration-700 ${progress > 20 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50 flex-shrink-0"></div>
              <span className="text-white/95 font-semibold truncate text-xs">100% Offline</span>
            </div>
            <div className={`flex items-center space-x-2 p-2 rounded-lg bg-white/10 backdrop-blur-sm transition-all duration-700 ${progress > 40 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`} style={{ transitionDelay: '0.1s' }}>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50 flex-shrink-0"></div>
              <span className="text-white/95 font-semibold truncate text-xs">AI-Powered</span>
            </div>
            <div className={`flex items-center space-x-2 p-2 rounded-lg bg-white/10 backdrop-blur-sm transition-all duration-700 ${progress > 60 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`} style={{ transitionDelay: '0.2s' }}>
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse shadow-lg shadow-violet-400/50 flex-shrink-0"></div>
              <span className="text-white/95 font-semibold truncate text-xs">Private & Secure</span>
            </div>
            <div className={`flex items-center space-x-2 p-2 rounded-lg bg-white/10 backdrop-blur-sm transition-all duration-700 ${progress > 80 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`} style={{ transitionDelay: '0.3s' }}>
              <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse shadow-lg shadow-rose-400/50 flex-shrink-0"></div>
              <span className="text-white/95 font-semibold truncate text-xs">Personalized</span>
            </div>
          </div>

          {/* Enhanced Welcome Message */}
          {showWelcome && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-rose-400/30 to-cyan-400/30 backdrop-blur-lg rounded-2xl animate-in zoom-in-75 duration-700">
              <div className="text-center text-white px-4">
                <Users className="w-8 h-8 mx-auto mb-3 animate-bounce" />
                <h2 className="text-lg font-bold mb-2 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">Welcome Aboard!</h2>
                <p className="mobile-subtext opacity-95 tracking-wide">Your wellness adventure awaits</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Custom Tailwind Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.8; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 0.5; }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow linear infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  )
}