"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Plus, Search, Calendar, Sparkles, Mic } from "lucide-react"
import VoiceRecorder from "@/components/voice-recorder"
import { addNotification } from "@/components/notification-system"

interface JournalEntry {
  id: string
  title: string
  content: string
  date: string
  timestamp: number
  mood?: number
  tags: string[]
}

interface JournalEntryProps {
  journalEntries: JournalEntry[]
  setJournalEntries: (entries: JournalEntry[]) => void
  onBack: () => void
}

export default function JournalEntryComponent({ journalEntries, setJournalEntries, onBack }: JournalEntryProps) {
  const [isWriting, setIsWriting] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)
const [digest, setDigest] = useState("")
const [triggerTags, setTriggerTags] = useState<string[]>([])
const [dictating, setDictating] = useState(false)

const TRIGGER_TAGS = ["Work", "Family", "Health", "Sleep", "Money", "Friends", "Study", "Weather"]

// Real on-device voice dictation (Web Speech API) into the journal body.
const toggleDictation = () => {
  const w = window as any
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition
  if (!Ctor) {
    alert("Voice dictation needs Chrome or Edge.")
    return
  }
  if (dictating) {
    setDictating(false)
    return
  }
  const rec = new Ctor()
  rec.lang = "en-IN"
  rec.continuous = true
  rec.interimResults = false
  rec.onresult = (e: any) => {
    const text = e.results[e.results.length - 1][0].transcript
    setContent((prev: string) => (prev ? prev + " " : "") + text)
  }
  rec.onend = () => setDictating(false)
  rec.onerror = () => setDictating(false)
  rec.start()
  setDictating(true)
}

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      date: new Date().toISOString(),
      timestamp: Date.now(),
      tags: [...new Set([...extractTags(content), ...triggerTags.map((t) => t.toLowerCase())])],
    }

    setJournalEntries([newEntry, ...journalEntries])
    
    // Add notification for journal entry
    addNotification({
      type: 'journal',
      title: 'Journal Entry Saved',
      message: `"${title.trim()}" - ${content.trim().substring(0, 50)}${content.trim().length > 50 ? '...' : ''}`,
      data: { entryId: newEntry.id, title: title.trim() }
    })
    
    setTitle("")
    setContent("")
    setTriggerTags([])
    setIsWriting(false)
  }

  const extractTags = (text: string): string[] => {
    // Simple tag extraction based on common emotional keywords
    const emotionKeywords = [
      "happy",
      "sad",
      "angry",
      "excited",
      "worried",
      "grateful",
      "stressed",
      "calm",
      "anxious",
      "proud",
      "frustrated",
      "hopeful",
      "lonely",
      "content",
    ]

    const words = text.toLowerCase().split(/\s+/)
    return emotionKeywords.filter((keyword) => words.some((word) => word.includes(keyword))).slice(0, 3)
  }

  const generateAISummary = () => {
    if (journalEntries.length === 0) return
    // Real deterministic weekly digest — computed from actual entries, no fake delay.
    const recentEntries = journalEntries.slice(0, 7)
    const commonTags = recentEntries
      .flatMap((entry) => entry.tags)
      .reduce(
        (acc, tag) => {
          acc[tag] = (acc[tag] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

    const topEmotion = Object.entries(commonTags).sort(([, a], [, b]) => b - a)[0]?.[0] || "reflective"
    const wordCount = recentEntries.reduce(
      (acc: number, e: any) => acc + String(e.content || "").split(/\s+/).filter(Boolean).length,
      0,
    )
    const days = new Set(recentEntries.map((e: any) => new Date(e.date).toDateString())).size

    setDigest(
      `Over your last ${recentEntries.length} entries (${days} days, ${wordCount} words), the most common feeling was "${topEmotion}". ` +
        (wordCount / Math.max(1, days) >= 80
          ? "You are writing in real depth — that reflection habit is paying off."
          : "Try slightly longer entries to capture more detail about what shaped your day.") +
        ` Suggested tool this week: ${topEmotion === "stressed" || topEmotion === "anxious" ? "Breathing Bubble" : topEmotion === "grateful" || topEmotion === "happy" ? "Gratitude Spinner" : "Mindful Reading"}.`,
    )
  }

  const filteredEntries = journalEntries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (isWriting) {
    return (
      <div className="mobile-container mobile-constrained bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsWriting(false)}
              className="mobile-button touch-target border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="mobile-heading text-gray-800 dark:text-gray-100 flex-1 text-center mx-2">New Journal Entry</h1>
            <div className="flex space-x-2">
              <Button onClick={toggleDictation} variant={dictating ? "default" : "outline"} size="sm" className={`mobile-button touch-target ${dictating ? "animate-pulse bg-rose-500 text-white" : ""}`}>
                <Mic className="w-4 h-4 mr-1" />
                {dictating ? "Stop" : "Dictate"}
              </Button>
              <Button onClick={() => setShowVoiceRecorder(true)} variant="outline" size="sm" className="mobile-button touch-target">
                <Mic className="w-4 h-4 mr-1" />
                Voice
              </Button>
              <Button onClick={handleSave} disabled={!title.trim() || !content.trim()} size="sm" className="mobile-button touch-target">
                Save
              </Button>
            </div>
          </div>

          <Card className="mobile-card dark:bg-gray-800">
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Entry title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="font-semibold mobile-text border-none p-0 focus-visible:ring-0 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>

              <div className="mobile-subtext text-gray-500 dark:text-gray-400">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">What influenced today? (optional tags)</p>
                <div className="flex flex-wrap gap-1.5">
                  {TRIGGER_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setTriggerTags((prev) => (prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]))}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        triggerTags.includes(tag)
                          ? "bg-purple-500 text-white"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <Textarea
                placeholder="What's on your mind today? Write, or tap Dictate and speak..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="border-none p-0 focus-visible:ring-0 resize-none dark:bg-gray-800 dark:text-gray-100 mobile-text"
              />

              <div className="mobile-subtext text-gray-400 dark:text-gray-500">
                {content.length} characters • {content.split(" ").filter((w) => w.length > 0).length} words
              </div>
            </div>
          </Card>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="mobile-subtext text-blue-800 dark:text-blue-200">
              <strong>Writing Tip:</strong> Try to write for at least 5 minutes without stopping. Don't worry about
              grammar or structure - just let your thoughts flow naturally.
            </p>
          </div>

          {showVoiceRecorder && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <VoiceRecorder
                onSave={(audioBlob) => {
                  const audioSize = (audioBlob.size / 1024).toFixed(1)
                  setContent(content + `\n\n[Voice Recording - ${audioSize} KB - ${new Date().toLocaleString()}]\n(Audio file saved)`)
                  setShowVoiceRecorder(false)
                }}
                onCancel={() => setShowVoiceRecorder(false)}
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="mobile-container mobile-constrained bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBack}
            className="mobile-button touch-target border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="mobile-heading text-gray-800 dark:text-gray-100 flex-1 text-center mx-2">Journal</h1>
          <Button onClick={() => setIsWriting(true)} size="sm" className="mobile-button touch-target">
            <Plus className="w-4 h-4 mr-1" />
            Write
          </Button>
        </div>

        {/* Search and AI Summary */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search your entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-3"
            />
          </div>

          {journalEntries.length > 0 && (
            <>
              <Button
                variant="outline"
                onClick={generateAISummary}
                className="w-full bg-transparent py-3"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Weekly Summary
              </Button>
              {digest && (
                <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 text-sm text-purple-900 dark:border-purple-800 dark:bg-purple-900/20 dark:text-purple-200">
                  {digest}
                  <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wide opacity-60">
                    Computed on-device from your last 7 entries
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Journal Entries */}
        <div className="space-y-6 pb-8">
          {filteredEntries.length === 0 ? (
            <Card className="mobile-card text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3 mobile-heading">
                {journalEntries.length === 0 ? "Start Your Journal" : "No entries found"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mobile-text mb-6">
                {journalEntries.length === 0
                  ? "Begin your mental health journey by writing your first journal entry."
                  : "Try adjusting your search terms."}
              </p>
              {journalEntries.length === 0 && (
                <Button onClick={() => setIsWriting(true)} className="mobile-button touch-target">
                  <Plus className="w-4 h-4 mr-2" />
                  Write First Entry
                </Button>
              )}
            </Card>
          ) : (
            filteredEntries.map((entry) => (
              <Card key={entry.id} className="mobile-card mobile-card-interactive">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 dark:text-white flex-1 mobile-text">{entry.title}</h3>
                  <div className="flex items-center mobile-subtext text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(entry.date).toLocaleDateString()}
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mobile-text mb-4 line-clamp-3">{entry.content}</p>

                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="mobile-subtext">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Stats */}
        {journalEntries.length > 0 && (
          <Card className="mt-6 mobile-card">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4 mobile-heading">Your Progress</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{journalEntries.length}</div>
                <div className="mobile-subtext text-gray-600 dark:text-gray-400">Total Entries</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(
                    journalEntries.reduce((sum, entry) => sum + entry.content.length, 0) / journalEntries.length,
                  )}
                </div>
                <div className="mobile-subtext text-gray-600 dark:text-gray-400">Avg. Length</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.max(
                    ...journalEntries.map((entry) =>
                      Math.floor((Date.now() - entry.timestamp) / (1000 * 60 * 60 * 24)),
                    ),
                  ) === 0
                    ? 1
                    : Math.max(
                        ...journalEntries.map((entry) =>
                          Math.floor((Date.now() - entry.timestamp) / (1000 * 60 * 60 * 24)),
                        ),
                      )}
                </div>
                <div className="mobile-subtext text-gray-600 dark:text-gray-400">Day Streak</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
