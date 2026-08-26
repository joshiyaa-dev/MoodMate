"use client"

import { useEffect, useState, useCallback } from "react"

interface TTSManagerProps {
  language: string
  enabled: boolean
}

export class MobileTTSManager {
  private static instance: MobileTTSManager
  private synth: SpeechSynthesis | null = null
  private voices: SpeechSynthesisVoice[] = []
  private currentLanguage = "en-US"
  private isInitialized = false
  private voicesLoaded = false
  private currentUtterance: SpeechSynthesisUtterance | null = null
  private isMobile = false
  private retryCount = 0
  private maxRetries = 3

  private constructor() {
    if (typeof window !== "undefined") {
      this.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      this.initializeTTS()
    }
  }

  static getInstance(): MobileTTSManager {
    if (!MobileTTSManager.instance) {
      MobileTTSManager.instance = new MobileTTSManager()
    }
    return MobileTTSManager.instance
  }

  private async initializeTTS() {
    if (typeof window === "undefined") return

    // Check if TTS is supported
    if (!("speechSynthesis" in window)) {
      console.warn("Speech synthesis not supported in this browser")
      return
    }

    this.synth = window.speechSynthesis
    
    // Mobile-specific initialization
    if (this.isMobile) {
      // On mobile, voices might need user interaction to load
      document.addEventListener('touchstart', this.handleFirstUserInteraction.bind(this), { once: true })
      document.addEventListener('click', this.handleFirstUserInteraction.bind(this), { once: true })
    }

    await this.loadVoices()
    this.isInitialized = true
  }

  private handleFirstUserInteraction() {
    if (this.synth && !this.voicesLoaded) {
      // Force voices to load on mobile
      this.loadVoices()
      
      // Test TTS to ensure it works in mobile app
      this.testTTSFunctionality()
    }
  }

  private async loadVoices() {
    if (!this.synth) return

    return new Promise<void>((resolve) => {
      const loadVoicesImpl = () => {
        this.voices = this.synth!.getVoices()
        
        if (this.voices.length > 0) {
          this.voicesLoaded = true
          console.log(`Loaded ${this.voices.length} voices for TTS`)
          resolve()
        } else if (this.retryCount < this.maxRetries) {
          this.retryCount++
          setTimeout(() => {
            loadVoicesImpl()
          }, 100 * this.retryCount) // Exponential backoff
        } else {
          console.warn("Could not load TTS voices after retries")
          resolve()
        }
      }

      // Initial load
      loadVoicesImpl()

      // Listen for voices changed event (important for mobile)
      if (this.synth && this.synth.addEventListener) {
        this.synth.addEventListener("voiceschanged", () => {
          loadVoicesImpl()
        })
      }
    })
  }

  private testTTSFunctionality() {
    if (!this.synth || !this.voicesLoaded) return

    try {
      // Create a silent test utterance
      const testUtterance = new SpeechSynthesisUtterance("")
      testUtterance.volume = 0
      testUtterance.rate = 1
      testUtterance.pitch = 1
      
      this.synth.speak(testUtterance)
      
      setTimeout(() => {
        this.synth?.cancel()
      }, 10)
      
      console.log("TTS functionality test completed")
    } catch (error) {
      console.error("TTS test failed:", error)
    }
  }

  setLanguage(language: string) {
    const languageMap: Record<string, string> = {
      English: "en-US",
      Spanish: "es-ES", 
      French: "fr-FR",
      German: "de-DE",
      Portuguese: "pt-BR",
    }
    this.currentLanguage = languageMap[language] || "en-US"
  }

  private findBestVoice(): SpeechSynthesisVoice | null {
    if (!this.voicesLoaded || this.voices.length === 0) return null

    const targetLang = this.currentLanguage.split("-")[0]
    
    // Priority order for voice selection
    const priorities = [
      // Exact language and region match
      (voice: SpeechSynthesisVoice) => voice.lang === this.currentLanguage,
      // Same language, different region
      (voice: SpeechSynthesisVoice) => voice.lang.startsWith(targetLang),
      // Local voices (better quality on mobile)
      (voice: SpeechSynthesisVoice) => voice.localService === true,
      // Any English voice as fallback
      (voice: SpeechSynthesisVoice) => voice.lang.startsWith("en"),
      // Any voice
      () => true
    ]

    for (const priorityCheck of priorities) {
      const voice = this.voices.find(priorityCheck)
      if (voice) return voice
    }

    return this.voices[0] || null
  }

