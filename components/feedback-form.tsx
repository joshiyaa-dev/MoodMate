"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Send, Star } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface FeedbackFormProps {
  onBack: () => void
}

interface FeedbackEntry {
  id: string
  type: string
  rating: number
  subject: string
  message: string
  timestamp: number
  status: "pending" | "sent"
}

export default function FeedbackForm({ onBack }: FeedbackFormProps) {
  const [feedbackType, setFeedbackType] = useState("")
  const [rating, setRating] = useState(0)
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedbackHistory, setFeedbackHistory] = useLocalStorage<FeedbackEntry[]>("feedback_history", [])

  const feedbackTypes = [
    { value: "bug", label: "Bug Report" },
    { value: "feature", label: "Feature Request" },
    { value: "improvement", label: "Improvement Suggestion" },
    { value: "general", label: "General Feedback" },
    { value: "support", label: "Support Request" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedbackType || !subject || !message) return

    setIsSubmitting(true)

    const newFeedback: FeedbackEntry = {
      id: Date.now().toString(),
      type: feedbackType,
      rating,
      subject: subject.trim(),
      message: message.trim(),
      timestamp: Date.now(),
      status: "pending", // Will be sent when online
    }

    setFeedbackHistory([newFeedback, ...feedbackHistory])

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)

    // Reset form
    setFeedbackType("")
    setRating(0)
    setSubject("")
    setMessage("")

    alert("Thank you for your feedback! It will be sent when you're online.")
  }

  const renderStarRating = () => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className={`p-1 transition-colors ${
            star <= rating ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400"
          }`}
        >
          <Star className="w-6 h-6 fill-current" />
        </button>
      ))}
    </div>
  )

  return (
    <div className="mobile-container bg-gradient-to-br from-green-50 to-blue-50">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="mobile-button">
          <ArrowLeft className="mobile-icon" />
        </Button>
        <h1 className="text-lg font-bold text-gray-800 flex-1 text-center mx-2">Send Feedback</h1>
        <div className="w-8" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Card className="mobile-card">
          <div className="space-y-3">
            <div>
              <Label htmlFor="feedback-type" className="text-xs">Feedback Type</Label>
              <Select value={feedbackType} onValueChange={setFeedbackType}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select feedback type" />
                </SelectTrigger>
                <SelectContent>
                  {feedbackTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Overall Rating (Optional)</Label>
              <div className="mt-2">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-1 transition-colors active:scale-95 ${
                        star <= rating ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400"
                      }`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-xs text-gray-600 mt-1">
                    {rating === 1
                      ? "Poor"
                      : rating === 2
                        ? "Fair"
                        : rating === 3
                          ? "Good"
                          : rating === 4
                            ? "Very Good"
                            : "Excellent"}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="subject" className="text-xs">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief description of your feedback"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-xs">Message</Label>
              <Textarea
                id="message"
                placeholder="Please provide detailed feedback. Include steps to reproduce if reporting a bug."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
                className="text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">{message.length}/1000 characters</p>
            </div>
          </div>
        </Card>

        <Button
          type="submit"
          disabled={!feedbackType || !subject || !message || isSubmitting}
          className="w-full bg-green-500 hover:bg-green-600 mobile-button"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-3 h-3 mr-2" />
              Send Feedback
            </>
          )}
        </Button>
      </form>

      {/* Feedback History */}
      {feedbackHistory.length > 0 && (
        <Card className="mt-4 mobile-card">
          <h3 className="font-semibold text-gray-800 mb-3 mobile-text">Previous Feedback</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {feedbackHistory.slice(0, 5).map((feedback) => (
              <div key={feedback.id} className="p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-800 truncate flex-1">{feedback.subject}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded flex-shrink-0 ml-2 ${
                      feedback.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                    }`}
                  >
                    {feedback.status}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {feedbackTypes.find((t) => t.value === feedback.type)?.label} •{" "}
                  {new Date(feedback.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Info */}
      <Card className="mt-4 mobile-card bg-gradient-to-r from-blue-100 to-purple-100">
        <h4 className="font-semibold text-gray-800 mb-2 mobile-text">About Feedback</h4>
        <div className="text-xs text-gray-700 space-y-1">
          <p>• Feedback is stored locally until you're online</p>
          <p>• We read every piece of feedback carefully</p>
          <p>• Bug reports help us improve the app</p>
          <p>• Feature requests guide our development</p>
        </div>
      </Card>
    </div>
  )
}
