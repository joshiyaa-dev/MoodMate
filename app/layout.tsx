import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import '../styles/mobile-keyboard.css'
import MobileLayoutWrapper from '@/components/mobile-layout-wrapper'

export const metadata: Metadata = {
  title: 'MOOD MATE',
  description: 'Your Personal Mental Health Companion - AI-powered offline mental health support',
  generator: 'MOOD MATE',
  applicationName: 'MOOD MATE',
  keywords: ['mental health', 'wellness', 'self-care', 'mood tracking', 'AI companion'],
  authors: [{ name: 'MOOD MATE Team' }],
  creator: 'MOOD MATE',
  publisher: 'MOOD MATE',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/assets/icons/icon-192.webp',
    shortcut: '/favicon.ico',
  },

}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  height: 'device-height',
  themeColor: '#667eea',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="mobile-constrained">
        <MobileLayoutWrapper>
          {children}
        </MobileLayoutWrapper>
      </body>
    </html>
  )
}
