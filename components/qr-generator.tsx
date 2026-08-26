"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCode, Download, Share } from "lucide-react"

interface QRGeneratorProps {
  emergencyContact?: string
  userProfile?: any
}

export default function QRGenerator({ emergencyContact, userProfile }: QRGeneratorProps) {
  const [customMessage, setCustomMessage] = useState("")
  const [meetingPoint, setMeetingPoint] = useState("")

  const generateQRData = () => {
    const qrData = {
      type: "emergency",
      name: userProfile?.name || "MoodMate User",
      emergency_contact: emergencyContact || "Not set",
      meeting_point: meetingPoint || "Not specified",
      message: customMessage || "I need help. Please contact my emergency contact.",
      app: "MoodMate",
      timestamp: new Date().toISOString(),
    }
    return JSON.stringify(qrData)
  }

  const downloadQR = () => {
    // In a real app, this would generate an actual QR code
    const qrData = generateQRData()
    const blob = new Blob([qrData], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "MoodMate-emergency-qr.txt"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const shareQR = async () => {
    const qrData = generateQRData()

    if (navigator.share) {
      try {
        await navigator.share({
          title: "MoodMate Emergency QR",
          text: "Emergency contact information",
          url: `data:text/plain,${encodeURIComponent(qrData)}`,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(qrData)
      alert("Emergency data copied to clipboard!")
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="text-center space-y-4">
          <QrCode className="w-16 h-16 mx-auto text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-800">Emergency QR Code</h3>
          <p className="text-sm text-gray-600">
            This QR code contains your emergency contact information for first responders
          </p>
        </div>

        {/* QR Code Placeholder */}
        <div className="mt-6 p-8 bg-gray-100 rounded-lg">
          <div className="w-48 h-48 mx-auto bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <QrCode className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-xs text-gray-500">QR Code would appear here</p>
              <p className="text-xs text-gray-400 mt-1">
                Contains: {userProfile?.name}, {emergencyContact}
              </p>
            </div>
          </div>
        </div>

        {/* Customization */}
        <div className="mt-6 space-y-4">
          <div>
            <Label htmlFor="meeting-point">Safe Meeting Point (Optional)</Label>
            <Input
              id="meeting-point"
              placeholder="e.g., Main entrance of City Hospital"
              value={meetingPoint}
              onChange={(e) => setMeetingPoint(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="custom-message">Custom Message (Optional)</Label>
            <Input
              id="custom-message"
              placeholder="Additional information for responders"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex space-x-3">
          <Button onClick={downloadQR} variant="outline" className="flex-1 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button onClick={shareQR} className="flex-1 bg-blue-500 hover:bg-blue-600">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">How to Use</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• Save this QR code to your phone's photos</p>
            <p>• Print and keep in your wallet or bag</p>
            <p>• Show to emergency responders when needed</p>
            <p>• Update regularly if contact info changes</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
