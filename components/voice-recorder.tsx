"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, Square, Play, Pause, Trash2, Save, Download } from "lucide-react"

interface VoiceRecorderProps {
  onSave: (audioBlob: Blob) => void
  onCancel: () => void
}

export default function VoiceRecorder({ onSave, onCancel }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const isStoppingRef = useRef(false)

  useEffect(() => {
    return () => {
      // Cleanup on component unmount
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      // Stop MediaRecorder if it exists
      if (mediaRecorderRef.current) {
        try {
          if (mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop()
          }
        } catch (error) {
          console.log("Error stopping MediaRecorder on cleanup:", error)
        }
      }

      // Stop all stream tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          try {
            track.stop()
          } catch (error) {
            console.log("Error stopping track on cleanup:", error)
          }
        })
      }

      // Stop audio playback
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      // Clean up any existing recording first
      if (mediaRecorderRef.current) {
        stopRecording()
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        setAudioBlob(blob)
        setIsProcessing(false)
        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
          streamRef.current = null
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Microphone access error:", error)
      alert("Could not access microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    // Prevent multiple calls to stopRecording
    if (isStoppingRef.current) {
      return
    }
    isStoppingRef.current = true

    console.log("Stopping recording...")

    // Always update the state first to prevent UI issues
    setIsRecording(false)
    setIsProcessing(true)

    // Clear the timer immediately
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    // Force stop all tracks first to release microphone immediately
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop()
          console.log("Track stopped:", track.kind)
        } catch (error) {
          console.log("Error stopping track:", error)
        }
      })
      streamRef.current = null
    }

    // Handle MediaRecorder
    if (mediaRecorderRef.current) {
      try {
        const state = mediaRecorderRef.current.state
        console.log("MediaRecorder state:", state)

        if (state === "recording") {
          // Set up the onstop handler before stopping
          mediaRecorderRef.current.onstop = () => {
            console.log("MediaRecorder stopped, creating blob...")
            const blob = new Blob(chunksRef.current, { type: "audio/webm" })
            setAudioBlob(blob)
            setIsProcessing(false)
            isStoppingRef.current = false
          }
          mediaRecorderRef.current.stop()
        } else {
          // If not recording, create blob from existing chunks
          if (chunksRef.current.length > 0) {
            const blob = new Blob(chunksRef.current, { type: "audio/webm" })
            setAudioBlob(blob)
          }
          setIsProcessing(false)
          isStoppingRef.current = false
        }
      } catch (error) {
        console.log("Error stopping MediaRecorder:", error)
        // Fallback: create blob from chunks if available
        if (chunksRef.current.length > 0) {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" })
          setAudioBlob(blob)
        }
        setIsProcessing(false)
        isStoppingRef.current = false
      }
    } else {
      // No MediaRecorder, just reset state
      setIsProcessing(false)
      isStoppingRef.current = false
    }
  }

  const playRecording = () => {
    if (audioBlob && !isPlaying) {
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onended = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(audioUrl)
      }

      audio.play()
      setIsPlaying(true)
    }
  }

  const pausePlayback = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const deleteRecording = () => {
    setAudioBlob(null)
    setRecordingTime(0)
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const downloadRecording = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `voice-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const saveRecording = () => {
    if (audioBlob) {
      onSave(audioBlob)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="p-6 dark:bg-gray-800">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Voice Recording</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Record your thoughts and feelings</p>
        </div>

        {/* Recording Controls */}
        <div className="text-center space-y-4">
          {!audioBlob ? (
            <div className="space-y-4">
              <div className="relative">
                <div
                  className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center transition-all ${isRecording ? "bg-red-500 animate-pulse" : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                    }`}
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  {isRecording ? <Square className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
                </div>
                {isRecording && (
                  <div className="absolute -inset-2 rounded-full border-4 border-red-300 animate-ping"></div>
                )}
              </div>

              <div className="text-2xl font-mono text-gray-800 dark:text-gray-100">{formatTime(recordingTime)}</div>

              <p className="text-sm text-gray-600 dark:text-gray-300">
                {isProcessing ? "Processing recording..." : isRecording ? "Tap to stop recording" : "Tap to start recording"}
              </p>

              {/* Emergency Stop Button */}
              {isRecording && (
                <Button
                  onClick={stopRecording}
                  variant="destructive"
                  size="sm"
                  className="mt-2"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Force Stop
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center space-x-2">
                <Button onClick={isPlaying ? pausePlayback : playRecording} className="bg-green-500 hover:bg-green-600">
                  {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isPlaying ? "Pause" : "Play"}
                </Button>
                <Button variant="outline" onClick={downloadRecording}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" onClick={deleteRecording}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>

              <div className="text-lg font-mono text-gray-800 dark:text-gray-100">Recording: {formatTime(recordingTime)}</div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Audio File:</strong> {(audioBlob.size / 1024).toFixed(1)} KB • WebM format
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button
            onClick={saveRecording}
            disabled={!audioBlob || isProcessing}
            className="flex-1 bg-blue-500 hover:bg-blue-600"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Audio
          </Button>
        </div>
      </div>
    </Card>
  )
}