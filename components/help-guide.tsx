"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, ChevronRight, Book, Heart, MessageCircle, Shield, TrendingUp, Settings } from "lucide-react"

interface HelpGuideProps {
  onBack: () => void
}

interface HelpSection {
  id: string
  title: string
  icon: any
  content: HelpItem[]
}

interface HelpItem {
  question: string
  answer: string
}

export default function HelpGuide({ onBack }: HelpGuideProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  const helpSections: HelpSection[] = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: Book,
      content: [
        {
          question: "How do I set up my profile?",
          answer:
            "Go to Settings > Profile to update your name, age, language, and emergency contact. This information is stored locally on your device for privacy.",
        },
        {
          question: "Is my data safe and private?",
          answer:
            "Yes! MoodMate stores all your data locally on your device. Nothing is sent to external servers, ensuring complete privacy and offline functionality.",
        },
        {
          question: "How do I change the app theme?",
          answer:
            "Go to Settings > Appearance to switch between Light, Dark, or Auto themes. You can also adjust font size for better readability.",
        },
      ],
    },
    {
      id: "mood-tracking",
      title: "Mood Tracking",
      icon: Heart,
      content: [
        {
          question: "How often should I check in with my mood?",
          answer:
            "Daily check-ins are recommended for the best insights. You can set up reminders in Settings > Notifications to help maintain consistency.",
        },
        {
          question: "What do the mood numbers mean?",
          answer:
            "The scale goes from 1 (Very Sad) to 5 (Very Happy). 3 represents a neutral mood. Track honestly to get accurate insights over time.",
        },
        {
          question: "Can I edit past mood entries?",
          answer:
            "Currently, mood entries cannot be edited once saved. This helps maintain the integrity of your mood patterns and trends.",
        },
      ],
    },
    {
      id: "journaling",
      title: "Journaling",
      icon: MessageCircle,
      content: [
        {
          question: "How do I record voice entries?",
          answer:
            "In the Journal section, tap the microphone icon to record voice entries. The app will transcribe your speech for easy reading later.",
        },
        {
          question: "What are journal tags?",
          answer:
            "Tags are automatically generated based on emotional keywords in your entries. They help categorize and analyze your writing patterns.",
        },
        {
          question: "How does the AI summary work?",
          answer:
            "The AI analyzes your recent journal entries to provide insights about your emotional patterns, writing themes, and personal growth.",
        },
      ],
    },

    {
      id: "self-care",
      title: "Self-Care Tools",
      icon: Heart,
      content: [
        {
          question: "How do I use the breathing exercises?",
          answer:
            "Try the 4-7-8 technique: inhale for 4 seconds, hold for 7, exhale for 8. The Breathing Bubble provides visual guidance to help you follow along.",
        },
        {
          question: "What's the Gratitude Spinner?",
          answer:
            "Spin the wheel to get random gratitude prompts. Reflecting on positive aspects of life can improve mood and overall well-being.",
        },
        {
          question: "Can I use the music player offline?",
          answer:
            "Yes! All nature sounds and ambient music are stored locally. Use headphones for the best relaxation experience.",
        },
      ],
    },
    {
      id: "crisis-support",
      title: "Crisis Support",
      icon: Shield,
      content: [
        {
          question: "When should I use the Crisis Plan?",
          answer:
            "Use it when you're feeling overwhelmed, having thoughts of self-harm, or need immediate support. It contains emergency contacts and coping strategies.",
        },
        {
          question: "How do I set up emergency contacts?",
          answer:
            "Go to Settings > Profile to add emergency contacts. Also update your Crisis Plan with trusted people and safe places.",
        },
        {
          question: "What's the Emergency QR code for?",
          answer:
            "The QR code contains your emergency contact info for first responders. Save it to your phone or print it to keep in your wallet.",
        },
      ],
    },
    {
      id: "analytics",
      title: "Analytics & Insights",
      icon: TrendingUp,
      content: [
        {
          question: "How do I read my mood trends?",
          answer:
            "The 7-day trend shows your mood patterns over time. Look for upward trends (improvement) or concerning downward patterns.",
        },
        {
          question: "What are AI insights?",
          answer:
            "AI analyzes your mood and journal data to identify patterns, suggest improvements, and alert you to concerning trends.",
        },
        {
          question: "How accurate are the mood predictions?",
          answer:
            "Predictions improve with more data. Consistent daily check-ins for 2+ weeks provide the most accurate insights and recommendations.",
        },
      ],
    },
    {
      id: "settings",
      title: "Settings & Data",
      icon: Settings,
      content: [
        {
          question: "How do I export my data?",
          answer:
            "Go to Settings > Data Management > Export My Data. This downloads a JSON file with all your mood entries, journal entries, and settings.",
        },
        {
          question: "Can I clear all my data?",
          answer:
            "Yes, but this action cannot be undone. Go to Settings > Data Management > Clear All Data. Consider exporting first as a backup.",
        },
        {
          question: "How do notifications work?",
          answer:
            "Enable notifications in Settings > Notifications. You can set reminders for mood check-ins, journaling, self-care, and weekly reports.",
        },
      ],
    },
  ]

  const filteredSections = helpSections
    .map((section) => ({
      ...section,
      content: section.content.filter(
        (item) =>
          item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((section) => section.content.length > 0 || searchTerm === "")

  const renderSectionList = () => (
    <div className="space-y-3">
      {filteredSections.map((section) => (
        <Card
          key={section.id}
          className="p-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setSelectedSection(section.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <section.icon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{section.title}</h3>
                <p className="text-sm text-gray-600">{section.content.length} articles</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </Card>
      ))}
    </div>
  )

  const renderSectionContent = () => {
    const section = helpSections.find((s) => s.id === selectedSection)
    if (!section) return null

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <section.icon className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">{section.title}</h2>
        </div>

        {section.content.map((item, index) => (
          <Card key={index} className="overflow-hidden">
            <button
              className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
              onClick={() =>
                setExpandedItem(expandedItem === `${section.id}-${index}` ? null : `${section.id}-${index}`)
              }
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-800">{item.question}</h3>
                <ChevronRight
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    expandedItem === `${section.id}-${index}` ? "rotate-90" : ""
                  }`}
                />
              </div>
            </button>
            {expandedItem === `${section.id}-${index}` && (
              <div className="px-4 pb-4 border-t bg-gray-50">
                <p className="text-sm text-gray-700 pt-3">{item.answer}</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="mobile-container bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={selectedSection ? () => setSelectedSection(null) : onBack} className="mobile-button">
          <ArrowLeft className="mobile-icon" />
        </Button>
        <h1 className="text-lg font-bold text-gray-800 flex-1 text-center mx-2">{selectedSection ? "Help Articles" : "Help Guide"}</h1>
        <div className="w-8" />
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search help articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 text-sm"
        />
      </div>

        {selectedSection ? renderSectionContent() : renderSectionList()}

      {/* Contact Support */}
      <Card className="mt-6 mobile-card bg-gradient-to-r from-purple-100 to-pink-100">
        <h3 className="font-semibold text-gray-800 mb-2 mobile-text">Still Need Help?</h3>
        <p className="text-xs text-gray-700 mb-3">
          If you can't find what you're looking for, you can send feedback through the app settings.
        </p>
        <Button variant="outline" size="sm" className="w-full bg-transparent mobile-button">
          Send Feedback
        </Button>
      </Card>
    </div>
  )
}
