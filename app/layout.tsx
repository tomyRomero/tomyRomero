import type { Metadata } from 'next'
import { Lora } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/lib/AppContext'
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react"
import NavBar from '@/components/nav/NavBar';

export const metadata: Metadata = {
  title: 'tomyRomero',
  description: 'Tomy Romero Portfolio',
}

const interTight = Lora({
  subsets: ["latin"],
  weight: ["400", "500", '600', '700']
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${interTight.className}  z-0`} >
        <AppProvider>
          <NavBar />
          <div className='mt-14 max-sm:mt-2' >
          {children}
          <Analytics />
          </div>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  )
}