  async speak(text: string, options?: { 
    rate?: number; 
    pitch?: number; 
    volume?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: any) => void;
  }) {
    if (!this.synth || !text.trim()) return false

    // Cancel any ongoing speech
    this.stop()

    // Ensure TTS is initialized on mobile
    if (this.isMobile && !this.isInitialized) {
      await this.initializeTTS()
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text.trim())

      // Find the best voice
      const voice = this.findBestVoice()
      if (voice) {
        utterance.voice = voice
        utterance.lang = voice.lang
      } else {
        utterance.lang = this.currentLanguage
      }

      // Set options with mobile-optimized defaults
      utterance.rate = options?.rate || (this.isMobile ? 0.85 : 0.9)
      utterance.pitch = options?.pitch || 1
      utterance.volume = options?.volume || (this.isMobile ? 0.9 : 0.8)

      // Event handlers
      utterance.onstart = () => {
        console.log("TTS started")
        options?.onStart?.()
      }

      utterance.onend = () => {
        console.log("TTS ended")
        this.currentUtterance = null
        options?.onEnd?.()
      }

      utterance.onerror = (event) => {
        console.error("TTS error:", event)
        this.currentUtterance = null
        options?.onError?.(event)
      }

      // Mobile-specific handling
      if (this.isMobile) {
        // Chunk long text for better mobile performance
        if (text.length > 200) {
          const chunks = this.chunkText(text, 200)
          return this.speakChunks(chunks, options)
        }
      }

      this.currentUtterance = utterance
      this.synth.speak(utterance)
      return true

    } catch (error) {
      console.error("Error in TTS speak:", error)
      options?.onError?.(error)
      return false
    }
  }

  private chunkText(text: string, maxLength: number): string[] {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const chunks: string[] = []
    let currentChunk = ""

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim()
      if (currentChunk.length + trimmedSentence.length <= maxLength) {
        currentChunk += (currentChunk ? ". " : "") + trimmedSentence
      } else {
        if (currentChunk) chunks.push(currentChunk + ".")
        currentChunk = trimmedSentence
      }
    }

    if (currentChunk) chunks.push(currentChunk + ".")
    return chunks
  }

  private async speakChunks(chunks: string[], options?: any): Promise<boolean> {
    for (let i = 0; i < chunks.length; i++) {
      const isLast = i === chunks.length - 1
      await new Promise<void>((resolve) => {
        this.speak(chunks[i], {
          ...options,
          onEnd: () => {
            if (isLast) options?.onEnd?.()
            resolve()
          },
          onError: () => {
            options?.onError?.()
            resolve()
          }
        })
      })
    }
    return true
  }

  stop() {
    if (this.synth) {
      this.synth.cancel()
      this.currentUtterance = null
    }
  }

  pause() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause()
    }
  }

  resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume()
    }
  }

  get isSupported(): boolean {
    return !!(this.synth && this.isInitialized)
  }

  get isSpeaking(): boolean {
    return !!(this.synth && this.synth.speaking)
  }

  get isPaused(): boolean {
    return !!(this.synth && this.synth.paused)
  }

  // Enhanced mobile-friendly encouraging messages
  async speakEncouragement(type: "mood" | "journal" | "selfcare" | "crisis") {
    const messages = {
      mood: [
        "Take a moment to check in with yourself. Your feelings are valid and important.",
        "It's okay to feel whatever you're feeling right now. You're doing great by staying aware.",
        "Remember, every day is different, and your mental health journey is unique to you.",
      ],
      journal: [
        "Writing can be a powerful way to process your thoughts. Take your time with this.",
        "Your journal is your safe space. Feel free to express whatever comes to mind.",
        "Putting thoughts into words often helps us understand ourselves better.",
      ],
      selfcare: [
        "You deserve this moment of care and attention. Breathe deeply and be present.",
        "Self-care isn't selfish, it's necessary. You're worth this investment in yourself.",
        "Let this be a moment of peace in your day. You're doing important work for your wellbeing.",
      ],
      crisis: [
        "You are not alone in this moment. Reaching out for help is a sign of strength.",
        "These intense feelings are temporary, even though they feel overwhelming right now.",
        "Your life has meaning and value. Please consider speaking with someone who can help.",
      ],
    }

    const typeMessages = messages[type]
    const randomMessage = typeMessages[Math.floor(Math.random() * typeMessages.length)]
    
    return this.speak(randomMessage, {
      rate: 0.8,
      volume: 0.9,
      onStart: () => console.log(`Speaking ${type} encouragement`),
      onError: (error) => console.error(`Error speaking ${type} encouragement:`, error)
    })
  }

  // Enhanced mood-specific responses
  async speakMoodResponse(mood: number) {
    const responses = {
      1: "I can hear that you're going through a really tough time right now. These difficult feelings are real, but they won't last forever. You've made it through hard times before.",
      2: "It sounds like things are challenging today. That's okay - difficult days are part of life. Consider doing something small and kind for yourself.",
      3: "A neutral mood is perfectly normal and healthy. Not every day needs to be amazing. Sometimes just being okay is enough.",
      4: "I'm glad you're feeling good today. It's wonderful when we can appreciate the positive moments in our lives.",
      5: "It's beautiful that you're feeling so positive! Try to notice what's contributing to this happiness so you can nurture more of it.",
    }

    const response = responses[mood as keyof typeof responses]
    return this.speak(response, {
      rate: 0.85,
      volume: 0.9,
      onStart: () => console.log(`Speaking mood ${mood} response`),
      onError: (error) => console.error(`Error speaking mood response:`, error)
    })
  }

  // Enhanced breathing exercise guidance with better mobile support
  async speakBreathingGuidance(phase: "inhale" | "hold" | "exhale", count: number) {
    const guidance = {
      inhale: count === 1 ? "Breathe in slowly and deeply through your nose" : `${count}`,
      hold: count === 1 ? "Hold your breath gently, don't strain" : `${count}`,
      exhale: count === 1 ? "Breathe out slowly through your mouth, releasing tension" : `${count}`,
    }

    return this.speak(guidance[phase], { 
      rate: 0.6, 
      volume: 0.85,
      pitch: 0.9,
      onError: (error) => console.error(`Error in breathing guidance:`, error)
    })
  }
}

export default function TTSManagerComponent({ language, enabled }: TTSManagerProps) {
  const [ttsManager] = useState(() => MobileTTSManager.getInstance())
  const [isReady, setIsReady] = useState(false)

  const initializeTTS = useCallback(async () => {
    if (enabled) {
      ttsManager.setLanguage(language)
      // Test TTS to ensure it works
      setTimeout(() => {
        setIsReady(ttsManager.isSupported)
      }, 500)
    }
  }, [language, enabled, ttsManager])

  useEffect(() => {
    initializeTTS()
  }, [initializeTTS])

  // Expose TTS manager globally for easy access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).ttsManager = ttsManager
    }
  }, [ttsManager])

  return null // This component doesn't render anything
}

// Export the enhanced TTS manager for global use
export { MobileTTSManager as TTSManager }
