import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'

import { QueryClientWrapper } from '@/components/QueryClientProvider'
import { ToasterProvider } from '@/components/Toast'

const montserrat = Montserrat({
  weight: ['500', '600', '700', '800'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['sans-serif'],
})

export const metadata: Metadata = {
  title: 'Ubatuba Events Tracker',
  description: 'Web application to track events in Ubatuba (SP)',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} relative antialiased`}>
        <ToasterProvider />
        <QueryClientWrapper>{children}</QueryClientWrapper>
      </body>
    </html>
  )
}
