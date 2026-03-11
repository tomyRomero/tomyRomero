import type { Metadata } from 'next'
import { Instrument_Serif, DM_Sans, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/lib/AppContext'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  title: 'Tomy Romero Seas — Portfolio',
  description: 'Full-stack Software Engineer & SaaS Founder',
}

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${dmSans.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <AppProvider>
          {children}
          <Analytics />
        </AppProvider>
      </body>
    </html>
  )
}
