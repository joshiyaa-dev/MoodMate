"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw, Palette, Download, Brush } from "lucide-react"

interface PaintMyMoodMobileProps {
  onBack: () => void
}

export default function PaintMyMoodMobile({ onBack }: PaintMyMoodMobileProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentColor, setCurrentColor] = useState('#3B82F6')
  const [brushSize, setBrushSize] = useState(8)
  const [selectedMood, setSelectedMood] = useState<string>('')
  const [lastPoint, setLastPoint] = useState<{x: number, y: number} | null>(null)

  const colors = [
    { name: 'Happy Yellow', color: '#FDE047', mood: 'joyful', emoji: '😊' },
    { name: 'Calm Blue', color: '#3B82F6', mood: 'peaceful', emoji: '😌' },
    { name: 'Angry Red', color: '#EF4444', mood: 'frustrated', emoji: '😠' },
    { name: 'Sad Purple', color: '#8B5CF6', mood: 'melancholy', emoji: '😢' },
    { name: 'Energetic Orange', color: '#F97316', mood: 'excited', emoji: '🤩' },
    { name: 'Nature Green', color: '#10B981', mood: 'balanced', emoji: '🌿' },
    { name: 'Love Pink', color: '#EC4899', mood: 'affectionate', emoji: '🥰' },
    { name: 'Mystery Black', color: '#1F2937', mood: 'contemplative', emoji: '🤔' }
  ]

  const moods = [
    { name: 'Happy', emoji: '😊', color: '#FDE047' },
    { name: 'Sad', emoji: '😢', color: '#8B5CF6' },
    { name: 'Angry', emoji: '😠', color: '#EF4444' },
    { name: 'Calm', emoji: '😌', color: '#3B82F6' },
    { name: 'Excited', emoji: '🤩', color: '#F97316' },
    { name: 'Anxious', emoji: '😰', color: '#6B7280' },
    { name: 'Loved', emoji: '🥰', color: '#EC4899' },
    { name: 'Peaceful', emoji: '🕊️', color: '#10B981' }
  ]

  const brushSizes = [
    { size: 4, label: 'Fine', icon: '✏️' },
    { size: 8, label: 'Medium', icon: '🖍️' },
    { size: 16, label: 'Thick', icon: '🖌️' },
    { size: 24, label: 'Bold', icon: '🎨' }
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set responsive canvas size
    const container = canvas.parentElement
    if (container) {
      const containerWidth = container.clientWidth - 32 // Account for padding
      const canvasSize = Math.min(containerWidth, 300)
      
      canvas.width = canvasSize
      canvas.height = canvasSize
    }

    // Fill with white background
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Set smooth lines
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  const getCoordinates = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    
    if (e.type.startsWith('touch')) {
      const touchEvent = e as React.TouchEvent
      if (touchEvent.touches.length > 0) {
        return {
          x: touchEvent.touches[0].clientX - rect.left,
          y: touchEvent.touches[0].clientY - rect.top
        }
      }
    } else {
      const mouseEvent = e as React.MouseEvent
      return {
        x: mouseEvent.clientX - rect.left,
        y: mouseEvent.clientY - rect.top
      }
    }
    return null
  }, [])

  const startDrawing = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    const coords = getCoordinates(e)
    if (coords) {
      setIsDrawing(true)
      setLastPoint(coords)
    }
  }, [getCoordinates])

  const draw = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    if (!isDrawing) return

    const coords = getCoordinates(e)
    if (!coords || !lastPoint) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.lineWidth = brushSize
    ctx.strokeStyle = currentColor
    ctx.globalCompositeOperation = 'source-over'

    ctx.beginPath()
    ctx.moveTo(lastPoint.x, lastPoint.y)
    ctx.lineTo(coords.x, coords.y)
    ctx.stroke()

    setLastPoint(coords)
  }, [isDrawing, getCoordinates, lastPoint, brushSize, currentColor])

  const stopDrawing = useCallback(() => {
    setIsDrawing(false)
    setLastPoint(null)
  }, [])

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const downloadArt = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const link = document.createElement('a')
      link.download = `mood-art-${Date.now()}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const selectMood = (mood: string, color: string) => {
    setSelectedMood(mood)
    setCurrentColor(color)
  }

  return (
    <div className="mobile-container min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
      <div className="max-w-md mx-auto pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="touch-target"
          >
            ← Back
          </Button>
          <h2 className="mobile-heading font-bold text-purple-800 dark:text-purple-200">
            Paint My Mood
          </h2>
          <div className="w-16"></div>
        </div>

        {/* Mood Selection */}
        <Card className="mobile-card mb-4">
          <h3 className="mobile-text font-semibold text-gray-800 dark:text-gray-200 mb-3 text-center">
            How are you feeling? 🎨
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {moods.map((mood) => (
              <Button
                key={mood.name}
                variant={selectedMood === mood.name ? "default" : "outline"}
                size="sm"
                onClick={() => selectMood(mood.name, mood.color)}
                className={`h-auto p-2 flex flex-col items-center space-y-1 touch-target ${
                  selectedMood === mood.name 
                    ? 'ring-2 ring-purple-400 bg-purple-100 dark:bg-purple-800' 
                    : ''
                }`}
                style={{
                  backgroundColor: selectedMood === mood.name ? mood.color + '20' : undefined
                }}
              >
                <span className="text-lg">{mood.emoji}</span>
                <span className="text-xs font-medium">{mood.name}</span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Color Palette */}
        <Card className="mobile-card mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="mobile-text font-semibold text-gray-800 dark:text-gray-200">
              Colors
            </h3>
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4 text-gray-600" />
              <span className="mobile-subtext text-gray-600">
                {colors.find(c => c.color === currentColor)?.name || 'Custom'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setCurrentColor(color.color)}
                className={`h-12 rounded-lg border-2 touch-target transition-all ${
                  currentColor === color.color 
                    ? 'border-gray-800 dark:border-white scale-110 shadow-lg' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color.color }}
                title={color.name}
              >
                <span className="text-white drop-shadow text-sm">{color.emoji}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Brush Size */}
        <Card className="mobile-card mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="mobile-text font-semibold text-gray-800 dark:text-gray-200">
              Brush Size
            </h3>
            <div className="flex items-center space-x-2">
              <Brush className="w-4 h-4 text-gray-600" />
              <span className="mobile-subtext text-gray-600">
                {brushSizes.find(b => b.size === brushSize)?.label}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {brushSizes.map((brush) => (
              <Button
                key={brush.size}
                variant={brushSize === brush.size ? "default" : "outline"}
                size="sm"
                onClick={() => setBrushSize(brush.size)}
                className="h-auto p-3 flex flex-col items-center space-y-1 touch-target"
              >
                <span className="text-lg">{brush.icon}</span>
                <span className="text-xs">{brush.label}</span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Canvas */}
        <Card className="mobile-card mb-4 p-4">
          <div className="text-center mb-3">
            <h3 className="mobile-text font-semibold text-gray-800 dark:text-gray-200">
              Express Your Emotions
            </h3>
            <p className="mobile-subtext text-gray-600">
              Draw, doodle, or paint how you're feeling
            </p>
          </div>
          
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              className="border-2 border-gray-300 rounded-lg touch-manipulation cursor-crosshair bg-white shadow-inner"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              style={{ touchAction: 'none' }}
            />
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
          <Button 
            onClick={clearCanvas}
            variant="outline"
            size="lg"
            className="flex-1 touch-target"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Clear
          </Button>
          
          <Button 
            onClick={downloadArt}
            size="lg"
            className="flex-1 touch-target bg-purple-500 hover:bg-purple-600"
          >
            <Download className="w-5 h-5 mr-2" />
            Save Art
          </Button>
        </div>

        {/* Benefits Card */}
        <Card className="mobile-card bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
          <div className="text-center">
            <div className="text-2xl mb-2">🎨</div>
            <h4 className="font-semibold mobile-text text-pink-800 mb-1">Art Therapy Benefits</h4>
            <p className="mobile-subtext text-pink-700">
              Express emotions non-verbally • Process complex feelings • Reduce stress • Boost creativity • Improve self-awareness
            </p>
            <div className="mt-2 flex justify-center space-x-4">
              <span className="mobile-subtext text-pink-600">🧠 Expression</span>
              <span className="mobile-subtext text-purple-600">💝 Healing</span>
              <span className="mobile-subtext text-blue-600">✨ Creativity</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}