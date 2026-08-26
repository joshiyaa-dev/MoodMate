"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Repeat, Shuffle, ArrowLeft, Music, Heart } from "lucide-react"
import { addNotification } from "@/components/notification-system"
import { MobileFriendlyWrapper } from "./utils/mobile-touch-utils"

interface EnhancedMusicPlayerProps {
  onBack: () => void
}

export default function EnhancedMusicPlayer({ onBack }: EnhancedMusicPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const allTracks = [
    {
      title: "Peaceful Bells",
      artist: "Meditation Masters",
      duration: "2:30",
      file: "/assets/music/peaceful-bells.mp3",
      category: "Meditation",
      color: "from-blue-400 to-cyan-400"
    },
    {
      title: "Ocean Waves",
      artist: "Nature Sounds",
      duration: "3:45",
      file: "/assets/music/ocean-waves.mp3",
      category: "Nature",
      color: "from-teal-400 to-blue-400"
    },
    {
      title: "Gentle Rain",
      artist: "Ambient Nature",
      duration: "4:20",
      file: "/assets/music/gentle-rain.mp3",
      category: "Nature",
      color: "from-gray-400 to-slate-400"
    },
    {
      title: "Forest Whispers",
      artist: "Woodland Sounds",
      duration: "5:15",
      file: "/assets/music/forest-whispers.mp3",
      category: "Nature",
      color: "from-green-400 to-emerald-400"
    },
    {
      title: "Mountain Breeze",
      artist: "Alpine Winds",
      duration: "3:30",
      file: "/assets/music/mountain-breeze.mp3",
      category: "Nature",
      color: "from-cyan-400 to-blue-400"
    },
    {
      title: "Distant Thunder",
      artist: "Storm Sounds",
      duration: "4:45",
      file: "/assets/music/distant-thunder.mp3",
      category: "Nature",
      color: "from-purple-400 to-indigo-400"
    },
    {
      title: "Crystal Stream",
      artist: "Water Sounds",
      duration: "6:00",
      file: "/assets/music/crystal-stream.mp3",
      category: "Nature",
      color: "from-blue-400 to-teal-400"
    },
    {
      title: "Dawn Chorus",
      artist: "Bird Songs",
      duration: "4:10",
      file: "/assets/music/dawn-chorus.mp3",
      category: "Nature",
      color: "from-yellow-400 to-orange-400"
    },
    {
      title: "Crackling Fire",
      artist: "Cozy Sounds",
      duration: "5:30",
      file: "/assets/music/crackling-fire.mp3",
      category: "Ambient",
      color: "from-red-400 to-orange-400"
    },
    {
      title: "Wind Chimes",
      artist: "Zen Garden",
      duration: "3:15",
      file: "/assets/music/wind-chimes.mp3",
      category: "Meditation",
      color: "from-pink-400 to-rose-400"
    },
    {
      title: "Inner Peace",
      artist: "Mindful Moments",
      duration: "7:20",
      file: "/assets/music/inner-peace.mp3",
      category: "Meditation",
      color: "from-violet-400 to-purple-400"
    },
    {
      title: "Tibetan Bowls",
      artist: "Sacred Sounds",
      duration: "4:50",
      file: "/assets/music/tibetan-bowls.mp3",
      category: "Healing",
      color: "from-amber-400 to-yellow-400"
    },
    {
      title: "Starlight Serenade",
      artist: "Night Sounds",
      duration: "5:45",
      file: "/assets/music/starlight-serenade.mp3",
      category: "Sleep",
      color: "from-indigo-400 to-purple-400"
    },
    {
      title: "Mystic Waters",
      artist: "Waterfall Sounds",
      duration: "6:30",
      file: "/assets/music/mystic-waters.mp3",
      category: "Nature",
      color: "from-teal-400 to-cyan-400"
    },
    {
      title: "Moonbeam Melody",
      artist: "Cricket Symphony",
      duration: "4:25",
      file: "/assets/music/moonbeam-melody.mp3",
      category: "Sleep",
      color: "from-slate-400 to-gray-400"
    },
    {
      title: "Bamboo Grove",
      artist: "Jungle Sounds",
      duration: "5:10",
      file: "/assets/music/bamboo-grove.mp3",
      category: "Nature",
      color: "from-green-400 to-lime-400"
    },
    {
      title: "Lavender Fields",
      artist: "Bee Harmony",
      duration: "3:55",
      file: "/assets/music/lavender-fields.mp3",
      category: "Ambient",
      color: "from-purple-400 to-pink-400"
    },
    {
      title: "Healing Light",
      artist: "Gong Meditation",
      duration: "6:15",
      file: "/assets/music/healing-light.mp3",
      category: "Healing",
      color: "from-yellow-400 to-amber-400"
    },
    {
      title: "Ethereal Winds",
      artist: "Flute Dreams",
      duration: "4:40",
      file: "/assets/music/ethereal-winds.mp3",
      category: "Ambient",
      color: "from-sky-400 to-blue-400"
    },
    {
      title: "Celestial Dreams",
      artist: "Harp Melodies",
      duration: "5:25",
      file: "/assets/music/celestial-dreams.mp3",
      category: "Sleep",
      color: "from-violet-400 to-indigo-400"
    }
  ]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0
        audio.play()
      } else {
        nextTrack()
      }
    }

    const handleError = () => {
      // Handle missing audio files by setting a mock duration
      setDuration(180) // 3 minutes mock duration
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [isRepeat, currentTrack])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(() => {
        // Handle play error for missing files - simulate playing
        setIsPlaying(true)
        setTimeout(() => {
          if (isRepeat) {
            setCurrentTime(0)
          } else {
            nextTrack()
          }
        }, 30000) // 30 second demo
      })
    }
    setIsPlaying(!isPlaying)
  }

  const nextTrack = () => {
    if (isShuffle) {
      setCurrentTrack(Math.floor(Math.random() * allTracks.length))
    } else {
      setCurrentTrack((prev) => (prev + 1) % allTracks.length)
    }
    setIsPlaying(true)

    // Add notification for track change
    const nextTrackIndex = isShuffle ?
      Math.floor(Math.random() * allTracks.length) :
      (currentTrack + 1) % allTracks.length

    addNotification({
      type: 'selfcare',
      title: 'Music Track Changed',
      message: `Now playing: "${allTracks[nextTrackIndex].title}" by ${allTracks[nextTrackIndex].artist}`,
      data: { track: allTracks[nextTrackIndex].title, artist: allTracks[nextTrackIndex].artist }
    })
  }

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + allTracks.length) % allTracks.length)
    setIsPlaying(true)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = (parseFloat(e.target.value) / 100) * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const currentTrackData = allTracks[currentTrack]

  return (
    <div className="mobile-container min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-md mx-auto pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-2">
          <Button
            variant="ghost"
            onClick={onBack}
            className="touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="text-center flex-1 mx-2">
            <h1 className="mobile-heading font-bold text-gray-800 dark:text-white">Music Player</h1>
            <p className="mobile-subtext text-gray-600 dark:text-gray-300">20+ healing tracks</p>
          </div>
          <div className="w-8" />
        </div>

        <Card className="mobile-card bg-gradient-to-br from-white/90 to-purple-50/90 backdrop-blur">
        {/* Current Track Display */}
        <Card className={`mobile-card mb-4 bg-gradient-to-r ${currentTrackData.color} text-white shadow-lg`}>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
              <Music className="w-8 h-8" />
            </div>
            <h4 className="mobile-text font-bold mb-1">{currentTrackData.title}</h4>
            <p className="mobile-subtext opacity-90 mb-2">{currentTrackData.artist}</p>
            <span className="inline-block bg-white/20 px-2 py-1 rounded-full text-xs">
              {currentTrackData.category}
            </span>
          </div>
        </Card>

        {/* Audio Element */}
        <audio
          ref={audioRef}
          src={currentTrackData.file}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={duration ? (currentTime / duration) * 100 : 0}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer touch-manipulation"
              style={{
                background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${duration ? (currentTime / duration) * 100 : 0}%, #e5e7eb ${duration ? (currentTime / duration) * 100 : 0}%, #e5e7eb 100%)`
              }}
            />
          </div>
          <div className="flex justify-between mobile-subtext text-gray-600 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsShuffle(!isShuffle)}
            className={`touch-manipulation w-10 h-10 p-0 ${isShuffle ? 'bg-purple-100 border-purple-300' : ''}`}
          >
            <Shuffle className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            onClick={prevTrack}
            size="sm"
            className="touch-manipulation w-12 h-12 p-0"
          >
            <SkipBack className="w-5 h-5" />
          </Button>

          <Button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 touch-manipulation shadow-lg"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-0.5" />
            )}
          </Button>

          <Button
            variant="outline"
            onClick={nextTrack}
            size="sm"
            className="touch-manipulation w-12 h-12 p-0"
          >
            <SkipForward className="w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRepeat(!isRepeat)}
            className={`touch-manipulation w-10 h-10 p-0 ${isRepeat ? 'bg-purple-100 border-purple-300' : ''}`}
          >
            <Repeat className="w-4 h-4" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-3 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
            className="touch-manipulation w-10 h-10 p-0"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <div className="flex-1 relative">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value))
                setIsMuted(false)
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer touch-manipulation"
              style={{
                background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(isMuted ? 0 : volume) * 100}%, #e5e7eb ${(isMuted ? 0 : volume) * 100}%, #e5e7eb 100%)`
              }}
            />
          </div>
          <span className="mobile-subtext text-gray-600 w-8 text-right">
            {Math.round((isMuted ? 0 : volume) * 100)}%
          </span>
        </div>

        {/* Track List */}
        <div className="max-h-60 overflow-y-auto mobile-scroll">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-700 mobile-text">Playlist</h4>
            <span className="mobile-subtext text-gray-500">{allTracks.length} tracks</span>
          </div>
          <div className="space-y-2">
            {allTracks.map((track, index) => (
              <div
                key={index}
                onClick={() => {
                  setCurrentTrack(index)
                  setIsPlaying(true)

                  addNotification({
                    type: 'selfcare',
                    title: 'Music Track Selected',
                    message: `Now playing: "${track.title}" by ${track.artist}`,
                    data: { track: track.title, artist: track.artist, category: track.category }
                  })
                }}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 touch-manipulation ${index === currentTrack
                  ? 'bg-purple-100 border border-purple-300 shadow-sm'
                  : 'bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-100'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${track.color} flex items-center justify-center flex-shrink-0`}>
                      {index === currentTrack && isPlaying ? (
                        <Pause className="w-3 h-3 text-white" />
                      ) : (
                        <Play className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium mobile-subtext truncate">{track.title}</div>
                      <div className="text-xs text-gray-600 truncate">{track.artist}</div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <div className="text-xs text-gray-500 mb-1">{track.duration}</div>
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
                      {track.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
          <div className="flex items-center justify-center space-x-2">
            <Heart className="w-4 h-4 text-purple-600" />
            <p className="mobile-subtext text-purple-800 text-center">
              <strong>20+ healing tracks</strong> for meditation, sleep & relaxation
            </p>
          </div>
        </div>
        </Card>
      </div>
    </div>
  )
}